import { Customer } from "../entities/Customer"; // Ensure correct path

export interface ICustomersRepository {
  store(customerData: Customer): Promise<Customer>;
}
