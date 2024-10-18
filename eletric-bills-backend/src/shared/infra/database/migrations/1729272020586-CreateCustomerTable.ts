import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomerTable1729272020586 implements MigrationInterface {
  name = "CreateCustomerTable1729272020586";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "customers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "address",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "cpf_cnpj",
            type: "varchar",
            length: "20",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "customer_number",
            type: "varchar",
            length: "20",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "installation_number",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("customers");
  }
}
