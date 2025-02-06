import { Router } from "express";
import pdfRoutes from "../modules/pdf-mongodb/pdf.routes";

const router = Router();


const moduleRoutes = [
    {
        path: '/pdf',
        route: pdfRoutes
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route))


export default router;