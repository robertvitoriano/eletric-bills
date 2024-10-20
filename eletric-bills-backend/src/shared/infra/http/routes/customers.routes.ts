import { Router } from "express";
import { ListCustomersWithInvoicesController } from "../../../../domain/infra/controllers/ListCustomersWithInvoicesController";

const customersRouter = Router();
const listCustomersWithInvoicesController = new ListCustomersWithInvoicesController();

customersRouter.get("/", listCustomersWithInvoicesController.handle);

export { customersRouter };
