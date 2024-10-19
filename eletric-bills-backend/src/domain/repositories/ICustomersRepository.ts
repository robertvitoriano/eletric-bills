import { Customer } from "../entities/Customer";

export interface ICustomersRepository {
  store(customerData: Omit<Customer, "id" | "consumptions" | "invoices">): Promise<Customer>;

  find(id: Partial<Customer>): Promise<Customer | null>;
}
