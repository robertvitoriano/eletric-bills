import { Invoice } from "../entities/Invoice";

interface IInvoicesRepository {
  store(invoiceData: Invoice): Promise<Invoice>;
}

export { IInvoicesRepository };
