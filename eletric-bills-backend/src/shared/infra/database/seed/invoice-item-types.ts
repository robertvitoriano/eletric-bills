import { InvoiceItemType } from "../../../../domain/entities/InvoiceItemType";
import { InvoiceItemTypes } from "../../../enums/invoice-item-types";
import { PostgresDataSource } from "../PostgresDataSource";

async function seed() {
  await PostgresDataSource.initialize();

  await PostgresDataSource.manager.save(
    Object.entries(InvoiceItemTypes).map(([_, { id, type }]) =>
      PostgresDataSource.manager.create(InvoiceItemType, {
        id,
        type_name: type,
      })
    )
  );

  console.log("Invoice item types seeded successfully!");

  await PostgresDataSource.destroy();
}

seed().catch(console.error);
