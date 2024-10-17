import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Customer } from "../../../customers/infra/typeorm/entities/Customer";

@Entity({ name: "invoices" })
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 200 })
  customer_id: string;

  @Column("varchar", { length: 200 })
  parent_comment_id: string;

  @Column({ type: "char", length: 255 })
  content: string;

  @CreateDateColumn({ type: "timestamp" })
  due_date: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.invoices, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customer_id" })
  customer!: Customer;
}
