import { inject, injectable } from "tsyringe";
import { IBillsRepository } from "../repositories/IBillsRepository";
@injectable()
export class CreateBillUseCase {
  constructor(
    @inject("BillsRepository")
    private billsRepository: IBillsRepository
  ) {}
}
