import { inject, injectable } from "tsyringe";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
import { AppError } from "../../../shared/errors/AppError";
import { InvoiceItemTypes } from "../../../shared/enums/invoice-item-types";

interface IExecuteParams {
  customerNumber?: string | null;
  period?: string | null;
  name?: string;
}

interface IStatisticsResult {
  totalConsumptionOfElectricEnergy: number;
}

@injectable()
export class GetStatisticsUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository
  ) {}

  public async execute({
    customerNumber = null,
    period = null,
    name = "",
  }: IExecuteParams): Promise<IStatisticsResult> {
    try {
      const totalConsumptionOfElectricity = await this.invoicesRepository.getSumOfInvoiceItemsByType(
        InvoiceItemTypes.ELECTRICITY.id,
        "quantity",
        customerNumber ? customerNumber : undefined
      );
      const totalConsumptionOfSCEEEnergy = await this.invoicesRepository.getSumOfInvoiceItemsByType(
        InvoiceItemTypes.SCEE_ENERGY.id,
        "quantity",
        customerNumber ? customerNumber : undefined
      );
      const totalConsumptionOfElectricEnergy = totalConsumptionOfElectricity + totalConsumptionOfSCEEEnergy;
      return { totalConsumptionOfElectricEnergy };
    } catch (error) {
      console.error("Error fetching total consumption of electricity:", error);
      throw new AppError("Unable to retrieve statistics", 500);
    }
  }
}
