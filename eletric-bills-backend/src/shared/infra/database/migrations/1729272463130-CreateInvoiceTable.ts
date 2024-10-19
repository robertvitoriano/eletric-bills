import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateInvoiceTable1729272463130 implements MigrationInterface {
  name = "CreateInvoiceTable1729272463130";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "invoices",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "customer_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "reference",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "due_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "total_amount",
            type: "numeric",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "reading_days",
            type: "int",
            isNullable: false,
          },
          {
            name: "previous_reading",
            type: "date",
            isNullable: false,
          },
          {
            name: "current_reading",
            type: "date",
            isNullable: false,
          },
          {
            name: "next_reading",
            type: "date",
            isNullable: false,
          },
          {
            name: "url",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "invoices",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customers",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("invoices");
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("customer_id") !== -1
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("invoices", foreignKey);
    }

    await queryRunner.dropTable("invoices");
  }
}
