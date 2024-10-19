import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddBarCodeNumberColumnToInvoicesTable1729296277668
  implements MigrationInterface
{
  name = "AddBarCodeNumberColumnToInvoicesTable1729296277668";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "invoices",
      new TableColumn({
        name: "bar_code_number",
        type: "varchar",
        length: "60",
        isUnique: true,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("invoices", "bar_code_number");
  }
}
