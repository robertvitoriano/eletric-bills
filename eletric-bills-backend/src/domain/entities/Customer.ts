import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Invoice } from "./Invoice";
import { Consumption } from "./Consumption";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  address: string;

  @Column({ type: "varchar", length: 20, unique: true })
  cpf_cnpj: string;

  @Column({ type: "varchar", length: 20, unique: true })
  customer_number: string;

  @Column({ type: "varchar", length: 20 })
  installation_number: string;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => Consumption, (consumption) => consumption.customer)
  consumptions: Consumption[];
}
