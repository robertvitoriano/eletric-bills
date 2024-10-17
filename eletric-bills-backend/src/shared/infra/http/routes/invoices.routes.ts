import { Router } from "express";
import { CreateInvoiceController } from "../../../../modules/invoices/useCases/CreateInvoiceController";

const invoicesRouter = Router();
const invoicesController = new CreateInvoiceController();
invoicesRouter.get("/:instalationId/:year", invoicesController.handle);
export { invoicesRouter };
