import { Repository } from "typeorm";
import { PostgresDataSource } from "../../../shared/infra/database/PostgresDataSource";
import { Invoice } from "../../entities/Invoice";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
class InvoicesRepository implements IInvoicesRepository {
  private invoiceRepository: Repository<Invoice>;

  constructor() {
    this.invoiceRepository = PostgresDataSource.getRepository(Invoice);
  }

  async store(invoiceData: Invoice): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(invoiceData);
    return await this.invoiceRepository.save(invoice);
  }
}

export { InvoicesRepository };
