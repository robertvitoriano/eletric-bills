import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { InvoiceItem } from "./InvoiceItem";

@Entity("invoice_types")
export class InvoiceItemType {
  @PrimaryColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  type_name: string;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoiceItemType)
  invoice_items: InvoiceItem[];
}
