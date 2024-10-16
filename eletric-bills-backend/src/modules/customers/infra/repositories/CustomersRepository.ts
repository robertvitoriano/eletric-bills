import { ICustomersRepository } from "../../repositories/ICustomersRepository";
import { Customer } from "../typeorm/entities/Customer";
import { Repository, getRepository } from "typeorm";

class CustomersRepository implements ICustomersRepository {
  private repository: Repository<Customer>;

  constructor() {
    this.repository = getRepository(Customer);
  }
}

export { CustomersRepository };
