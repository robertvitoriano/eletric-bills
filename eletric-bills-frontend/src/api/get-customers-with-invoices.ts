import { api } from "./api";

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

export interface Customer {
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

export interface Pagination {
  currentPage: number;
  total: number;
  pagesTotal: number;
  perPage: number;
}

export interface CustomersResponse {
  customers: Customer[];
  availableYears: number[];
  pagination: Pagination;
}

export async function getCustomersWithInvoices(
  queryParams: {
    page?: number;
    year?: number;
    customer_number?: string;
    installation_number?: string;
    per_page?: number;
  } = {}
): Promise<CustomersResponse> {
  const response = await api.get<CustomersResponse>("/customers", {
    params: queryParams,
  });

  return response.data;
}
