import { container } from "tsyringe";
import { CustomersRepository } from "../../core/infra/repositories/CustomersRepository";
import { IInvoicesRepository } from "../../core/infra/repositories/IInvoiceRepository";
import { ICustomersRepository } from "../../core/repositories/ICustomersRepository";
import { InvoicesRepository } from "../../core/repositories/InvoicesRepository";

container.registerSingleton<ICustomersRepository>(
  "CustumersRepository",
  CustomersRepository
);

container.registerSingleton<IInvoicesRepository>(
  "InvoicesRepository",
  InvoicesRepository
);
