export interface IStoreInvoiceDTO {
  barCode: string;
  currentReading: string;
  nextReading: string;
  previousReading: string;
  invoiceDueDate: string;
  readingDays: number;
  invoiceReferenceDate: string;
  totalCost: number;
  invoiceUrl: string;
  customerId: string;
  energyConsumption: {
    quantity: number;
    cost: number;
  };
  sceeWithoutICMSEnergy: {
    quantity: number;
    cost: number;
  };
  compensatedGDEnergy: {
    quantity: number;
    cost: number;
  };
  publicIluminationCost?: number;
  paymentRefund?: number;
  yellowFlagCost?: number;
  damageCompensations?: number;
}
