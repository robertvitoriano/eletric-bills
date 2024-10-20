import { Request, Response } from "express";
import { container } from "tsyringe";
import { HttpStatusCode } from "axios";
import { ListCustomersWithInvoicesUseCase } from "../../useCases/list-customers-with-invoices/ListCustomersWithInvoicesUseCase";

export class ListCustomersWithInvoicesController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { page, year, customer_number, name } = request.query;
      const listCustomersWithInvoicesUseCase = container.resolve(ListCustomersWithInvoicesUseCase);
      const customersResponse = await listCustomersWithInvoicesUseCase.execute({
        name: name && String(name),
        page: page && Number(page),
        year: year && Number(year),
        customerNumber: customer_number && String(customer_number),
      });

      return response.status(HttpStatusCode.Ok).json({
        message: "Customers successfully fetched",
        ...customersResponse,
      });
    } catch (error) {
      console.error("Error storing invoice:", error);

      return response.status(500).json({
        message: "An error occurred while fetching customers",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
