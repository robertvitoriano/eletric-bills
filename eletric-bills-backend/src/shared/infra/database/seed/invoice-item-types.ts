import { InvoiceItemType } from "../../../../domain/entities/InvoiceItemType";
import { InvoiceItemTypes } from "../../../enums/invoice-item-types";
import { PostgresDataSource } from "../PostgresDataSource";

export async function seedInvoiceItemTypes() {
  try {
    await PostgresDataSource.initialize();

    const existingItemTypes = await PostgresDataSource.manager.find(
      InvoiceItemType
    );

    if (existingItemTypes.length === 0) {
      await PostgresDataSource.manager.save(
        Object.entries(InvoiceItemTypes).map(([_, { id, type }]) =>
          PostgresDataSource.manager.create(InvoiceItemType, {
            id,
            type_name: type,
          })
        )
      );

      console.info("Invoice item types seeded successfully!");
    } else {
      console.info("Invoice item types already exist. Skipping seed.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await PostgresDataSource.destroy();
  }
}
