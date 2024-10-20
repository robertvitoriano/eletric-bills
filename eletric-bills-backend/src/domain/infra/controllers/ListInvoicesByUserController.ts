import { Request, Response } from "express";
import { container } from "tsyringe";
import { HttpStatusCode } from "axios";
import { ListInvoicesByCustomerUseCase } from "../../useCases/list-invoices-by-customer/ListInvoicesByCustomerUseCase";

export class ListInvoicesByCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { page, year, customer_number, name } = request.query;
      const listInvoicesByCustomerUseCase = container.resolve(ListInvoicesByCustomerUseCase);
      const invoicesResponse = await listInvoicesByCustomerUseCase.execute({
        name: name && String(name),
        page: page && Number(page),
        year: year && Number(year),
        customerNumber: customer_number && String(customer_number),
      });

      return response.status(HttpStatusCode.Ok).json({
        message: "Invoices successfully fetched",
        invoicesResponse,
      });
    } catch (error) {
      console.error("Error storing invoice:", error);

      return response.status(500).json({
        message: "An error occurred while fetching invoices",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
