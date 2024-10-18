import { Router } from "express";
import { CreateInvoiceController } from "../../../../domain/infra/controllers/CreateInvoiceController";

const customersRouter = Router();
const createInvoiceController = new CreateInvoiceController();
customersRouter.get("/", createInvoiceController.handle);

export { customersRouter };
