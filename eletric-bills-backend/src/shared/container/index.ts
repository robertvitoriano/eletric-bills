import { container } from "tsyringe";
import { CustomersRepository } from "../../domain/infra/repositories/ICustomersRepository";
import { IInvoicesRepository } from "../../domain/infra/repositories/IInvoiceRepository";
import { ICustomersRepository } from "../../domain/repositories/ICustomersRepository";
import { InvoicesRepository } from "../../domain/repositories/InvoicesRepository";

container.registerSingleton<ICustomersRepository>(
  "CustumersRepository",
  CustomersRepository
);

container.registerSingleton<IInvoicesRepository>(
  "InvoicesRepository",
  InvoicesRepository
);
