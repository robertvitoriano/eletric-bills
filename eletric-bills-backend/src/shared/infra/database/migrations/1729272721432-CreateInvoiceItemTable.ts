import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInvoiceItemTable1729272721432 implements MigrationInterface {
  name = "CreateInvoiceItemTable1729272721432";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "invoice_items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "invoice_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "invoice_item_type_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quantity",
            type: "numeric",
            precision: 10,
            scale: 3,
            isNullable: true,
          },
          {
            name: "total_value",
            type: "numeric",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "invoice_items",
      new TableForeignKey({
        columnNames: ["invoice_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "invoices",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "invoice_items",
      new TableForeignKey({
        columnNames: ["invoice_item_type_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "invoice_item_types",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("invoice_items");
    const invoiceForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("invoice_id") !== -1);
    if (invoiceForeignKey) {
      await queryRunner.dropForeignKey("invoice_items", invoiceForeignKey);
    }

    const invoiceItemTypeForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("invoice_item_type_id") !== -1
    );
    if (invoiceItemTypeForeignKey) {
      await queryRunner.dropForeignKey("invoice_items", invoiceItemTypeForeignKey);
    }

    await queryRunner.dropTable("invoice_items");
  }
}
