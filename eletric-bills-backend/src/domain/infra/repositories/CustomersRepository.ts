import { Repository } from "typeorm";
import { PostgresDataSource } from "../../../shared/infra/database/PostgresDataSource";
import { Customer } from "../../entities/Customer";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
class CustomersRepository implements ICustomersRepository {
  private customerRepository: Repository<Customer>;

  constructor() {
    this.customerRepository = PostgresDataSource.getRepository(Customer);
  }

  async list(data: { page?: number; year?: number; customerId?: string }) {
    const { page = 1, year, customerId } = data;
    const limit = 10;
    const offset = (page - 1) * limit || 0;

    const queryBuilder = this.customerRepository
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.invoices", "invoice");

    if (customerId) {
      queryBuilder.where("customer.id = :customerId", { customerId });
    }

    if (year) {
      queryBuilder.andWhere("EXTRACT(YEAR FROM invoice.due_date) = :year", { year });
    }

    queryBuilder.skip(offset).take(limit);

    const customers = await queryBuilder.getMany();

    return customers[0];
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
