import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { XAxis, CartesianGrid, Tooltip, YAxis, BarChart, Bar, Legend } from "recharts";

const dataFinanceira = [
  { month: "Jan", total: 300, economia: 50 },
  { month: "Fev", total: 350, economia: 100 },
  { month: "Mar", total: 400, economia: 150 },
  { month: "Abr", total: 450, economia: 200 },
  { month: "Mai", total: 500, economia: 250 },
  { month: "Jun", total: 550, economia: 300 },
  { month: "Jul", total: 600, economia: 350 },
  { month: "Ago", total: 650, economia: 400 },
  { month: "Set", total: 700, economia: 450 },
  { month: "Out", total: 750, economia: 500 },
  { month: "Nov", total: 800, economia: 550 },
  { month: "Dez", total: 850, economia: 600 },
];
export const FinancialResults = () => {
  return (
    <Card className="w-full 2xl:w-fit bg-primary text-white">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Valor Total sem GD vs Economia GD</CardTitle>
        </div>
        <DollarSign />
      </CardHeader>
      <CardContent>
        <div className="bg-primary rounded-lg shadow p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Resultados Financeiros (R$)</h2>
          <BarChart width={600} height={300} data={dataFinanceira} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#ff7300" />
            <Bar dataKey="economia" fill="#387908" />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
};
