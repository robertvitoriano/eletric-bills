import { InvoiceItemType } from "../../../../domain/entities/InvoiceItemType";
import { InvoiceItemTypes } from "../../../enums/invoice-item-types";
import { PostgresDataSource } from "../PostgresDataSource";

export async function seedInvoiceItemTypes() {
  try {
    await PostgresDataSource.initialize();

    const existingItemTypes = await PostgresDataSource.manager.find(
      InvoiceItemType
    );

    const existingTypeNames = new Set(
      existingItemTypes.map((item) => item.type_name)
    );

    const newItemTypes = Object.entries(InvoiceItemTypes).map(
      ([_, { id, type }]) => ({
        id,
        type_name: type,
      })
    );

    const typesToInsert = newItemTypes.filter(
      (item) => !existingTypeNames.has(item.type_name)
    );

    if (typesToInsert.length > 0) {
      await PostgresDataSource.manager.save(
        typesToInsert.map((item) =>
          PostgresDataSource.manager.create(InvoiceItemType, item)
        )
      );

      console.info(
        `${typesToInsert.length} Invoice item types seeded successfully!`
      );
    } else {
      console.info("Invoice item types already exist. Skipping seed.");
    }
  } catch (e) {
    console.error("Error seeding Invoice item types:", e);
  } finally {
    await PostgresDataSource.destroy();
  }
}
