export type Bill = {
  month: string;
  active: boolean;
};

export type Row = {
  name: string;
  instalationNumber: string;
  bills: Bill[];
};

export type YearData = {
  year: number;
  rows: Row[];
};

export const mockYears = [
  {
    year: 2017,
    rows: [
      {
        name: "Josevaldo",
        instalationNumber: "456456a1561651",
        bills: [
          { month: "Janeiro", active: true },
          { month: "Fevereiro", active: true },
          { month: "Março", active: true },
          { month: "Abril", active: true },
          { month: "Maio", active: false },
          { month: "Junho", active: false },
          { month: "Julho", active: true },
          { month: "Agosto", active: false },
          { month: "Setembro", active: true },
          { month: "Outubro", active: true },
          { month: "Novembro", active: true },
          { month: "Dezembro", active: false },
        ],
      },
      {
        name: "Ana Clara",
        instalationNumber: "9864571456141",
        bills: [
          { month: "Janeiro", active: false },
          { month: "Fevereiro", active: false },
          { month: "Março", active: false },
          { month: "Abril", active: true },
          { month: "Maio", active: true },
          { month: "Junho", active: true },
          { month: "Julho", active: true },
          { month: "Agosto", active: false },
          { month: "Setembro", active: false },
          { month: "Outubro", active: false },
          { month: "Novembro", active: true },
          { month: "Dezembro", active: false },
        ],
      },
      {
        name: "Roberto",
        instalationNumber: "5123156123451",
        bills: [
          { month: "Janeiro", active: false },
          { month: "Fevereiro", active: true },
          { month: "Março", active: true },
          { month: "Abril", active: true },
          { month: "Maio", active: true },
          { month: "Junho", active: true },
          { month: "Julho", active: false },
          { month: "Agosto", active: true },
          { month: "Setembro", active: true },
          { month: "Outubro", active: true },
          { month: "Novembro", active: false },
          { month: "Dezembro", active: false },
        ],
      },
      {
        name: "Mariana",
        instalationNumber: "7152156123487",
        bills: [
          { month: "Janeiro", active: true },
          { month: "Fevereiro", active: true },
          { month: "Março", active: false },
          { month: "Abril", active: false },
          { month: "Maio", active: false },
          { month: "Junho", active: true },
          { month: "Julho", active: false },
          { month: "Agosto", active: false },
          { month: "Setembro", active: true },
          { month: "Outubro", active: false },
          { month: "Novembro", active: false },
          { month: "Dezembro", active: true },
        ],
      },
      {
        name: "Carlos",
        instalationNumber: "4156123165487",
        bills: [
          { month: "Janeiro", active: false },
          { month: "Fevereiro", active: true },
          { month: "Março", active: true },
          { month: "Abril", active: true },
          { month: "Maio", active: false },
          { month: "Junho", active: true },
          { month: "Julho", active: true },
          { month: "Agosto", active: true },
          { month: "Setembro", active: false },
          { month: "Outubro", active: false },
          { month: "Novembro", active: false },
          { month: "Dezembro", active: false },
        ],
      },
      {
        name: "Fernanda",
        instalationNumber: "6515613616161",
        bills: [
          { month: "Janeiro", active: true },
          { month: "Fevereiro", active: false },
          { month: "Março", active: false },
          { month: "Abril", active: true },
          { month: "Maio", active: true },
          { month: "Junho", active: false },
          { month: "Julho", active: false },
          { month: "Agosto", active: true },
          { month: "Setembro", active: true },
          { month: "Outubro", active: true },
          { month: "Novembro", active: false },
          { month: "Dezembro", active: true },
        ],
      },
    ],
  },
];
