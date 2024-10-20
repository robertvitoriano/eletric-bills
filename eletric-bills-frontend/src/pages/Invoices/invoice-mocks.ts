export type Invoice = {
  month: string;
  code: string;
};

export type Customer = {
  name: string;
  instalationNumber: string;
  invoices: Invoice[];
};

export type YearData = {
  year: number;
  customers: Customer[];
};

export const months = [
  { month: "Janeiro", code: "JAN" },
  { month: "Fevereiro", code: "FEV" },
  { month: "Março", code: "MAR" },
  { month: "Abril", code: "ABR" },
  { month: "Maio", code: "MAI" },
  { month: "Junho", code: "JUN" },
  { month: "Julho", code: "JUL" },
  { month: "Agosto", code: "AGO" },
  { month: "Setembro", code: "SET" },
  { month: "Outubro", code: "OUT" },
  { month: "Novembro", code: "NOV" },
  { month: "Dezembro", code: "DEZ" },
];
