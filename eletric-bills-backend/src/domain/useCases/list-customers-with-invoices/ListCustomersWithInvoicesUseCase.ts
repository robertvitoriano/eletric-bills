import { inject, injectable } from "tsyringe";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";

@injectable()
export class ListCustomersWithInvoicesUseCase {
  constructor(@inject("CustomersRepository") private customersReposirory: ICustomersRepository) {}
  async execute(data: { page?: number; year?: number; customerNumber?: string; name: string }): Promise<any> {
    const { customerNumber, page, year } = data;

    let customerId = "";
    if (customerNumber) {
      const { id } = await this.customersReposirory.find({ customer_number: customerNumber });
      customerId = id;
    }

    const invoices = this.customersReposirory.list({ page: Number(page), year, customerId: customerId });

    return invoices;
  }
}
