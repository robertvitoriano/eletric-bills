import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { useEffect, useState, useRef } from "react";
import pdfIcon from "./../../assets/pdf_icon.png";
import pdfIconDisabled from "./../../assets/pdf_icon_disabled.png";
import { Download } from "lucide-react";
import classNames from "classnames";

const rows = [
  {
    name: "Josevaldo",
    instalationNumber: "456456a1561651",
    bills: [
      { month: "Janeiro", active: true },
      { month: "Fevereiro", active: true },
      { month: "Março", active: true },
      { month: "Abril", active: true },
      { month: "Maio", active: false },
      { month: "Junho", active: false },
      { month: "Julho", active: true },
      { month: "Agosto", active: false },
      { month: "Setembro", active: true },
      { month: "Outubro", active: true },
      { month: "Novembro", active: true },
      { month: "Dezembro", active: false },
    ],
  },
  {
    name: "Ana Clara",
    instalationNumber: "9864571456141",
    bills: [
      { month: "Janeiro", active: false },
      { month: "Fevereiro", active: false },
      { month: "Março", active: false },
      { month: "Abril", active: true },
      { month: "Maio", active: true },
      { month: "Junho", active: true },
      { month: "Julho", active: true },
      { month: "Agosto", active: false },
      { month: "Setembro", active: false },
      { month: "Outubro", active: false },
      { month: "Novembro", active: true },
      { month: "Dezembro", active: false },
    ],
  },
  {
    name: "Roberto",
    instalationNumber: "5123156123451",
    bills: [
      { month: "Janeiro", active: false },
      { month: "Fevereiro", active: true },
      { month: "Março", active: true },
      { month: "Abril", active: true },
      { month: "Maio", active: true },
      { month: "Junho", active: true },
      { month: "Julho", active: false },
      { month: "Agosto", active: true },
      { month: "Setembro", active: true },
      { month: "Outubro", active: true },
      { month: "Novembro", active: false },
      { month: "Dezembro", active: false },
    ],
  },
  {
    name: "Mariana",
    instalationNumber: "7152156123487",
    bills: [
      { month: "Janeiro", active: true },
      { month: "Fevereiro", active: true },
      { month: "Março", active: false },
      { month: "Abril", active: false },
      { month: "Maio", active: false },
      { month: "Junho", active: true },
      { month: "Julho", active: false },
      { month: "Agosto", active: false },
      { month: "Setembro", active: true },
      { month: "Outubro", active: false },
      { month: "Novembro", active: false },
      { month: "Dezembro", active: true },
    ],
  },
  {
    name: "Carlos",
    instalationNumber: "4156123165487",
    bills: [
      { month: "Janeiro", active: false },
      { month: "Fevereiro", active: true },
      { month: "Março", active: true },
      { month: "Abril", active: true },
      { month: "Maio", active: false },
      { month: "Junho", active: true },
      { month: "Julho", active: true },
      { month: "Agosto", active: true },
      { month: "Setembro", active: false },
      { month: "Outubro", active: false },
      { month: "Novembro", active: false },
      { month: "Dezembro", active: false },
    ],
  },
  {
    name: "Fernanda",
    instalationNumber: "6515613616161",
    bills: [
      { month: "Janeiro", active: true },
      { month: "Fevereiro", active: false },
      { month: "Março", active: false },
      { month: "Abril", active: true },
      { month: "Maio", active: true },
      { month: "Junho", active: false },
      { month: "Julho", active: false },
      { month: "Agosto", active: true },
      { month: "Setembro", active: true },
      { month: "Outubro", active: true },
      { month: "Novembro", active: false },
      { month: "Dezembro", active: true },
    ],
  },
];

export function Bills() {
  return (
    <div className="flex flex-col gap-4 w-screen h-screen items-center  relative text-white">
      <div className="flex gap-4">
        <div className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2015
        </div>
        <div className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2016
        </div>
        <div className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2017
        </div>
        <div className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2018
        </div>
        <div className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2019
        </div>
        <div className="bg-primary p-2  md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2020
        </div>
        <div className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2021
        </div>
        <div className="bg-primary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-primary">
          2022
        </div>
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
          {rows.map(({ instalationNumber, name, bills }) => (
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
