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
): Promise<{ consumptionOfElectricEnergy; compensatedEnergy; totalCostWithoutGDEnergy; gdEconomy }> {
  const response = await api.get<{
    consumptionOfElectricEnergy;
    compensatedEnergy;
    totalCostWithoutGDEnergy;
    gdEconomy;
  }>("/invoices/statistics", {
    params: queryParams,
  });

  return response.data;
}
