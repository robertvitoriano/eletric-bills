import { Repository, SelectQueryBuilder } from "typeorm";

import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";

class InvoicesRepository implements IInvoicesRepository {}

export { InvoicesRepository };
