export type InvoiceParameters = {
  compensatedGDEnergy: { quantity: number; cost: number };
  publicIluminationCost: number;
  sceeWithoutICMSEnergy: { quantity: number; cost: number };
  energyConsumption: { quantity: number; cost: number };
  invoiceDueDate: string;
  barCode: string;
  totalCost: number;
  invoiceReferenceDate: string;
  previousReading: string;
  currentReading: string;
  nextReading: string;
  readingDays: number;
  damageCompensations: number;
  paymentRefund: number;
  yellowFlagCost: number;
};

export type CustomerInfo = {
  customerName: string;
  customerCpfOrCnpj: string;
  customerAddres: string;
  customerNumber: string;
  customerInstalationNumber: string;
};
export interface Period {
  start: Date;
  end: Date;
}
