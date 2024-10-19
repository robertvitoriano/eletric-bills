import { Invoice } from "../entities/Invoice";
import { InvoiceItem } from "../entities/InvoiceItem";

interface IInvoicesRepository {
  store(invoiceData: Omit<Invoice, "id" | "invoice_items" | "customer">): Promise<Invoice>;
  find(id: Partial<Invoice>): Promise<Invoice | null>;
  storeItem(invoiceData: Omit<InvoiceItem, "id" | "invoice" | "invoiceItemType">): Promise<InvoiceItem>;
}

export { IInvoicesRepository };
