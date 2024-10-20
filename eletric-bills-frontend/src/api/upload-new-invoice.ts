import { api } from "./api";

export async function uploadNewInvoice(invoiceFile): Promise<any> {
  const formData = new FormData();

  formData.append("invoice", invoiceFile);

  const response = await api.post("/invoices", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
}
