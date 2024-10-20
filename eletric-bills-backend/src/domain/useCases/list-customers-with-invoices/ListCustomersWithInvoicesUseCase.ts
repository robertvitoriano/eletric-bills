import { inject, injectable } from "tsyringe";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";

@injectable()
export class ListCustomersWithInvoicesUseCase {
  constructor(
    @inject("CustomersRepository") private customersReposirory: ICustomersRepository,
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository
  ) {}
  async execute(data: { page?: number; year?: number; customerNumber?: string; name: string }): Promise<any> {
    const { customerNumber, page, year } = data;

    let customerId = "";
    if (customerNumber) {
      const { id } = await this.customersReposirory.find({ customer_number: customerNumber });
      customerId = id;
    }
    const limit = 10;
    const customers = await this.customersReposirory.list({
      page: Number(page),
      year,
      customerId: customerId,
      limit,
    });
    const total = await this.customersReposirory.getTotal({ year, customerId: customerId });
    const availableYears = await this.invoicesRepository.getAvailableYears();
    return {
      pagination: {
        customersFetched: customers.length,
        currentPage: page || 1,
        total,
        pageTotal: Math.ceil(total / limit),
        perPage: limit,
      },
      customers,
      availableYears,
    };
  }
}
