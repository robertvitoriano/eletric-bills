import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

export const EffectiveTotalCard = () => {
  return (
    <Card className="rounded-lg bg-primary">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-white">Consumo total (ano)</CardTitle>
        <Zap className="text-white" /> {/* Replaced icon */}
      </CardHeader>
      <CardContent className="space-y-10 border-none">
        <span className="text-2xl font-bold tracking-tight text-white">400 kWh</span>
      </CardContent>
    </Card>
  );
};
