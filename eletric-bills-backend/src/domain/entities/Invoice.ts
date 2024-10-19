import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { InvoiceItem } from "./InvoiceItem";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "uuid" })
  customer_id: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ type: "varchar", length: 20 })
  reference: string;

  @Column({ type: "date" })
  due_date: Date;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: "int" })
  reading_days: number;

  @Column({ type: "date" })
  previous_reading: Date;

  @Column({ type: "date" })
  current_reading: Date;

  @Column({ type: "date" })
  next_reading: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  url: string;

  @Column({ type: "varchar", length: 60 })
  bar_code_number: string;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoice_items: InvoiceItem[];
}
