import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

export const TotalWithoutGDCard = () => {
  return (
    <Card className="rounded-lg bg-primary">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-white">Consumo total sem GD (ano)</CardTitle>
        <Zap className="text-white" />
      </CardHeader>
      <CardContent className="space-y-10 border-none">
        <span className="text-2xl font-bold tracking-tight text-white">300 kWh</span>
      </CardContent>
    </Card>
  );
};
