import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateInvoiceItemTypesTable1729271080609
  implements MigrationInterface
{
  name = "CreateInvoiceItemTypesTable1729271080609";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "invoice_item_types",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
          },
          {
            name: "type_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("invoice_item_types");
  }
}
