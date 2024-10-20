import { Repository } from "typeorm";
import { PostgresDataSource } from "../../../shared/infra/database/PostgresDataSource";
import { Invoice } from "../../entities/Invoice";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
import { InvoiceItem } from "../../entities/InvoiceItem";
import { Customer } from "../../entities/Customer";
class InvoicesRepository implements IInvoicesRepository {
  private invoiceRepository: Repository<Invoice>;
  private invoiceItemRepository: Repository<InvoiceItem>;
  constructor() {
    this.invoiceRepository = PostgresDataSource.getRepository(Invoice);
    this.invoiceItemRepository = PostgresDataSource.getRepository(InvoiceItem);
  }

  async storeItem(invoiceData: Omit<InvoiceItem, "id" | "invoice" | "invoiceItemType">): Promise<InvoiceItem> {
    const invoiceItem = this.invoiceItemRepository.create(invoiceData);
    const storedInvoiceItem = await this.invoiceItemRepository.save(invoiceItem);
    return storedInvoiceItem;
  }

  async findOne(data: Partial<Invoice>): Promise<Invoice | null> {
    const invoice = await this.invoiceRepository.findOne({
      where: { ...data },
    });
    return invoice;
  }

  async getAvailableYears(customerId?: string): Promise<number[]> {
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder("invoice")
      .select("DISTINCT EXTRACT(YEAR FROM invoice.due_date)", "year")
      .orderBy("year", "ASC");

    if (customerId) {
      queryBuilder.where("invoice.customer_id = :customerId", { customerId });
    }
    const result = await queryBuilder.getRawMany();
    const years = result.map((row: { year: string }) => Number(row.year));

    return years;
  }
  async store(invoiceData: Omit<Invoice, "id" | "invoice_items" | "customer">): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(invoiceData);
    const storedInvoice = await this.invoiceRepository.save(invoice);
    return storedInvoice;
  }
}

export { InvoicesRepository };
