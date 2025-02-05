export async function takeNotes(
    paperUrl: string,
    name: string,
    pagesToDelete?: number[]
): Promise<ArxivPaperNote[]> {
    const database = await SupabaseDatabase.fromExistingIndex();
    const existingPaper = await database.getPaper(paperUrl);
    if (existingPaper) {
        return existingPaper.notes as Array<ArxivPaperNote>;
    }

    let pdfAsBuffer = await loadPdfFromUrl(paperUrl);
    if (pagesToDelete && pagesToDelete.length > 0) {
        pdfAsBuffer = await deletePagesFromPdf(pdfAsBuffer, pagesToDelete);
    }
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
        database.addPaper({
            paper: formatDocumentsAsString(newDocs),
            url: paperUrl,
            notes,
            name,
        }),
        database.vectorStore.addDocuments(newDocs),
    ]);
    return notes;
}