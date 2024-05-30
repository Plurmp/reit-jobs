"use client";

import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { FullDescription } from "@/components/FullDescription";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Position = {
  url: string;
  positionName: string;
  companyName: string;
  location?: string[];
  description?: string;
  publishDate?: Date;
};

interface ICompanyInfo {
  [key: string]: {
    fullName: string;
    logo: string;
  };
}
import _companyInfo from "@/companyInfo.json";
const companyInfo = _companyInfo as ICompanyInfo;

import { isWithinRange } from "@/lib/filterFns";
import Image from "next/image";

export const columns: ColumnDef<Position>[] = [
  {
    id: "link",
    cell: ({ row }) => {
      const position = row.original;
      return (
        <Link href={position.url} className="inline-flex size-12 rounded-md justify-center items-center hover:bg-accent">
          <Link2 className="size-8"/>
        </Link>
      )
    }
  },
  {
    accessorKey: "positionName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const position = row.original;
      return (
        <>
          <Link href={`?fullDesc=true&rowID=${row.id}`} className="rounded-md hover:bg-accent p-4">{position.positionName}</Link>
          <FullDescription table={table}/>
        </>
      );
    },
  },
  {
    id: "companyLogo",
    cell: ({ row }) => {
      const companyName: string = row.getValue("companyName");
      const logo = companyInfo[companyName].logo;

      return (
        <div className="flex justify-center">
          <img
            src={"/img/logos/" + logo}
            alt={companyInfo[companyName].fullName + " logo"}
            title={companyInfo[companyName].fullName + " logo"}
            className="object-contain max-h-10"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const companyName: string = row.getValue("companyName");
      const fullName = companyInfo[companyName].fullName;
      return <div>{fullName ?? ""}</div>;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const locations: string[] | undefined = row.getValue("location");
      return (
        <div>{locations?.join("<br>") ?? ""}</div>
      );
    }
  },
  {
    accessorKey: "publishDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Publish Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("publishDate"));
      const formatted = date.toLocaleDateString();
      return <div>{formatted}</div>;
    },
    filterFn: isWithinRange
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const position = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(position.url)}
            >
              Copy Job Post URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
