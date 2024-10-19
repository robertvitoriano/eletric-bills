import { Repository } from "typeorm";
import { PostgresDataSource } from "../../../shared/infra/database/PostgresDataSource";
import { Invoice } from "../../entities/Invoice";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
class InvoicesRepository implements IInvoicesRepository {
  private invoiceRepository: Repository<Invoice>;

  constructor() {
    this.invoiceRepository = PostgresDataSource.getRepository(Invoice);
  }
  async find(data: Partial<Invoice>): Promise<Invoice | null> {
    const invoice = await this.invoiceRepository.findOne({
      where: { ...data },
    });
    return invoice;
  }

  async store(
    invoiceData: Omit<Invoice, "id" | "invoice_items" | "customer">
  ): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(invoiceData);
    const storedInvoice = await this.invoiceRepository.save(invoice);
    return storedInvoice;
  }
}

export { InvoicesRepository };
