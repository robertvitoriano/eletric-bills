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

export interface InvoiceItemType {
  id: number;
  type_name: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  invoice_item_type_id: number;
  quantity: string | null;
  total_value: number;
  invoiceItemType: InvoiceItemType;
}

export interface Invoice {
  id: string;
  customer_id: string;
  reference: string;
  due_date: string;
  total_amount: number;
  reading_days: number;
  previous_reading: string;
  current_reading: string;
  next_reading: string;
  url: string;
  bar_code_number: string;
  invoice_items: InvoiceItem[];
}

export interface ICustomer {
  id: string;
  name: string;
  address: string;
  cpf_cnpj: string;
  customer_number: string;
  installation_number: string;
  invoices: Invoice[];
  installationNumber: string;
  customerNumber: string;
}
