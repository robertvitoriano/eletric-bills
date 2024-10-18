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

  @Column({ type: "varchar", length: 10 })
  unit: string;

  @Column({ type: "numeric", precision: 10, scale: 6 })
  unit_price: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total_value: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  pis_cofins: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  icms_base: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  icms: number;

  @Column({ type: "numeric", precision: 10, scale: 6 })
  unit_rate: number;
}
