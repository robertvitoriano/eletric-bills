import { api } from "./api";

export async function getCustomersWithInvoices(): Promise<any> {
  const response = await api.get("/customers");
  return response.data;
}
