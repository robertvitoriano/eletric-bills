import { Repository, SelectQueryBuilder } from "typeorm";

import { IBillsRepository } from "./IBillsRepository";

class BillsRepository implements IBillsRepository {}

export { BillsRepository };
