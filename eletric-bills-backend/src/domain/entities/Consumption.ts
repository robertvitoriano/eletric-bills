import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Customer } from "./Customer";
@Entity("consumptions")
export class Consumption {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  customer_id: string;

  @ManyToOne(() => Customer, (customer) => customer.consumptions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ type: "varchar", length: 20 })
  month_year: string;

  @Column({ type: "int" })
  consumption_kwh: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  average_kwh_day: number;

  @Column({ type: "int" })
  reading_days: number;
}
