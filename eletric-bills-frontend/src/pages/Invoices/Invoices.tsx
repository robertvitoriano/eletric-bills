import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { useEffect, useState } from "react";
import pdfIcon from "./../../assets/pdf_icon.png";
import pdfIconDisabled from "./../../assets/pdf_icon_disabled.png";
import { Eye } from "lucide-react";
import classNames from "classnames";
import { mockYears, YearData } from "./invoice-mocks";
import { Pagination } from "@/components/pagination";
import { getCustomersWithInvoices } from "@/api/get-customers-with-invoices";

export function Invoices() {
  const [years] = useState<Array<YearData>>(mockYears);
  const [selectedYear, setSelectedYear] = useState<YearData>();
  const [customers, setCustomers] = useState<any>([]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const yearFromQuery = params.get("year");
    if (yearFromQuery) {
      const year = years.find((y) => y.year.toString() === yearFromQuery);
      if (year) setSelectedYear(year);
    } else {
      setSelectedYear(years[0]);
    }
    loadData();
  }, [years]);

  async function loadData() {
    const customersResponse = await getCustomersWithInvoices();
    setCustomers(customersResponse.customers);
  }

  function updateUrlQueryParam(year: string) {
    const params = new URLSearchParams(window.location.search);
    params.set("year", year);
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  }

  function handleSelectedYear(year: YearData) {
    setSelectedYear(year);
    updateUrlQueryParam(year.year.toString());
  }

  return (
    <div className="flex flex-col gap-4 w-screen h-screen items-center relative text-white p-4">
      <div className="flex gap-4 p-4">
        {years.map((year) => (
          <div
            key={year.year}
            className={classNames(
              "bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary",
              {
                "bg-white text-primary": selectedYear?.year === year?.year,
              }
            )}
            onClick={() => handleSelectedYear(year)}
          >
            {year.year}
          </div>
        ))}
      </div>
      <div className="w-full">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center text-white">Nome</TableHead>
              <TableHead className="text-center text-white">Número de Instalação</TableHead>
              {selectedYear?.customers[0].invoices.map(({ month }) => (
                <TableHead key={month} className="text-center text-white">
                  {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(({ instalationNumber, name, invoices }) => (
              <TableRow key={instalationNumber}>
                <TableCell className="font-medium whitespace-nowrap text-center">{name}</TableCell>
                <TableCell className="text-center">{instalationNumber}</TableCell>
                {invoices.map(({ month, active }) => (
                  <TableCell key={month}>
                    <div className="flex justify-center gap-2">
                      <div className={classNames("flex flex-col gap-2")}>
                        <div
                          className={classNames(
                            "flex justify-center items-center bg-primary w-fit p-2 text-bold rounded-xl",
                            "flex-col relative",
                            {
                              "hover:bg-white hover:text-primary cursor-pointer": active,
                            }
                          )}
                        >
                          <img src={active ? pdfIcon : pdfIconDisabled} className="h-10" />
                          <div
                            className={classNames("opacity-0 flex items-center justify-center h-12 w-10 absolute", {
                              "hover:opacity-100": active,
                            })}
                          >
                            <Eye />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 rounded-lg bg-transparent text-white">
          <Pagination pageIndex={0} perPage={10} totalCount={100} />
        </div>
      </div>
    </div>
  );
}
