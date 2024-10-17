import { container } from "tsyringe";
import { ICustomersRepository } from "../../modules/customers/repositories/ICustomersRepository";
import { CustomersRepository } from "../../modules/customers/infra/repositories/CustomersRepository";
import { IInvoicesRepository } from "../../modules/invoices/repositories/IInvoiceRepository";
import { InvoicesRepository } from "../../modules/invoices/infra/repositories/InvoicesRepository";
container.registerSingleton<ICustomersRepository>(
  "CustumersRepository",
  CustomersRepository
);

container.registerSingleton<IInvoicesRepository>(
  "InvoicesRepository",
  InvoicesRepository
);
