import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Customer } from "./Customer";
import { InvoiceItem } from "./InvoiceItem";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.invoices, {
    onDelete: "CASCADE",
  })
  customer: Customer;

  @Column({ type: "varchar", length: 20 })
  reference: string;

  @Column({ type: "date" })
  due_date: Date;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: "varchar", length: 50 })
  tariff_class: string;

  @Column({ type: "varchar", length: 50 })
  subclass: string;

  @Column({ type: "varchar", length: 50 })
  tariff_mode: string;

  @Column({ type: "int" })
  reading_days: number;

  @Column({ type: "date" })
  previous_reading: Date;

  @Column({ type: "date" })
  current_reading: Date;

  @Column({ type: "date" })
  next_reading: Date;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoice_items: InvoiceItem[];
}
