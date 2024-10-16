import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity({ name: "bills" })
export class Bill {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: 36 })
  customer_id: string;

  @Column({ type: "char", length: 36 })
  parent_comment_id: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @CreateDateColumn({ type: "timestamp" })
  due_date: Date;
  
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;


  @ManyToOne("customers", "bills", { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_id" })
  customer!: any;

  @OneToMany("bills", "parentComment")
  replies!: Comment[];
}
