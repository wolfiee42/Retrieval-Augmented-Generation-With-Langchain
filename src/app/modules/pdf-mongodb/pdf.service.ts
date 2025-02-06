import { pipeline } from '@xenova/transformers';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { getEmbeddings } from './get-embeddings.js';
import * as fs from 'fs';
import { model, Schema } from 'mongoose';


//model
const Pdf = model('pdf', new Schema({
    document: { required: true },
    embedding: { required: true },
}))



// Function to generate embeddings for a given data source
export async function getEmbedding(data: string | string[]) {
    const embedder = await pipeline(
        'feature-extraction',
        'Xenova/nomic-embed-text-v1');
    const results = await embedder(data, { pooling: 'mean', normalize: true });
    return Array.from(results.data);
}



const run = async () => {

    try {
        // Save online PDF as a file
        const rawData = await fetch("https://investors.mongodb.com/node/12236/pdf");
        const pdfBuffer = await rawData.arrayBuffer();
        const pdfData = Buffer.from(pdfBuffer);
        fs.writeFileSync("investor-report.pdf", pdfData);

        const loader = new PDFLoader(`investor-report.pdf`);
        const data = await loader.load();

        // Chunk the text from the PDF
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 400,
            chunkOverlap: 20,
        });
        const docs = await textSplitter.splitDocuments(data);
        console.log(`Successfully chunked the PDF into ${docs.length} documents.`);

        console.log("Generating embeddings and inserting documents.");
        let docCount = 0;
        await Promise.all(docs.map(async doc => {
            const embeddings = await getEmbedding(doc.pageContent);
            // Insert the embeddings and the chunked PDF data into Atlas
            await Pdf.create({
                document: doc,
                embedding: embeddings,
            });
            docCount += 1;
        }))
        console.log(`Successfully inserted ${docCount} documents.`);
    } catch (err) {
        console.log(err.stack);
    }
}

export const pdfService = {
    run
}