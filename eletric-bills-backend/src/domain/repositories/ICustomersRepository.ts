import { Customer } from "../entities/Customer";
import { ICustomer } from "../useCases/types";

export interface ICustomersRepository {
  store(customerData: Omit<Customer, "id" | "consumptions" | "invoices">): Promise<Customer>;
  list(data?: { page?: number; year: number; customerId: string; perPage: number; name: string }): Promise<ICustomer[]>;
  find(id: Partial<Customer>): Promise<Customer | null>;
  getTotal(data: { year: number; customerId?: string }): Promise<number>;
}
