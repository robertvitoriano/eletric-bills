import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
