import { Router } from "express";
import { pdfController } from "./pdf.controller";

const router = Router();

router.post("/take_notes", pdfController.takeNotes);

export const PdfRoutes = router;