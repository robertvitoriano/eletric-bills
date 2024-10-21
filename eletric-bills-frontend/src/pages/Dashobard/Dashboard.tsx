import { TotalWithoutGDCard } from "./TotalCostWithoutGDCard";
import { ConsumptionOfElectricEnergyCard } from "./ConsumptionOfElectricEnergyCard";
import { TotalCompensationGDCard } from "./TotalCompensatedEnergyGDCard";
import { CompensatedEnergy } from "./CompensatedEnergy";
import { FinancialResults } from "./FinancialResults";
import { DrawerDialog } from "@/components/DrawerDialog";
import { FileUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { uploadNewInvoice } from "@/api/upload-new-invoice";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import { getStatistics } from "@/api/get-statistics";
import { GDEconomyCard } from "./GDEconomyCard";
export function Dashboard() {
  const [customerNumber, setCustomerNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showAllData, setShowAllData] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filesSelected, setFilesSelected] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [consumptionOfElectricEnergy, setConsumptionOfElectricEnergy] = useState<number>();
  const [compensatedEnergy, setCompensatedEnergy] = useState<number>();
  const [totalCostWithoutGDEnergy, setTotalCostWithoutGDEnergy] = useState<number>();
  const [gdEconomy, setGDEconomy] = useState();
  const [economyWithGDValuesPerMonth, setEconomyWithGDValuesPerMonth] = useState<
    Array<{ month: string; totalWithoutGD: number; economyWithGD: number }>
  >([]);
  const [consumedEnergyAndCompensatedEnergy, setConsumedEnergyAndCompensatedEnergy] =
    useState<Array<{ month: string; consumedEnergy: number; compensatedEnergy: number }>>();

  useEffect(() => {
    if (showAllData || customerNumber || (startDate && endDate)) {
      loadStatistics();
    }
  }, [showAllData, customerNumber, startDate, endDate]);

  async function loadStatistics() {
    const statisticsResponse = await getStatistics({
      customer_number: customerNumber,
      start_date: startDate,
      end_date: endDate,
    });
    setConsumptionOfElectricEnergy(statisticsResponse.consumptionOfElectricEnergy);
    setCompensatedEnergy(statisticsResponse.compensatedEnergy);
    setTotalCostWithoutGDEnergy(statisticsResponse.totalCostWithoutGDEnergy);
    setGDEconomy(statisticsResponse.gdEconomy);
    setEconomyWithGDValuesPerMonth(statisticsResponse.economyWithGDValuesPerMonth);
    setConsumedEnergyAndCompensatedEnergy(statisticsResponse.consumedEnergyAndCompensatedEnergy);
  }

  const handleShowAllData = () => {
    setShowAllData(true);
  };
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFilesSelected((prevFiles) => [...prevFiles, ...selectedFiles]);
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      setFilesSelected((prevFiles) => [...prevFiles, ...droppedFiles]);
    }
  };

  async function handleInvoiceFileUpload() {
    setLoading(true);
    if (filesSelected.length > 0) {
      try {
        await uploadNewInvoice(filesSelected);
        setLoading(false);
        setFilesSelected([]);
        toast("As faturas foram processadas");
      } catch (e) {
        toast("Erro ao processar as faturas");
        setLoading(false);
        setFilesSelected([]);
        console.error(e);
      } finally {
        await loadStatistics();
      }
    }
  }
  if (loading) return <Spinner />;
  return (
    <>
      <div className="flex flex-col gap-4 text-white p-4">
        <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <DrawerDialog
            title="Processar nova fatura"
            dialogDescription="Clique abaixo para selecionar varias faturas ou arraste e solte uma fatura que deseja processar"
            drawerDescription="Clique abaixo para selecionar novas faturas"
            trigger={
              <div className="text-white bg-emerald-500 p-4 cursor-pointer font-bold w-fit rounded-md">
                Processar novas Faturas
              </div>
            }
            content={
              <div className="flex flex-col items-center">
                <div
                  className={`flex flex-col items-center justify-center p-4 w-[400px] h-[350px] transition-opacity duration-300`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                >
                  <div className="relative flex flex-col gap-4 items-center justify-center cursor-pointer ">
                    <div className="absolute w-80 h-80 bg-transparent border-2 border-gray-500 rounded-xl" />
                    <div className="absolute w-32 h-32 bg-gray-500 opacity-20 rounded-full" />
                    {!isDragging && <FileUp className="w-16 h-16 text-emerald-500 z-10" />}
                    {isDragging && <span className="font-bold text-2xl text-white">Solte os arquivos!</span>}
                    <span className="text-white">Clique Aqui!</span>
                  </div>

                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  {filesSelected.map((file, index) => (
                    <div key={index} className="p-2 bg-gray-700 text-white rounded-md text-sm">
                      {file.name}
                    </div>
                  ))}
                </div>

                <div className="my-4">
                  {filesSelected.length > 0 && (
                    <button
                      className="bg-emerald-500 p-4 text-white font-bold rounded-md"
                      onClick={handleInvoiceFileUpload}
                    >
                      Processar dados
                    </button>
                  )}
                </div>
              </div>
            }
          />
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Nº do Cliente"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <input
            type="date"
            placeholder="Data de Início"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <input
            type="date"
            placeholder="Data de Término"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <button className="bg-blue-500 p-2 rounded-md text-white" onClick={handleShowAllData}>
            Dados de Todos os Clientes
          </button>
        </div>
        {(customerNumber || (startDate && endDate) || showAllData) && (
          <>
            <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
              <ConsumptionOfElectricEnergyCard consumptionOfElectricEnergy={consumptionOfElectricEnergy} />
              <TotalWithoutGDCard totalCostWithoutGDEnergy={totalCostWithoutGDEnergy} />
              <TotalCompensationGDCard compensatedEnergy={compensatedEnergy} />
              <GDEconomyCard gdEconomy={gdEconomy} />
            </div>
            <div className="flex flex-col 2xl:flex-row gap-4">
              <CompensatedEnergy consumedEnergyAndCompensatedEnergy={consumedEnergyAndCompensatedEnergy} />
              <FinancialResults economyWithGDValuesPerMonth={economyWithGDValuesPerMonth} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
