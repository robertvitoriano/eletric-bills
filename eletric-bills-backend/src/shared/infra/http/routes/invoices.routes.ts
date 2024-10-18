import { Router } from "express";
import { CreateInvoiceController } from "../../../../domain/infra/controllers/CreateInvoiceController";
import uploadConfig from "../../../../config/upload";
import multer from "multer";

const invoicesRouter = Router();
const createInvoiceController = new CreateInvoiceController();
const upload = multer(uploadConfig.upload("./tmp/"));
invoicesRouter.post(
  "/",
  upload.fields([{ name: "invoice" }]),
  createInvoiceController.handle
);

export { invoicesRouter };
