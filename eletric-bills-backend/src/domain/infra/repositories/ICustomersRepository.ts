import { Customer } from "../../entities/Customer";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
import { Repository, getRepository } from "typeorm";

class CustomersRepository implements ICustomersRepository {
  private repository: Repository<Customer>;

  constructor() {
    this.repository = getRepository(Customer);
  }
}

export { CustomersRepository };
