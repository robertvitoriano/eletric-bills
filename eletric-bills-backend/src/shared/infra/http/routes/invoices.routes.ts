import { Router } from "express";
import { CreateInvoiceController } from "../../../../domain/infra/controllers/CreateInvoiceController";
import uploadConfig from "../../../../config/upload";
import multer from "multer";
import { InvoiceDownloadController } from "../../../../domain/infra/controllers/InvoiceDownloadController";

const invoicesRouter = Router();
const createInvoiceController = new CreateInvoiceController();
const invoiceDownloadController = new InvoiceDownloadController();
const upload = multer(uploadConfig.upload("./tmp/"));
invoicesRouter.post("/", upload.fields([{ name: "invoices" }]), createInvoiceController.handle);
invoicesRouter.get("/download/:invoiceId", invoiceDownloadController.handle);

export { invoicesRouter };
