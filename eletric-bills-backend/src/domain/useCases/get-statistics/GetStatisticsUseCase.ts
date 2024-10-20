import { inject, injectable } from "tsyringe";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
import { AppError } from "../../../shared/errors/AppError";
import { InvoiceItemTypes } from "../../../shared/enums/invoice-item-types";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
import { InvoiceItem, InvoiceItemType, Invoice, ICustomer } from "./../types";
import { capitalize } from "../../../utils/parsing";
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
  economyWithGDValuesPerMonth: Array<{ month: string; totalWithoutGD: number; economyWithGD: number }>;
}

@injectable()
export class GetStatisticsUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository,
    @inject("CustomersRepository")
    private customersRepository: ICustomersRepository
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

      const invoicesAndItemsByCustomer: ICustomer[] = await this.customersRepository.list({});

      const economyWithGDValuesPerMonth = invoicesAndItemsByCustomer.map((customer) => {
        return customer.invoices
          .map((invoice) => {
            const effectiveCost = invoice.invoice_items.find(
              (invoiceItem) => invoiceItem.invoice_item_type_id === InvoiceItemTypes.TOTAL.id
            ).total_value;
            const economyWithGD =
              invoice.invoice_items.find(
                (invoiceItem) => invoiceItem.invoice_item_type_id === InvoiceItemTypes.COMPENSATED_ENERGY.id
              ).total_value * -1;
            const totalWithoutGD = Number(effectiveCost) + Number(economyWithGD);
            return { month: capitalize(invoice.reference.split("/")[0]), totalWithoutGD, economyWithGD };
          })
          .reverse();
      })[0];

      const gdEconomyModule = gdEconomy * -1;
      const totalCostWithoutGDEnergy = effectiveTotalCost + gdEconomyModule;
      const consumptionOfElectricEnergy = consumptionOfElectricity + consumptionOfSCEEEnergy;

      return {
        consumptionOfElectricEnergy,
        compensatedEnergy,
        totalCostWithoutGDEnergy,
        gdEconomy: gdEconomyModule,
        economyWithGDValuesPerMonth,
      };
    } catch (error) {
      console.error("Error fetching total consumption of electricity:", error);
      throw new AppError("Unable to retrieve statistics", 500);
    }
  }
}
