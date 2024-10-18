import { inject, injectable } from "tsyringe";
import { uploadFile } from "../../../utils/upload-file";
import { IInvoicesRepository } from "../repositories/IInvoiceRepository";
import pdf from "pdf-parse";
import fs from "fs";
@injectable()
class CreateInvoicesUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository
  ) {}

  async execute(invoice: Express.Multer.File): Promise<void> {
    let invoiceUrl = "";
    if (invoice) {
      const { url, path } = await uploadFile({
        file: invoice,
      });
      const dataBuffer = fs.readFileSync(path);

      pdf(dataBuffer).then(function (data) {
        console.log(data.text);
      });
    }

    console.log(invoiceUrl);
  }
}

export { CreateInvoicesUseCase };
