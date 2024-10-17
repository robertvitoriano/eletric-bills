import { Repository, SelectQueryBuilder } from "typeorm";

import { IBillsRepository } from "../../repositories/IBillsRepository";

class BillsRepository implements IBillsRepository {}

export { BillsRepository };
