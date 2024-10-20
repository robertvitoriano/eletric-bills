import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { XAxis, CartesianGrid, Tooltip, YAxis, BarChart, Bar, Legend } from "recharts";
interface Props {
  economyWithGDValuesPerMonth: Array<{ month: string; totalWithoutGD: number; economyWithGD: number }>;
}
export const FinancialResults = ({ economyWithGDValuesPerMonth }: Props) => {
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
          <BarChart
            width={600}
            height={300}
            data={economyWithGDValuesPerMonth}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalWithoutGD" fill="#ff7300" />
            <Bar dataKey="economyWithGD" fill="#387908" />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
};
