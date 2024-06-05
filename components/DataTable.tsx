"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ChevronDown } from "lucide-react";
import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ICompanyInfo {
  [key: string]: {
    fullName: string;
    logo: string;
  };
}
import _companyInfo from "@/companyInfo.json";
export const companyInfo = _companyInfo as ICompanyInfo;

import { companyFullName } from "@/lib/utils";
import { isWithinRange, locationFilter } from "@/lib/filterFns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "positionName", desc: false }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const dateFilters = [
    "Past day",
    "Past week",
    "Past two weeks",
    "Past month",
    "Past three months",
    "Past six months",
    "Past year",
  ];

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      'isWithinRange': isWithinRange,
      'locationFilter': locationFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="px-4 py-4">
      <div className="flex justify-between">
        <Input
          placeholder="Filter all..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-1/2 focus-visible:ring-offset-blue-900 focus-visible:ring-gray-200"
        />
        <div className="flex gap-2">
          <div className="flex items-center justify-center text-sm font-medium text-gray-200">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <div className="flex py-2">
        <div className="flex flex-col pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between px-2 mb-2 w-40">
                <div className="truncate max-w-28">{(table.getColumn("positionName")?.getFilterValue() as string) ?? "Filter positions"}</div>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="overflow-auto max-h-96">
              <DropdownMenuItem
                key='clearPosition'
                onClick={() => table.getColumn("positionName")?.setFilterValue("")}
              >
                <i>[Clear selection]</i>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {
                Array.from(new Set(table.getFilteredRowModel().rows.map((row) => row.getValue("positionName") as string)))
                  .sort()
                  .map((positionFilter, i) =>
                    <DropdownMenuItem
                      key={i}
                      onClick={() =>
                        table.getColumn("positionName")?.setFilterValue(positionFilter)
                      }
                    >
                      {positionFilter}
                    </DropdownMenuItem>
                  )
              }
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between px-2 mb-2 w-40 truncate">
                <div className="truncate max-w-28">
                  {
                    companyFullName(table.getColumn("companyName")?.getFilterValue() as string) ?? "Filter companies"
                  }
                </div>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="overflow-auto max-h-96">
              <DropdownMenuItem
                key={"clearCompany"}
                onClick={() => table.getColumn("companyName")?.setFilterValue("")}
              >
                <i>[Clear selection]</i>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {
                Array.from(new Set(table.getFilteredRowModel().rows.map((row) => row.getValue("companyName") as string)))
                  .sort()
                  .map((companyFilter, i) =>
                    <DropdownMenuItem
                      key={i}
                      onClick={() =>
                        table.getColumn("companyName")?.setFilterValue(companyFilter)
                      }
                    >
                      {companyInfo[companyFilter]?.fullName ?? ""}
                    </DropdownMenuItem>
                  )
              }
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between px-2 mb-2 w-40 truncate">
                <div className="truncate max-w-28">{table.getColumn("location")?.getFilterValue() as string ?? "Filter location"}</div>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="overflow-auto max-h-96">
              <DropdownMenuItem
                key={"clearLocation"}
                onClick={() => table.getColumn("location")?.setFilterValue("")}
              >
                <i>[Clear selection]</i>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {
                Array.from(new Set(table.getFilteredRowModel().rows.flatMap((row) => row.getValue("location") as string[])))
                  .sort()
                  .map((locationFilter, i) =>
                    <DropdownMenuItem
                      key={i}
                      onClick={() =>
                        table.getColumn("location")?.setFilterValue(locationFilter)
                      }
                    >
                      {locationFilter}
                    </DropdownMenuItem>
                  )
              }
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="justify-between px-2 mb-2 w-40 truncate">
                <div className="truncate max-w-28">{table.getColumn("publishDate")?.getFilterValue() as string ?? "Filter dates"}</div>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="overflow-auto max-h-96">
              <DropdownMenuItem
                key={"clearDate"}
                onClick={() => table.getColumn("publishDate")?.setFilterValue("")}
              >
                <i>[Clear Selection]</i>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {
                dateFilters.map((dateFilter, i) =>
                  <DropdownMenuItem
                    key={i}
                    onClick={() => table.getColumn("publishDate")?.setFilterValue(dateFilter)}
                  >
                    {dateFilter}
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border w-full h-fit bg-white opacity-90 shadow-lg">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    key={"noResults"}
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
