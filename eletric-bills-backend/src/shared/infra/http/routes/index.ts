import { Router } from "express";

import { billsRouter } from "./bills.routes";
import { customersRouter } from "./customers.routes";
const router = Router();

router.use("/bills", billsRouter);
router.use("/customers", customersRouter);

export { router };
