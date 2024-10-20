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
): Promise<{
  consumptionOfElectricEnergy;
  compensatedEnergy;
  totalCostWithoutGDEnergy;
  gdEconomy;
  economyWithGDValuesPerMonth: Array<{ month: string; totalWithoutGD: number; economyWithGD: number }>;
}> {
  const response = await api.get<{
    consumptionOfElectricEnergy;
    compensatedEnergy;
    totalCostWithoutGDEnergy;
    gdEconomy;
    economyWithGDValuesPerMonth;
  }>("/invoices/statistics", {
    params: queryParams,
  });

  return response.data;
}
