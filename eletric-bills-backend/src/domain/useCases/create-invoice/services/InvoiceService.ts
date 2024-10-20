import { inject, injectable } from "tsyringe";
import { IInvoicesRepository } from "../../../repositories/IInvoicesRepository";
import { parse } from "date-fns";
import { InvoiceItemTypes } from "../../../../shared/enums/invoice-item-types";
import { IStoreInvoiceDTO } from "../../../dtos/IStoreInvoiceDTO";

@injectable()
export class InvoiceService {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository
  ) {}

  async storeNewInvoice(data: IStoreInvoiceDTO) {
    let currentInvoice = await this.invoicesRepository.findOne({
      bar_code_number: data.barCode,
    });
    const currentInvoiceYear = new Date(data.invoiceDueDate).getFullYear();
    const { nextYear, previousYear } = this.getAdjustedYear(data.currentReading, currentInvoiceYear);
    if (!currentInvoice) {
      currentInvoice = await this.invoicesRepository.store({
        bar_code_number: data.barCode,
        current_reading: parse(`${data.currentReading}/${currentInvoiceYear}`, "dd/MM/yyyy", new Date()),
        next_reading: parse(`${data.nextReading}/${nextYear}`, "dd/MM/yyyy", new Date()),
        previous_reading: parse(`${data.previousReading}/${previousYear}`, "dd/MM/yyyy", new Date()),
        due_date: parse(data.invoiceDueDate, "dd/MM/yyyy", new Date()),
        reading_days: data.readingDays,
        reference: data.invoiceReferenceDate,
        total_amount: data.totalCost,
        url: data.invoiceUrl,
        customer_id: data.customerId,
      });
      this.storeInvoiceItems(data, currentInvoice.id);
    }
  }
  private async storeInvoiceItems(data: IStoreInvoiceDTO, currentInvoiceId: string) {
    this.invoicesRepository.storeItem({
      invoice_id: currentInvoiceId,
      invoice_item_type_id: InvoiceItemTypes.ELECTRICITY.id,
      quantity: data.energyConsumption.quantity,
      total_value: data.energyConsumption.cost,
    });
    this.invoicesRepository.storeItem({
      invoice_id: currentInvoiceId,
      invoice_item_type_id: InvoiceItemTypes.SCEE_ENERGY.id,
      quantity: data.sceeWithoutICMSEnergy.quantity,
      total_value: data.sceeWithoutICMSEnergy.cost,
    });
    this.invoicesRepository.storeItem({
      invoice_id: currentInvoiceId,
      invoice_item_type_id: InvoiceItemTypes.COMPENSATED_ENERGY.id,
      quantity: data.compensatedGDEnergy.quantity,
      total_value: data.compensatedGDEnergy.cost,
    });
    if (!isNaN(data.publicIluminationCost)) {
      this.invoicesRepository.storeItem({
        invoice_id: currentInvoiceId,
        invoice_item_type_id: InvoiceItemTypes.MUNICIPAL_LIGHTING_CONTRIBUTION.id,
        total_value: data.publicIluminationCost,
        quantity: null,
      });
    }
    if (!isNaN(data.paymentRefund)) {
      this.invoicesRepository.storeItem({
        invoice_id: currentInvoiceId,
        invoice_item_type_id: InvoiceItemTypes.PAYMENT_REFUND.id,
        total_value: data.paymentRefund,
        quantity: null,
      });
    }
    if (!isNaN(data.yellowFlagCost)) {
      this.invoicesRepository.storeItem({
        invoice_id: currentInvoiceId,
        invoice_item_type_id: InvoiceItemTypes.YELLOW_FLAG.id,
        total_value: data.yellowFlagCost,
        quantity: null,
      });
    }
    if (!isNaN(data.damageCompensations)) {
      this.invoicesRepository.storeItem({
        invoice_id: currentInvoiceId,
        invoice_item_type_id: InvoiceItemTypes.DAMAGE_COMPENSATIONS.id,
        total_value: data.damageCompensations,
        quantity: null,
      });
    }
  }
  private getAdjustedYear(readingDate: string, currentYear: number): { nextYear: number; previousYear: number } {
    const [_, month] = readingDate.split("/").map(Number);

    let nextYear = currentYear;
    let previousYear = currentYear;

    if (month === 12) {
      nextYear = currentYear + 1;
    } else if (month === 1) {
      previousYear = currentYear - 1;
    }

    return { nextYear, previousYear };
  }
}
