import { api } from "./api";

interface Period {
  start: Date;
  end: Date;
}

export async function getStatistics(
  queryParams: {
    customer_number?: string;
    installation_number?: string;
    name?: string;
    period?: Period;
  } = {}
): Promise<{ totalConsumptionOfElectricEnergy }> {
  const response = await api.get<{ totalConsumptionOfElectricEnergy }>("/invoices/statistics", {
    params: queryParams,
  });

  return response.data;
}
