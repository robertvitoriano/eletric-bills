export enum InvoiceItemTypeEnum {
  ELECTRICITY = "Energia Elétrica",
  SCEE_ENERGY = "Energia SCEE s/ ICMS",
  COMPENSATED_ENERGY = "Energia compensada GD I",
  MUNICIPAL_LIGHTING_CONTRIBUTION = "Contrib Ilum Publica Municipal",
  DAMAGE_COMPENSATIONS = "Ressarcimento de Danos",
  TOTAL = "TOTAL",
  PAYMENT_REFUND = "Restituição de Pagamento",
  YELLOW_FLAG = "Bandeira Amarela - Já Incluído no valor a pagar",
}

interface InvoiceItemType {
  id: number;
  type: InvoiceItemTypeEnum;
}

export const InvoiceItemTypes: Record<
  keyof typeof InvoiceItemTypeEnum,
  InvoiceItemType
> = {
  ELECTRICITY: {
    id: 1,
    type: InvoiceItemTypeEnum.ELECTRICITY,
  },
  SCEE_ENERGY: {
    id: 2,
    type: InvoiceItemTypeEnum.SCEE_ENERGY,
  },
  COMPENSATED_ENERGY: {
    id: 3,
    type: InvoiceItemTypeEnum.COMPENSATED_ENERGY,
  },
  MUNICIPAL_LIGHTING_CONTRIBUTION: {
    id: 4,
    type: InvoiceItemTypeEnum.MUNICIPAL_LIGHTING_CONTRIBUTION,
  },
  DAMAGE_COMPENSATIONS: {
    id: 5,
    type: InvoiceItemTypeEnum.DAMAGE_COMPENSATIONS,
  },
  TOTAL: {
    id: 6,
    type: InvoiceItemTypeEnum.TOTAL,
  },
  PAYMENT_REFUND: {
    id: 7,
    type: InvoiceItemTypeEnum.PAYMENT_REFUND,
  },
  YELLOW_FLAG: {
    id: 8,
    type: InvoiceItemTypeEnum.YELLOW_FLAG,
  },
};
