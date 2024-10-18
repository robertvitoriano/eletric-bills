export enum InvoiceItemTypeEnum {
  ELECTRICITY = "Energia Elétrica",
  SCEE_ENERGY = "Energia SCEE s/ ICMS",
  COMPENSATED_ENERGY = "Energia compensada GD I",
  MUNICIPAL_LIGHTING_CONTRIBUTION = "Contrib Ilum Publica Municipal",
  TOTAL = "TOTAL",
}

interface InvoiceItemType {
  id: number;
  type: InvoiceItemTypeEnum;
}

export const InvoiceItemTypes: Record<string, InvoiceItemType> = {
  ELECTRICITY: { id: 1, type: InvoiceItemTypeEnum.ELECTRICITY },
  SCEE_ENERGY: { id: 2, type: InvoiceItemTypeEnum.SCEE_ENERGY },
  COMPENSATED_ENERGY: { id: 3, type: InvoiceItemTypeEnum.COMPENSATED_ENERGY },
  MUNICIPAL_LIGHTING_CONTRIBUTION: {
    id: 4,
    type: InvoiceItemTypeEnum.MUNICIPAL_LIGHTING_CONTRIBUTION,
  },
  TOTAL: { id: 5, type: InvoiceItemTypeEnum.TOTAL },
};
