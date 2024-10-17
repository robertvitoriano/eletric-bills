import { Router } from "express";
import { CreateInvoiceController } from "../../../../modules/invoices/useCases/CreateInvoiceController";

const customersRouter = Router();
const createInvoiceController = new CreateInvoiceController();
customersRouter.get("/", createInvoiceController.handle);

export { customersRouter };
