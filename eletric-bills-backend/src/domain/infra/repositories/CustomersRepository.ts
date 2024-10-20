import { Repository } from "typeorm";
import { PostgresDataSource } from "../../../shared/infra/database/PostgresDataSource";
import { Customer } from "../../entities/Customer";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
class CustomersRepository implements ICustomersRepository {
  private customerRepository: Repository<Customer>;

  constructor() {
    this.customerRepository = PostgresDataSource.getRepository(Customer);
  }
  async getTotal(data: { year?: number; customerId?: string }): Promise<number> {
    const { year, customerId } = data;

    const queryBuilder = this.customerRepository.createQueryBuilder("customer");

    if (customerId) {
      queryBuilder.where("customer.id = :customerId", { customerId });
    }

    if (year) {
      queryBuilder.andWhere("EXTRACT(YEAR FROM invoice.due_date) = :year", { year });
    }

    const total = await queryBuilder.getCount();
    return total;
  }

  async list(data: { page?: number; year?: number; customerId?: string }) {
    const { page = 1, year, customerId } = data;
    const limit = 10;
    const offset = (page - 1) * limit || 0;

    const queryBuilder = this.customerRepository
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.invoices", "invoice")
      .leftJoinAndSelect("invoice.invoice_items", "invoiceItems")
      .innerJoinAndSelect("invoiceItems.invoiceItemType", "invoiceItemTypes");

    if (customerId) {
      queryBuilder.where("customer.id = :customerId", { customerId });
    }

    if (year) {
      queryBuilder.andWhere("EXTRACT(YEAR FROM invoice.due_date) = :year", { year });
    }

    queryBuilder.skip(offset).take(limit);

    const customers = await queryBuilder.getMany();

    return customers.map((customer) => ({
      ...customer,
      installationNumber: customer["installation_number"],
      customerNumber: customer["customer_number"],
    }));
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
