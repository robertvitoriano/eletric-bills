import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";

export interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  onPageChange: (newPageIndex: number) => void;
}

export const Pagination = (props: PaginationProps) => {
  const { totalCount, perPage, pageIndex, onPageChange } = props;
  const totalPages = Math.ceil(totalCount / perPage) || 1;

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 0) {
      onPageChange(newPageIndex);
    }
  };

  return (
    <div className="flex items-center justify-between k p-4 py-2">
      <span className="text-sm">Total de {totalCount} cliente(s)</span>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium text-white">
          Página {pageIndex} de {totalPages}
        </div>
        <div className="flex items-center gap-2 text-white">
          <Button variant={"outline"} className="h-8 w-8 p-0 bg-primary" onClick={() => handlePageChange(1)}>
            <ChevronsLeft className="h-8 w-4">
              <span className="sr-only">Primeira página</span>
            </ChevronsLeft>
          </Button>
          <Button
            variant={"outline"}
            className="h-8 w-8 p-0 bg-primary"
            onClick={() => handlePageChange(pageIndex - 1)}
          >
            <ChevronLeft className="h-8 w-4">
              <span className="sr-only">Página anterior</span>
            </ChevronLeft>
          </Button>
          <Button
            variant={"outline"}
            className="h-8 w-8 p-0 bg-primary"
            onClick={() => handlePageChange(pageIndex + 1)}
          >
            <ChevronRight className="h-8 w-4">
              <span className="sr-only">Próxima página</span>
            </ChevronRight>
          </Button>
          <Button variant={"outline"} className="h-8 w-8 p-0 bg-primary" onClick={() => handlePageChange(totalPages)}>
            <ChevronsRight className="h-8 w-4">
              <span className="sr-only">Última página</span>
            </ChevronsRight>
          </Button>
        </div>
      </div>
    </div>
  );
};
