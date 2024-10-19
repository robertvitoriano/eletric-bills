import { Request, Response } from "express";
import { container } from "tsyringe";
import { HttpStatusCode } from "axios";
import { CreateInvoicesUseCase } from "../../useCases/create-invoice/CreateInvoiceUseCase";

class CreateInvoiceController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { files } = request;
      const createInvoiceUseCase = container.resolve(CreateInvoicesUseCase);
      const { invoice } = files as {
        invoice?: Express.Multer.File[];
      };

      const invoiceFile = invoice ? invoice[0] : null;

      const invoiceStorageResponse = await createInvoiceUseCase.execute(
        invoiceFile
      );

      return response.status(HttpStatusCode.Ok).json({
        message: "Invoice stored successfully",
        invoiceStorageResponse,
      });
    } catch (error) {
      console.error("Error storing invoice:", error);

      return response.status(500).json({
        message: "An error occurred while storing invoice",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export { CreateInvoiceController };
