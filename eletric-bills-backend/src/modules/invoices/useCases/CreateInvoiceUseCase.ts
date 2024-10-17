import { inject, injectable } from "tsyringe";
import { IInvoicesRepository } from "../repositories/IInvoicesRepository";
@injectable()
export class CreateInvoicesUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository
  ) {}
}
