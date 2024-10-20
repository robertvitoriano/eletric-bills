import { Customer } from "../entities/Customer";

export interface ICustomersRepository {
  store(customerData: Omit<Customer, "id" | "consumptions" | "invoices">): Promise<Customer>;
  list(data: { page: number; year: number; customerId: string }): Promise<any>;
  find(id: Partial<Customer>): Promise<Customer | null>;
  getTotal(data: { year: number; customerId: string }): Promise<number>;
}
