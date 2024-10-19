import { inject, injectable } from "tsyringe";
import { ICustomersRepository } from "../../../repositories/ICustomersRepository";
import { IStoreCustomerDTO } from "../../../dtos/IStoreCostumerDTO";

@injectable()
export class CustomerService {
  constructor(
    @inject("CustomersRepository")
    private customersRepository: ICustomersRepository
  ) {}
  async storeNewCustomer(
    data: IStoreCustomerDTO
  ): Promise<{ customerId: string }> {
    let customer = await this.customersRepository.find({
      cpf_cnpj: data.customerCpfOrCnpj,
      installation_number: data.customerInstalationNumber,
      customer_number: data.customerNumber,
    });

    if (!customer) {
      customer = await this.customersRepository.store({
        address: data.customerAddres,
        cpf_cnpj: data.customerCpfOrCnpj,
        customer_number: data.customerNumber,
        installation_number: data.customerInstalationNumber,
        name: data.customerName,
      });
    }
    return { customerId: customer.id };
  }
}
