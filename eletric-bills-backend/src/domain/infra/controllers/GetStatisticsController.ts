import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { container } from "tsyringe";
import { GetStatisticsUseCase } from "../../useCases/get-statistics/GetStatisticsUseCase";
import { Period } from "../../useCases/types";

class GetStatisticsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { customer_number, installation_number, name, period } = request.query;

    try {
      const getStatisticsUseCase = container.resolve(GetStatisticsUseCase);
      const periodData: Period | undefined = period
        ? { start: new Date(period.start as string), end: new Date(period.end as string) }
        : undefined;
      const {
        consumptionOfElectricEnergy,
        compensatedEnergy,
        totalCostWithoutGDEnergy,
        gdEconomy,
        economyWithGDValuesPerMonth,
        consumedEnergyAndCompensatedEnergy,
      } = await getStatisticsUseCase.execute({});

      return response.status(HttpStatusCode.Ok).send({
        consumptionOfElectricEnergy,
        compensatedEnergy,
        totalCostWithoutGDEnergy,
        gdEconomy,
        economyWithGDValuesPerMonth,
        consumedEnergyAndCompensatedEnergy,
      });
    } catch (error) {
      console.error(error);
      return response.status(404).send(error instanceof Error ? error.message : "File not found");
    }
  }
}

export { GetStatisticsController };
