import path from "path";
import FileManager from "../../infra/file/FileManager";
import { AppError } from "../../../shared/errors/AppError";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
import { inject, injectable } from "tsyringe";
@injectable()
export class InvoiceDownloadUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository
  ) {}
  public async execute(invoiceId: string): Promise<{ fileContent: Buffer; contentType: string }> {
    try {
      const invoice = await this.invoicesRepository.findOne({ id: invoiceId });
      const fileContent = await FileManager.readFile(invoice.url);
      const ext = path.extname(invoice.url).toLowerCase();
      let contentType = "";

      if (ext === ".pdf") {
        contentType = "application/pdf";
      } else {
        throw new AppError("Unsupported file type", 400);
      }

      return { fileContent, contentType };
    } catch (error) {
      console.error(error);
      throw new AppError("File not found", 404);
    }
  }
}
