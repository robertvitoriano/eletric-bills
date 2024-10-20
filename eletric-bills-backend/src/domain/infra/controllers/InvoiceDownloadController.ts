import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { InvoiceDownloadUseCase } from "../../useCases/invoice-download/InvoiceDownloadUseCase";
import { container } from "tsyringe";

class DownloadInvoiceController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { invoiceId } = request.body;
      const invoiceDownloadUseCase = container.resolve(InvoiceDownloadUseCase);

      const { fileContent, contentType } = await invoiceDownloadUseCase.execute(invoiceId);

      response.setHeader("Content-Type", contentType);
      return response.status(HttpStatusCode.Ok).send(fileContent);
    } catch (error) {
      console.error(error);
      return response.status(404).send(error instanceof Error ? error.message : "File not found");
    }
  }
}

export { DownloadInvoiceController };
