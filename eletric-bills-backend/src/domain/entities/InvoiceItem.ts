import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Invoice } from "./Invoice";

@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoice_items, {
    onDelete: "CASCADE",
  })
  invoice: Invoice;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "numeric", precision: 10, scale: 3 })
  quantity: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total_value: number;
}
