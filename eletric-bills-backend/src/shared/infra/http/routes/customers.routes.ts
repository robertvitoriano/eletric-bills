import { Router } from "express";
import { ListInvoicesByCustomerController } from "../../../../domain/infra/controllers/ListInvoicesByUserController";

const customersRouter = Router();
const listInvoicesByCustomerController = new ListInvoicesByCustomerController();
customersRouter.get("/", listInvoicesByCustomerController.handle);
export { customersRouter };
