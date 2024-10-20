import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

export const GDEconomyCard = ({ gdEconomy }) => {
  return (
    <Card className="rounded-lg bg-primary">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-white">Custo total sem GD (R$)</CardTitle>
        <Zap className="text-white" />
      </CardHeader>
      <CardContent className="space-y-10 border-none">
        <span className="text-2xl font-bold tracking-tight text-white">{String(gdEconomy).replace(".", ",")} </span>
      </CardContent>
    </Card>
  );
};
