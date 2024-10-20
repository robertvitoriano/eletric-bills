import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { CreateInvoicesUseCase } from "../../useCases/create-invoice/CreateInvoiceUseCase";

class CreateInvoiceController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { files } = request;
      const createInvoiceUseCase = new CreateInvoicesUseCase();

      const invoiceFiles = files as {
        invoices?: Express.Multer.File[];
      };

      if (!invoiceFiles || !invoiceFiles.invoices || invoiceFiles.invoices.length === 0) {
        return response.status(HttpStatusCode.BadRequest).json({
          message: "No invoice files provided",
        });
      }

      for (let i = 0; i < invoiceFiles.invoices.length; i++) {
        await createInvoiceUseCase.execute(invoiceFiles.invoices[i]);
      }

      return response.status(HttpStatusCode.Ok).json({
        message: "Invoices stored successfully",
      });
    } catch (error) {
      console.error("Error storing invoices:", error);

      return response.status(500).json({
        message: "An error occurred while storing invoices",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export { CreateInvoiceController };
