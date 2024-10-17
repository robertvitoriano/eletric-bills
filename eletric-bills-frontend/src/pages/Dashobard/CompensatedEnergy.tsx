import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { ResponsiveContainer, XAxis, CartesianGrid, Tooltip, YAxis, BarChart, Bar, Legend } from "recharts";

const dataEnergia = [
  { month: "Jan", consumo: 120, compensada: 30 },
  { month: "Fev", consumo: 150, compensada: 50 },
  { month: "Mar", consumo: 170, compensada: 70 },
  { month: "Abr", consumo: 200, compensada: 90 },
  { month: "Mai", consumo: 220, compensada: 100 },
  { month: "Jun", consumo: 230, compensada: 110 },
  { month: "Jul", consumo: 240, compensada: 120 },
  { month: "Ago", consumo: 250, compensada: 130 },
  { month: "Set", consumo: 260, compensada: 140 },
  { month: "Out", consumo: 270, compensada: 150 },
  { month: "Nov", consumo: 280, compensada: 160 },
  { month: "Dez", consumo: 290, compensada: 170 },
];

export const CompensatedEnergy = () => {
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
            <BarChart width={600} height={300} data={dataEnergia} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumo" fill="#8884d8" />
              <Bar dataKey="compensada" fill="#82ca9d" />
            </BarChart>
          </div>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
