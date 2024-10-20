import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { container } from "tsyringe";
import { GetStatisticsUseCase } from "../../useCases/get-statistics/GetStatisticsUseCase";

class GetStatisticsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const getStatisticsUseCase = container.resolve(GetStatisticsUseCase);

      const { totalConsumptionOfElectricEnergy } = await getStatisticsUseCase.execute({});

      return response.status(HttpStatusCode.Ok).send({ totalConsumptionOfElectricEnergy });
    } catch (error) {
      console.error(error);
      return response.status(404).send(error instanceof Error ? error.message : "File not found");
    }
  }
}

export { GetStatisticsController };
