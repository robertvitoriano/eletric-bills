import { container } from "tsyringe";
import { CustomersRepository } from "../../domain/infra/repositories/CustomersRepository";
import { InvoicesRepository } from "../../domain/infra/repositories/InvoicesRepository";
import { ICustomersRepository } from "../../domain/repositories/ICustomersRepository";
import { IInvoicesRepository } from "../../domain/repositories/IInvoicesRepository";

container.registerSingleton<ICustomersRepository>(
  "CustomersRepository",

  CustomersRepository
);

container.registerSingleton<IInvoicesRepository>("InvoicesRepository", InvoicesRepository);
