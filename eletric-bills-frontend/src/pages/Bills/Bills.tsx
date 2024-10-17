import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { useEffect, useState, useRef } from "react";
import pdfIcon from "./../../assets/pdf_icon.png";
import pdfIconDisabled from "./../../assets/pdf_icon_disabled.png";
import { Download } from "lucide-react";
import classNames from "classnames";
import { mockYears, YearData } from "./bill-mocks";

export function Bills() {
  const [years, setYears] = useState<Array<YearData>>(mockYears);
  const [selectedYear, setSelectedYear] = useState<YearData>();

  function handleSelectedYear(year: YearData) {
    setSelectedYear(year);
  }
  return (
    <div className="flex flex-col gap-4 w-screen h-screen items-center  relative text-white">
      <div className="flex gap-4">
        {years.map((year) => (
          <div
            className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary"
            onClick={() => handleSelectedYear(year)}
          >
            {year.year}
          </div>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Nome</TableHead>
            <TableHead className="text-center">Número de Instalação</TableHead>
            <TableHead className="text-center">Faturas por mês</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedYear &&
            selectedYear.rows.map(({ instalationNumber, name, bills }) => (
              <TableRow>
                <TableCell className="font-medium whitespace-nowrap text-center">{name}</TableCell>
                <TableCell className="text-center">{instalationNumber}</TableCell>
                <TableCell>
                  <div className="flex  justify-center flex-wrap gap-4">
                    {bills.map(({ month, active }) => (
                      <div className="flex flex-col gap-4">
                        <span className="text-primary font-bold">{month}</span>
                        <div
                          className={classNames(
                            "flex justify-center gap-2 items-center bg-primary w-fit p-2 text-bold rounded-xl",
                            "flex-col relative",
                            {
                              "hover:bg-white hover:text-primary cursor-pointer": active,
                            }
                          )}
                        >
                          <img src={active ? pdfIcon : pdfIconDisabled} className="h-10" />
                          <div
                            className={classNames("opacity-0  flex items-center justify-center h-12 w-10 absolute", {
                              "hover:opacity-100": active,
                            })}
                          >
                            <Download />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
