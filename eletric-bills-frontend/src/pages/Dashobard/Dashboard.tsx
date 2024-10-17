import { TotalWithoutGDCard } from "./TotalWithoutGDCard";
import { EffectiveTotalCard } from "./EffectiveTotalCard";
import { TotalCompensationGDCard } from "./TotalCompensatedEnergyGDCard";
import { CompensatedEnergy } from "./CompensatedEnergy";
import { FinancialResults } from "./FinancialResults";
import { InvoicesComposition } from "./InvoicesComposition";

export function Dashboard() {
  return (
    <>
      <div className="flex flex-col gap-4 text-white p-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="text-white bg-emerald-500 p-4 cursor-pointer font-bold w-fit rounded-md">
            Processar nova Fatura
          </div>
        </div>
        <div className=" flex flex-col md:grid md:grid-cols-3 gap-4">
          <EffectiveTotalCard />
          <TotalWithoutGDCard />
          <TotalCompensationGDCard />
        </div>
        <div className="flex flex-col 2xl:flex-row gap-4">
          <CompensatedEnergy />
          <FinancialResults />
          <InvoicesComposition />
        </div>
      </div>
    </>
  );
}
