import { Request, Response } from "express";

class CreateInvoiceController {
  async handle(request: Request, response: Response): Promise<Response> {
    return response.json({});
  }
}

export { CreateInvoiceController };
