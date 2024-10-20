import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { ResponsiveContainer, XAxis, CartesianGrid, Tooltip, YAxis, BarChart, Bar, Legend } from "recharts";

interface Props {
  consumedEnergyAndCompensatedEnergy: Array<{ month: string; consumedEnergy: number; compensatedEnergy: number }>;
}

export const CompensatedEnergy = ({ consumedEnergyAndCompensatedEnergy }: Props) => {
  return (
    <Card className="w-full 2xl:w-fit bg-primary text-white">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Consumo de Energia Elétrica KWh vs Energía Compensada</CardTitle>
        </div>
        <DollarSign />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer className={"w-fit"}>
          <div className="bg-primary rounded-lg shadow p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Resultados de Energia (kWh)</h2>
            <BarChart
              width={600}
              height={300}
              data={consumedEnergyAndCompensatedEnergy}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumedEnergy" fill="#8884d8" />
              <Bar dataKey="compensatedEnergy" fill="#82ca9d" />
            </BarChart>
          </div>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
