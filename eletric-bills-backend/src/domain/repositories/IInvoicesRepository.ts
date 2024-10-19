import { Invoice } from "../entities/Invoice";

interface IInvoicesRepository {
  store(
    invoiceData: Omit<Invoice, "id" | "invoice_items" | "customer">
  ): Promise<Invoice>;
  find(id: Partial<Invoice>): Promise<Invoice | null>;
}

export { IInvoicesRepository };
