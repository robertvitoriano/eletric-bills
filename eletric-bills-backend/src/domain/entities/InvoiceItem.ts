import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Invoice } from "./Invoice";
import { InvoiceItemType } from "./InvoiceItemType";

@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  invoice_id: string;

  @JoinColumn({ name: "invoice_id" })
  @ManyToOne(() => Invoice, (invoice) => invoice.invoice_items, {
    onDelete: "CASCADE",
  })
  invoice: Invoice;

  @Column({ type: "number" })
  invoice_item_type_id: number;

  @JoinColumn({ name: "invoice_item_type_id" })
  @ManyToOne(
    () => InvoiceItemType,
    (invoiceItemType) => invoiceItemType.invoice_items,
    {
      onDelete: "CASCADE",
    }
  )
  invoiceItemType: InvoiceItemType;

  @Column({ type: "numeric", precision: 10, scale: 3, nullable: true })
  quantity: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total_value: number;
}
