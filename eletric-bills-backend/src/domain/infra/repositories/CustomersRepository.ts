import { Repository } from "typeorm";
import { PostgresDataSource } from "../../../shared/infra/database/PostgresDataSource";
import { Customer } from "../../entities/Customer";
class CustomersRepository implements CustomersRepository {
  private customerRepository: Repository<Customer>;

  constructor() {
    this.customerRepository = PostgresDataSource.getRepository(Customer);
  }

  async store(customerData: Customer): Promise<Customer> {
    const customer = this.customerRepository.create(customerData);
    return await this.customerRepository.save(customer);
  }
}

export { CustomersRepository };
