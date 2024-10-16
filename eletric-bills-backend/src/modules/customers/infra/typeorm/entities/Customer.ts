import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
@Entity("customers")
export class Customer {
  @PrimaryColumn({ type: "char", length: "36" })
  id!: string;

  @Column()
  name!: string;

  @Column()
  cpf_cnpj!: string;

  @Column()
  instalation_number!: string;

  @Column()
  created_at!: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
