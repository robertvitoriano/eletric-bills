import { Router } from "express";
import { CreateBillController } from "../../../../modules/bills/useCases/CreateBillController";

const customersRouter = Router();
const createBillController = new CreateBillController();
customersRouter.get("/", createBillController.handle);

export { customersRouter };
