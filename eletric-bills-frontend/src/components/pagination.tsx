import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";

export interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
}
export const Pagination = (props: PaginationProps) => {
  const { totalCount, perPage, pageIndex } = props;
  const totalPages = Math.ceil(totalCount / perPage) || 1;
  return (
    <div className="flex items-center justify-between  k p-4 py-2">
      <span className="text-sm">Total de {totalCount} cliente(s)</span>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium text-white">
          Página {pageIndex + 1} de {totalPages}
        </div>
        <div className="flex items-center gap-2 text-white">
          <Button variant={"outline"} className="h-8 w-8 p-0 bg-primary">
            <ChevronsLeft className="h-8 w-4">
              <span className="sr-only">Primeira página</span>
            </ChevronsLeft>
          </Button>
          <Button variant={"outline"} className="h-8 w-8 p-0 bg-primary">
            <ChevronLeft className="h-8 w-4">
              <span className="sr-only">Página anterior</span>
            </ChevronLeft>
          </Button>
          <Button variant={"outline"} className="h-8 w-8 p-0 bg-primary">
            <ChevronRight className="h-8 w-4">
              <span className="sr-only">Próxima página</span>
            </ChevronRight>
          </Button>
          <Button variant={"outline"} className="h-8 w-8 p-0 bg-primary">
            <ChevronsRight className="h-8 w-4">
              <span className="sr-only">Última página</span>
            </ChevronsRight>
          </Button>
        </div>
      </div>
    </div>
  );
};
