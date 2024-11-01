import { Invoice } from "../entities/Invoice";
import { InvoiceItem } from "../entities/InvoiceItem";

interface IInvoicesRepository {
  getSumOfInvoiceItemsByType(
    invoiceItemTypeId: number,
    field: "total_value" | "quantity",
    customerId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<number>;
  store(invoiceData: Omit<Invoice, "id" | "invoice_items" | "customer">): Promise<Invoice>;
  findOne(id: Partial<Invoice>): Promise<Invoice | null>;
  storeItem(invoiceData: Omit<InvoiceItem, "id" | "invoice" | "invoiceItemType">): Promise<InvoiceItem>;
  getAvailableYears(): Promise<number[]>;
}

export { IInvoicesRepository };
