import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { ResponsiveContainer, LineChart, XAxis, CartesianGrid, Line, Tooltip, YAxis } from "recharts";
import colors from "tailwindcss/colors";

const data = [
  { date: "10/12", revenue: 1200 },
  { date: "11/12", revenue: 120 },
  { date: "12/12", revenue: 100 },
  { date: "13/12", revenue: 100 },
  { date: "14/12", revenue: 120 },
  { date: "15/12", revenue: 1250 },
  { date: "16/12", revenue: 660 },
];
export const RevenueChart = () => {
  return (
    <Card className="col-span-6 bg-primary text-white">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Evolução do total das faturas</CardTitle>
          <CardDescription>Evolução do total das faturas ao longo do ano</CardDescription>
        </div>
        <DollarSign />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} style={{ fontSize: 12 }}>
            <YAxis
              stroke="#8888"
              axisLine={false}
              tickLine={false}
              width={88}
              tickFormatter={(value: number) =>
                value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <XAxis axisLine={false} tickLine={false} dataKey={"date"} dy={16} />

            <CartesianGrid vertical={false} className="stroke-muted" />
            <Line type="linear" strokeWidth={2} dataKey="revenue" stroke={colors.violet["500"]}></Line>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
