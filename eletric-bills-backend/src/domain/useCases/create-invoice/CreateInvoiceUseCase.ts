import { container } from "tsyringe";
import { CustomerService } from "./services/CustomerService";
import { EletricityInvoiceParser } from "./services/EletricityInvoiceParserService";
import { InvoiceService } from "./services/InvoiceService";
import FileManager from "../../infra/file/FileManager";
class CreateInvoicesUseCase {
  async execute(invoice: Express.Multer.File): Promise<void> {
    if (invoice) {
      const { url, path } = await FileManager.uploadFile(invoice);
      const customerService = container.resolve(CustomerService);
      const invoiceService = container.resolve(InvoiceService);

      const eletricityInvoiceParserService = new EletricityInvoiceParser();
      const { customerInfo, invoiceParameters } = await eletricityInvoiceParserService.extractData(path);
      const { customerId } = await customerService.storeNewCustomer(customerInfo);

      await invoiceService.storeNewInvoice({
        ...invoiceParameters,
        customerId,
        invoiceUrl: url || path,
      });

      if (url) {
        await FileManager.deleteFile(path);
      }
    }
  }
}

export { CreateInvoicesUseCase };
