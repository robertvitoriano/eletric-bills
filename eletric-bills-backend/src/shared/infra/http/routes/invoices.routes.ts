import { Router } from "express";
import { CreateInvoiceController } from "../../../../domain/infra/controllers/CreateInvoiceController";
import uploadConfig from "../../../../config/upload";
import multer from "multer";
import { InvoiceDownloadController } from "../../../../domain/infra/controllers/InvoiceDownloadController";
import { GetStatisticsController } from "../../../../domain/infra/controllers/GetStatisticsController";

const invoicesRouter = Router();
const createInvoiceController = new CreateInvoiceController();
const invoiceDownloadController = new InvoiceDownloadController();
const getStatisticsController = new GetStatisticsController();

const upload = multer(uploadConfig.upload("./tmp/"));
invoicesRouter.post("/", upload.fields([{ name: "invoices" }]), createInvoiceController.handle);
invoicesRouter.get("/download/:invoiceId", invoiceDownloadController.handle);
invoicesRouter.get("/statistics", getStatisticsController.handle);

export { invoicesRouter };
