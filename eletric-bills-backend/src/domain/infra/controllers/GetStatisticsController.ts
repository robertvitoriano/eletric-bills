import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { container } from "tsyringe";
import { GetStatisticsUseCase } from "../../useCases/get-statistics/GetStatisticsUseCase";

class GetStatisticsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { customer_number, installation_number, name, start_date, end_date } = request.query;

    try {
      const getStatisticsUseCase = container.resolve(GetStatisticsUseCase);

      const {
        consumptionOfElectricEnergy,
        compensatedEnergy,
        totalCostWithoutGDEnergy,
        gdEconomy,
        economyWithGDValuesPerMonth,
        consumedEnergyAndCompensatedEnergy,
      } = await getStatisticsUseCase.execute({
        startDate: String(start_date),
        endDate: String(end_date),
        customerNumber: String(customer_number),
      });

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
