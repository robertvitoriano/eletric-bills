import { Repository } from "typeorm";
import { PostgresDataSource } from "../../../shared/infra/database/PostgresDataSource";
import { Customer } from "../../entities/Customer";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
class CustomersRepository implements ICustomersRepository {
  private customerRepository: Repository<Customer>;

  constructor() {
    this.customerRepository = PostgresDataSource.getRepository(Customer);
  }

  async store(customerData: Omit<Customer, "id" | "consumptions" | "invoices">): Promise<Customer> {
    const customer = this.customerRepository.create(customerData);
    return await this.customerRepository.save(customer);
  }
  async find(data: Partial<Customer>): Promise<Customer | null> {
    const customer = await this.customerRepository.findOne({
      where: { ...data },
    });
    return customer;
  }
}

export { CustomersRepository };
