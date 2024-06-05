"use client";

import { Table } from "@tanstack/react-table";
import { CircleX } from "lucide-react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

import { companyInfo } from "./DataTable";
import { Position } from "@/app/columns";
import { newlineToBreak } from "@/lib/newlineToBreak";

interface FullDescriptionProps {
    table: Table<Position>
}

export function FullDescription({ table }: FullDescriptionProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const modal = searchParams.get("fullDesc");
    const rowID = searchParams.get("rowID");
    if (!rowID) {
        return "";
    }

    const row = table.getCoreRowModel().rowsById[rowID].original

    const companyName: string = row.companyName;
    const companyFullName = companyInfo[companyName]?.fullName;
    const logo = companyInfo[companyName]?.logo;

    return (
        <>
            {modal &&
                <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto flex justify-center items-center">
                    <div className="bg-white m-auto p-8 rounded-xl size-5/6 overflow-auto">
                        <div className="flex flex-col items-center gap-5">
                            <Link href={pathname} className="flex w-full justify-end"><CircleX className="size-12 bg-white hover:bg-accent rounded-md fixed"/></Link>
                            <img src={`/img/logos/${logo}`} alt={`${companyFullName} logo`} className="max-h-32"/>
                            <h1 className="font-bold text-3xl">{row.positionName as string ?? ""}</h1>
                            <h2 className="font-semibold">{`Company: ${companyFullName}`}</h2>
                            <h2 className="font-semibold">{`Locations: ${(row.location as string[]).join(", ")}`}</h2>
                            <h2 className="font-semibold">{`Published: ${row.publishDate ? new Date(row.publishDate).toLocaleDateString() : ""}`}</h2>
                            <div>{newlineToBreak(row.description)}</div>
                        </div>
                    </div>
                </dialog>
            }
        </>
    );
}