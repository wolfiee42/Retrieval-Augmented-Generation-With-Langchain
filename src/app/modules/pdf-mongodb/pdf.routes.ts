import { Router } from "express";
import { pdfService } from "./pdf.service";

const router = Router();

router.post('/', pdfService.run)

export default router;