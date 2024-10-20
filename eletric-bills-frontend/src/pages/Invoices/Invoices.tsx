import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { useEffect, useState } from "react";
import pdfIcon from "./../../assets/pdf_icon.png";
import pdfIconDisabled from "./../../assets/pdf_icon_disabled.png";
import { Eye } from "lucide-react";
import classNames from "classnames";
import { Pagination } from "@/components/pagination";
import {
  Customer,
  getCustomersWithInvoices,
  Invoice,
  InvoiceItem,
  Pagination as IPagination,
} from "@/api/get-customers-with-invoices";
import { months } from "./invoice-mocks";
import { DrawerDialog } from "@/components/DrawerDialog";

export function Invoices() {
  const [years, setYears] = useState<Array<number>>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ pageTotal: 1, currentPage: 1, total: 1, perPage: 1 });
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
    setPagination(customersResponse.pagination);
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

  function handleInvoiceDownload(invoice: Invoice) {
    fetch(invoice.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download invoice.");
        }
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `Fatura-${invoice.reference}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error downloading invoice:", error);
      });
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
                <TableHead key={month} className="text-center text-white">
                  <div className="w-14">{month}</div>
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
                  const invoice = invoices.find(({ reference }: Invoice) => month.code === reference.split("/")[0]);
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
                                  <img src={pdfIcon} className="h-10 mi-w-10" />
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
                          <div>
                            <div className="flex flex-col  p-4  gap-6 overflow-y-auto overflow-x-hidden h-[400px]">
                              <div className="text-center font-bold text-lg mb-4 text-white">
                                Fatura: {invoice.reference}
                              </div>

                              <div className="flex flex-wrap gap-4 justify-between w-full">
                                <div className="flex-1 min-w-[250px]">
                                  <h3 className="font-bold text-md mb-2 text-white">Detalhes da Fatura:</h3>
                                  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <p>
                                        <strong>Data de Vencimento:</strong>
                                        <br />
                                        {new Date(invoice.due_date).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>Leitura Anterior:</strong>
                                        <br />
                                        {new Date(invoice.previous_reading).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>Leitura Atual:</strong>
                                        <br />
                                        {new Date(invoice.current_reading).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>Total:</strong>
                                        <br />
                                        R$ {invoice.total_amount}
                                      </p>
                                    </div>
                                    <p className="mt-2">
                                      <strong>Código de Barras:</strong>
                                      <br />
                                      {invoice.bar_code_number}
                                    </p>
                                    <a
                                      href={invoice.url}
                                      className="text-blue-600 underline mt-2 block"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Visualizar PDF
                                    </a>
                                  </div>
                                </div>

                                <div className="flex-1 min-w-[350px] p-4">
                                  <h3 className="font-bold text-md mb-2 text-white">Itens da Fatura:</h3>
                                  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                    {invoice.invoice_items.map((item: InvoiceItem) => (
                                      <div key={item.id} className="border-b py-2">
                                        <p>
                                          <strong>Item:</strong> {item.invoiceItemType.type_name}
                                        </p>
                                        {item.quantity && (
                                          <p>
                                            <strong>Quantidade:</strong> {item.quantity}
                                          </p>
                                        )}
                                        <p>
                                          <strong>Valor Total:</strong> R$ {String(item.total_value).replace(".", ",")}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center mt-4">
                              <button
                                className="bg-emerald-500 p-4 text-white font-bold rounded-md"
                                onClick={() => handleInvoiceDownload(invoice)}
                              >
                                Baixar Fatura
                              </button>
                            </div>
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
          <Pagination
            pageIndex={pagination.currentPage - 1}
            perPage={pagination.perPage}
            totalCount={pagination.total}
          />
        </div>
      </div>
    </div>
  );
}
