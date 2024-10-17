import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import colors from "tailwindcss/colors";

const data = [
  { item: "Iluminação pública", amount: 10 },
  { item: "Energia SCEE", amount: 30 },
  { item: "Energia Elétrica", amount: 120 },
];
const sliceColores = [
  colors.sky["500"],
  colors.amber["500"],
  colors.violet["500"],
  colors.emerald["500"],
  colors.rose["500"],
];
export const InvoicesComposition = () => {
  return (
    <Card className="col-span-3 w-full bg-primary text-white">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="flex w-full items-center justify-between">
          <CardTitle className="text-base font-medium">Composição média das faturas (ano)</CardTitle>
          <DollarSign />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer className={"w-fit"} height={240}>
          <PieChart style={{ fontSize: 12 }}>
            <Pie
              data={data}
              dataKey={"amount"}
              nameKey={"product"}
              cx="50%"
              cy="50%"
              outerRadius={86}
              innerRadius={64}
              strokeWidth={8}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = 12 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    className="fill-muted-foreground text-xs"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {data[index].item.length > 12 ? data[index].item.substring(0, 12).concat("...") : data[index].item}(
                    {value})
                  </text>
                );
              }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={sliceColores[index]}
                  className="stroke-background outline-none hover:opacity-80 "
                ></Cell>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
