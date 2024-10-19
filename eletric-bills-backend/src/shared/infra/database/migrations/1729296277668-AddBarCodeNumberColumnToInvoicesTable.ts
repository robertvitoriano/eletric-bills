import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBarCodeNumberColumnToInvoicesTable1729296277668
  implements MigrationInterface
{
  transaction?: boolean;
  up(queryRunner: QueryRunner): Promise<any> {
    throw new Error("Method not implemented.");
  }
  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error("Method not implemented.");
  }
  name = "AddBarCodeNumberColumnToInvoicesTable1729296277668";
}
