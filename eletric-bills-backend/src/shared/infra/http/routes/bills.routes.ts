import { Router } from "express";
import { CreateBillController } from "../../../../modules/bills/useCases/CreateBillController";

const billsRouter = Router();
const billController = new CreateBillController();
billsRouter.get("/:instalationId/:year", billController.handle);
export { billsRouter };
