import axios from "axios";
import { writeFile, unlink } from "fs/promises";
import { Document } from "@langchain/core/documents";
import { formatDocumentsAsString } from "langchain/util/document";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { ChatOpenAI } from "langchain/chat_models/openai";

import configuration from "../../configaration";
import { NOTE_PROMPT, NOTES_TOOL_SCHEMA, outputParser } from "./pdf.interface";
import { Pdf } from "./pdf.model";

export async function loadPdfFromUrl(url: string): Promise<Buffer> {
    const response = await axios({
        method: "GET",
        url,
        responseType: "arraybuffer",
    });
    return response.data;
}

export async function convertPdfToDocuments(pdf: Buffer): Promise<Array<Document>> {
    if (!configuration.unstructured_api_key) {
        throw new Error("Missing UNSTRUCTURED_API_KEY");
    }
    const randomName = Math.random().toString(36).substring(7);
    const pdfPath = `pdfs/${randomName}.pdf`;
    await writeFile(pdfPath, pdf, "binary");
    const loader = new UnstructuredLoader(pdfPath, {
        apiKey: configuration.unstructured_api_key,
        strategy: "hi_res",
    });
    const docs = await loader.load();
    /** Delete the temporary PDF file. */
    await unlink(pdfPath);
    return docs;
}

export async function generateNotes(
    documents: Array<Document>
): Promise<Array<ArxivPaperNote>> {
    const documentsAsString = formatDocumentsAsString(documents);
    const model = new ChatOpenAI({
        modelName: "gpt-4-1106-preview",
        temperature: 0,
    });
    const modelWithTools = model.bind({
        tools: [NOTES_TOOL_SCHEMA],
        tool_choice: "auto",
    });
    const chain = NOTE_PROMPT.pipe(modelWithTools).pipe(outputParser);
    const response = await chain.invoke({
        paper: documentsAsString,
    });
    return response;
}

export async function addPaper({
    paper,
    url,
    notes,
    name,
}: {
    paper: string;
    url: string;
    notes: Array<ArxivPaperNote>;
    name: string;
}): Promise<void> {
    const paperData = {
        paper,
        arxiv_url: url,
        notes,
        name,
    };
    const result = await Pdf.collection.insertOne(paperData);
    if (!result.acknowledged) {
        throw new Error("Error adding paper to database");
    }
}