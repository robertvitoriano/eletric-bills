import { api } from "./api";

export async function downloadInvoice(invoiceId: string): Promise<Blob> {
  const response = await api.get(`/invoices/download/${invoiceId}`, {
    responseType: "blob",
  });

  return response.data;
}
