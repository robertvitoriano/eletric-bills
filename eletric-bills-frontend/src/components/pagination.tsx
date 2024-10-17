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
    <div className="flex items-center justify-between bg-primary text-black p-4 py-2">
      <span className="text-sm text-muted-foreground">Total de {totalCount} item(s)</span>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Página {pageIndex + 1} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} className="h-8 w-8 p-0">
            <ChevronsLeft className="h-8 w-4">
              <span className="sr-only">Primeira página</span>
            </ChevronsLeft>
          </Button>
          <Button variant={"outline"} className="h-8 w-8 p-0">
            <ChevronLeft className="h-8 w-4">
              <span className="sr-only">Página anterior</span>
            </ChevronLeft>
          </Button>
          <Button variant={"outline"} className="h-8 w-8 p-0">
            <ChevronRight className="h-8 w-4">
              <span className="sr-only">Próxima página</span>
            </ChevronRight>
          </Button>
          <Button variant={"outline"} className="h-8 w-8 p-0">
            <ChevronsRight className="h-8 w-4">
              <span className="sr-only">Última página</span>
            </ChevronsRight>
          </Button>
        </div>
      </div>
    </div>
  );
};
