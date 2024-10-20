import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { useEffect, useState } from "react";
import pdfIcon from "./../../assets/pdf_icon.png";
import pdfIconDisabled from "./../../assets/pdf_icon_disabled.png";
import { Eye } from "lucide-react";
import classNames from "classnames";
import { Pagination } from "@/components/pagination";
import { getCustomersWithInvoices } from "@/api/get-customers-with-invoices";
import { months } from "./invoice-mocks";
import { DrawerDialog } from "@/components/DrawerDialog";

export function Invoices() {
  const [years, setYears] = useState<Array<number>>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [customers, setCustomers] = useState<any>([]);
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const params = new URLSearchParams(window.location.search);

    const yearFromQuery = Number(params.get("year"));

    if (!isNaN(yearFromQuery)) {
      setSelectedYear(yearFromQuery);
    }
    const customersResponse = await getCustomersWithInvoices();

    setCustomers(customersResponse.customers);
    setYears(customersResponse.availableYears as number[]);
    console.log(customers);
  }

  function updateUrlQueryParam(year: number) {
    const params = new URLSearchParams(window.location.search);
    params.set("year", year.toString());
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  }

  function handleSelectedYear(year: number) {
    setSelectedYear(year);
    updateUrlQueryParam(year);
  }

  function handleInvoiceDownload(invoice) {
    console.log(invoice);
  }

  return (
    <div className="flex flex-col gap-4 w-screen h-screen items-center relative text-white p-4">
      <div className="flex gap-4 p-4">
        {years.map((year) => (
          <div
            key={year}
            className={classNames(
              "bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary",
              {
                "bg-white text-primary": selectedYear === year ? year : year,
              }
            )}
            onClick={() => handleSelectedYear(year)}
          >
            {year}
          </div>
        ))}
      </div>
      <div className="w-full">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center text-white">Nome</TableHead>
              <TableHead className="text-center text-white">Nº de Instalação</TableHead>
              <TableHead className="text-center text-white">Nº do Cliente</TableHead>

              {months.map(({ month }) => (
                <TableHead key={month} className="text-center text-white w-[150px]">
                  {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(({ installationNumber, customerNumber, name, invoices }) => (
              <TableRow key={installationNumber}>
                <TableCell className="font-medium whitespace-nowrap text-center">{name}</TableCell>
                <TableCell className="text-center">{installationNumber}</TableCell>
                <TableCell className="text-center">{customerNumber}</TableCell>

                {months.map((month) => {
                  const invoice = invoices.find(({ reference }) => month.code === reference.split("/")[0]);
                  if (invoice) {
                    return (
                      <DrawerDialog
                        title="Visualizar Fatura"
                        dialogDescription="Clique abaixo para baixar sua fatura"
                        drawerDescription="Clique abaixo para baixar sua fatura"
                        trigger={
                          <TableCell key={invoice.id} className="">
                            <div className="flex justify-center gap-2">
                              <div className={classNames("flex flex-col gap-2")}>
                                <div
                                  className={classNames(
                                    "flex justify-center items-center bg-primary w-fit p-2 text-bold rounded-xl",
                                    "flex-col relative hover:bg-white hover:text-primary cursor-pointer"
                                  )}
                                >
                                  <img src={pdfIcon} className="h-10" />
                                  <div
                                    className={classNames(
                                      "opacity-0 flex items-center justify-center h-12 w-10 absolute hover:opacity-100"
                                    )}
                                  >
                                    <Eye />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        }
                        content={
                          <div className="flex flex-col items-center">
                            <button
                              className="bg-emerald-500 p-4 text-white font-bold rounded-md"
                              onClick={() => handleInvoiceDownload(invoice)}
                            >
                              Baixar Fatura
                            </button>{" "}
                          </div>
                        }
                      />
                    );
                  }
                  return (
                    <TableCell key={month.code}>
                      <div className="flex justify-center gap-2">
                        <div className={classNames("flex flex-col gap-2")}>
                          <div
                            className={classNames(
                              "flex justify-center items-center bg-primary w-fit p-2 text-bold rounded-xl",
                              "flex-col relative"
                            )}
                          >
                            <img src={pdfIconDisabled} className="h-10" />
                            <div
                              className={classNames("opacity-0 flex items-center justify-center h-12 w-10 absolute")}
                            >
                              <Eye />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  );
                })}
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
