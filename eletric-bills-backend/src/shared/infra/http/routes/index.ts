import { Router } from "express";

import { invoicesRouter } from "./invoices.routes";
import { customersRouter } from "./customers.routes";
const router = Router();

router.use("/invoices", invoicesRouter);
router.use("/customers", customersRouter);

export { router };
