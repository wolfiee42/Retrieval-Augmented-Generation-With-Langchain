import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { pdfService } from "./pdf.service";

const takeNotes = catchAsync(async (req: Request, res: Response) => {
    const { paperUrl, name, } = req.body;

    const notes = await pdfService.takeNotes(paperUrl, name);
    res.status(200).send(notes);
    return;
})

export const pdfController = {
    takeNotes,
}