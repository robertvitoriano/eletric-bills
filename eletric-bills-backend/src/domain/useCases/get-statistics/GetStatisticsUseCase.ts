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
  consumptionOfElectricEnergy: number;
  compensatedEnergy: number;
  totalCostWithoutGDEnergy: number;
  gdEconomy: number;
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
      const consumptionOfElectricity = await this.invoicesRepository.getSumOfInvoiceItemsByType(
        InvoiceItemTypes.ELECTRICITY.id,
        "quantity",
        customerNumber ? customerNumber : undefined
      );
      const consumptionOfSCEEEnergy = await this.invoicesRepository.getSumOfInvoiceItemsByType(
        InvoiceItemTypes.SCEE_ENERGY.id,
        "quantity",
        customerNumber ? customerNumber : undefined
      );
      const compensatedEnergy = await this.invoicesRepository.getSumOfInvoiceItemsByType(
        InvoiceItemTypes.COMPENSATED_ENERGY.id,
        "quantity",
        customerNumber ? customerNumber : undefined
      );
      const effectiveTotalCost = await this.invoicesRepository.getSumOfInvoiceItemsByType(
        InvoiceItemTypes.TOTAL.id,
        "total_value",
        customerNumber ? customerNumber : undefined
      );
      const gdEconomy = await this.invoicesRepository.getSumOfInvoiceItemsByType(
        InvoiceItemTypes.COMPENSATED_ENERGY.id,
        "total_value",
        customerNumber ? customerNumber : undefined
      );
      const gdEconomyModule = gdEconomy * -1;
      const totalCostWithoutGDEnergy = effectiveTotalCost + gdEconomyModule;
      const consumptionOfElectricEnergy = consumptionOfElectricity + consumptionOfSCEEEnergy;

      return { consumptionOfElectricEnergy, compensatedEnergy, totalCostWithoutGDEnergy, gdEconomy: gdEconomyModule };
    } catch (error) {
      console.error("Error fetching total consumption of electricity:", error);
      throw new AppError("Unable to retrieve statistics", 500);
    }
  }
}
