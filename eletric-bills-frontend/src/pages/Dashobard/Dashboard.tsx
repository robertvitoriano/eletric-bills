import { TotalWithoutGDCard } from "./TotalWithoutGDCard";
import { EffectiveTotalCard } from "./EffectiveTotalCard";
import { TotalCompensationGDCard } from "./TotalCompensatedEnergyGDCard";
import { CompensatedEnergy } from "./CompensatedEnergy";
import { FinancialResults } from "./FinancialResults";
import { InvoicesComposition } from "./InvoicesComposition";
import { DrawerDialog } from "@/components/DrawerDialog";
import { FileUp } from "lucide-react";
import { useState, useRef } from "react";
import { uploadNewInvoice } from "@/api/upload-new-invoice";

export function Dashboard() {
  const [fileSelected, setFileSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newFileToBeUploaded, setNewFileToBeUploaded] = useState();
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setNewFileToBeUploaded(file);
      setFileSelected(true);
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

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      setNewFileToBeUploaded(file);
      setFileSelected(true);
    }
  };

  async function handleInvoiceFileUpload() {
    console.log("Trying to upload");
    if (newFileToBeUploaded) {
      try {
        await uploadNewInvoice(newFileToBeUploaded);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4 text-white p-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <DrawerDialog
            title="Processar nova fatura"
            dialogDescription="Clique abaixo para selecionar ou arraste a nova fatura que deseja processar"
            drawerDescription="Clique abaixo para selecionar uma nova fatura"
            trigger={
              <div className="text-white bg-emerald-500 p-4 cursor-pointer font-bold w-fit rounded-md">
                Processar nova Fatura
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
                  <div className="relative flex items-center justify-center cursor-pointer">
                    <div className="absolute w-80 h-80 bg-transparent border-2 border-gray-500 rounded-xl" />
                    <div className="absolute w-32 h-32 bg-gray-500 opacity-20 rounded-full" />
                    {!isDragging && <FileUp className="w-16 h-16 text-emerald-500 z-10" />}
                    {isDragging && <span className="font-bold text-2xl text-white">Solte a fatura!</span>}
                  </div>

                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
                </div>
                <div className="my-4">
                  {fileSelected && (
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
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
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
