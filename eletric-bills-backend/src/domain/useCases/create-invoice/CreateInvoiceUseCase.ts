import { container } from "tsyringe";
import { deleteFile } from "../../../utils/file";
import { uploadFile } from "../../../utils/upload-file";
import { CustomerService } from "./services/CustomerService";
import { EletricityInvoiceParser } from "./services/EletricityInvoiceParserService";
import { InvoiceService } from "./services/InvoiceService";
class CreateInvoicesUseCase {
  async execute(invoice: Express.Multer.File): Promise<void> {
    if (invoice) {
      const { url, path } = await uploadFile({
        file: invoice,
      });
      const customerService = container.resolve(CustomerService);
      const invoiceService = container.resolve(InvoiceService);

      const eletricityInvoiceParserService = new EletricityInvoiceParser();
      const { customerInfo, invoiceParameters } =
        await eletricityInvoiceParserService.extractData(path);
      const { customerId } = await customerService.storeNewCustomer(
        customerInfo
      );

      await invoiceService.storeNewInvoice({
        ...invoiceParameters,
        customerId,
        invoiceUrl: url,
      });

      await deleteFile(path);
    }
  }
}

export { CreateInvoicesUseCase };
