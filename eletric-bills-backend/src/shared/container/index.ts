import { container } from "tsyringe";
import { ICustomersRepository } from "../../modules/customers/repositories/ICustomersRepository";
import { IBillsRepository } from "../../modules/bills/infra/repositories/IBillsRepository";
import { BillsRepository } from "../../modules/bills/infra/repositories/BillsRepository";
import { CustomersRepository } from "../../modules/customers/infra/repositories/CustomersRepository";
container.registerSingleton<ICustomersRepository>(
  "CustumersRepository",
  CustomersRepository
);

container.registerSingleton<IBillsRepository>(
  "BillsRepository",
  BillsRepository
);
