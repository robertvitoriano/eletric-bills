import { inject, injectable } from "tsyringe";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
import { AppError } from "../../../shared/errors/AppError";
import { InvoiceItemTypes } from "../../../shared/enums/invoice-item-types";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
import { InvoiceItem, InvoiceItemType, Invoice, ICustomer } from "./../types";
import { capitalize } from "../../../utils/parsing";
import { cp } from "fs";
interface IExecuteParams {
  customerNumber?: string | null;
  startDate: string;
  endDate: string;
  name?: string;
}

interface IStatisticsResult {
  consumptionOfElectricEnergy: number;
  compensatedEnergy: number;
  totalCostWithoutGDEnergy: number;
  gdEconomy: number;
  economyWithGDValuesPerMonth: Array<{ month: string; totalWithoutGD: number; economyWithGD: number }>;
  consumedEnergyAndCompensatedEnergy: Array<{ month: string; consumedEnergy: number; compensatedEnergy: number }>;
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
    startDate = "",
    endDate = "",
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

      const invoicesAndItemsByCustomer: ICustomer[] = await this.customersRepository.list({
        customerNumber,
        startDate,
        endDate,
      });

      const economyWithGDValuesPerMonthArray = invoicesAndItemsByCustomer.map((customer) => {
        return customer.invoices
          .map((invoice) => {
            const effectiveCostItem = invoice.invoice_items.find(
              (invoiceItem) => invoiceItem.invoice_item_type_id === InvoiceItemTypes.TOTAL.id
            );
            const economyWithGDItem = invoice.invoice_items.find(
              (invoiceItem) => invoiceItem.invoice_item_type_id === InvoiceItemTypes.COMPENSATED_ENERGY.id
            );
            if (effectiveCostItem && economyWithGDItem) {
              const economyWithGD = Number(economyWithGDItem.total_value * -1);
              const totalWithoutGD = Number(effectiveCostItem.total_value) + economyWithGD;
              return { month: capitalize(invoice.reference.split("/")[0]), totalWithoutGD, economyWithGD };
            }
            return { month: capitalize(invoice.reference.split("/")[0]), consumedEnergy: 0, compensatedEnergy: 0 };
          })
          .reverse();
      });

      const consumedEnergyAndCompensatedEnergyArray = invoicesAndItemsByCustomer.map((customer) => {
        return customer.invoices
          .map((invoice) => {
            const consumedEletricEnergyItem = invoice.invoice_items.find(
              (invoiceItem) => invoiceItem.invoice_item_type_id === InvoiceItemTypes.ELECTRICITY.id
            );

            const consumedSceeEnergyItem = invoice.invoice_items.find(
              (invoiceItem) => invoiceItem.invoice_item_type_id === InvoiceItemTypes.SCEE_ENERGY.id
            );

            const compensatedEnergyItem = invoice.invoice_items.find(
              (invoiceItem) => invoiceItem.invoice_item_type_id === InvoiceItemTypes.COMPENSATED_ENERGY.id
            );

            if (consumedEletricEnergyItem && consumedSceeEnergyItem && compensatedEnergyItem) {
              const consumedEnergy =
                Number(consumedEletricEnergyItem.quantity) + Number(consumedSceeEnergyItem.quantity);
              const compensatedEnergy = Number(compensatedEnergyItem.quantity);
              return { month: capitalize(invoice.reference.split("/")[0]), consumedEnergy, compensatedEnergy };
            }
            return { month: capitalize(invoice.reference.split("/")[0]), consumedEnergy: 0, compensatedEnergy: 0 };
          })
          .reverse();
      });
      const economyWithGDValuesPerMonth = this.mergeEconomyWithGDArrays(economyWithGDValuesPerMonthArray);
      const consumedEnergyAndCompensatedEnergy = this.mergeConsumedAndCompensatedEnergyArrays(
        consumedEnergyAndCompensatedEnergyArray
      );
      const gdEconomyModule = gdEconomy * -1;
      const totalCostWithoutGDEnergy = effectiveTotalCost + gdEconomyModule;
      const consumptionOfElectricEnergy = consumptionOfElectricity + consumptionOfSCEEEnergy;

      return {
        consumptionOfElectricEnergy,
        compensatedEnergy,
        totalCostWithoutGDEnergy,
        gdEconomy: gdEconomyModule,
        economyWithGDValuesPerMonth,
        consumedEnergyAndCompensatedEnergy,
      };
    } catch (error) {
      console.error("Error fetching total consumption of electricity:", error);
      throw new AppError("Unable to retrieve statistics", 500);
    }
  }
  private mergeConsumedAndCompensatedEnergyArrays(
    consumedEnergyAndCompensatedEnergyArrays: { month: string; consumedEnergy: number; compensatedEnergy: number }[][]
  ) {
    const result: { [key: string]: { month: string; consumedEnergy: number; compensatedEnergy: number } } = {};

    consumedEnergyAndCompensatedEnergyArrays.flat().forEach(({ month, consumedEnergy, compensatedEnergy }) => {
      if (!result[month]) {
        result[month] = { month, consumedEnergy, compensatedEnergy };
      } else {
        result[month].consumedEnergy += consumedEnergy;
        result[month].compensatedEnergy += compensatedEnergy;
      }
    });

    return Object.values(result);
  }
  private mergeEconomyWithGDArrays(arrays: any[][]) {
    const result: { [key: string]: { month: string; totalWithoutGD: number; economyWithGD: number } } = {};

    arrays.flat().forEach(({ month, totalWithoutGD, economyWithGD }) => {
      if (!result[month]) {
        result[month] = { month, totalWithoutGD, economyWithGD };
      } else {
        result[month].totalWithoutGD += totalWithoutGD;
        result[month].economyWithGD += economyWithGD;
      }
    });

    return Object.values(result);
  }
}
