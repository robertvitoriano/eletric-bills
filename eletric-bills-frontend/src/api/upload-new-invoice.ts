import { api } from "./api";

export async function uploadNewInvoice(files: Blob[]): Promise<any> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("invoices", file);
  });

  const response = await api.post("/invoices", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
}
