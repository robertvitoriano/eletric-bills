import { Request, Response } from "express";

class CreateBillController {
  async handle(request: Request, response: Response): Promise<Response> {
    return response.json({});
  }
}

export { CreateBillController };
