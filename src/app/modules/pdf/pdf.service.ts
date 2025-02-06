import { formatDocumentsAsString } from "langchain/util/document";
import { addPaper, convertPdfToDocuments, generateNotes, loadPdfFromUrl } from "./pdf.helper";
import { Pdf } from "./pdf.model";

async function takeNotes(
    paperUrl: string,
    name: string,
): Promise<ArxivPaperNote[]> {
    const existingPaper = await Pdf.findOne({ url: paperUrl });
    if (existingPaper) {
        return existingPaper.notes as Array<ArxivPaperNote>;
    }

    const pdfAsBuffer = await loadPdfFromUrl(paperUrl);
    const documents = await convertPdfToDocuments(pdfAsBuffer);
    const notes = await generateNotes(documents);
    const newDocs: Array<Document> = documents.map((doc) => ({
        ...doc,
        metadata: {
            ...doc.metadata,
            url: paperUrl,
        },
    }));
    await Promise.all([
        addPaper({
            paper: formatDocumentsAsString(newDocs),
            url: paperUrl,
            notes,
            name,
        }),
        database.vectorStore.addDocuments(newDocs),
    ]);
    return notes;
}

export const pdfService = {
    takeNotes,
};
