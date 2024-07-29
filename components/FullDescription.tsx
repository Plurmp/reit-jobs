import { Table } from "@tanstack/react-table";
import { CircleX, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

import { companyInfo, SponsorLevel } from "@/app/columns";
import { Position } from "@/app/columns";
import { Button } from "./ui/button";
import { loadDescription } from "@/lib/loadDescription";
import React from "react";
import { newlineToBreak } from "@/lib/newlineToBreak";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import FullDescriptionClient from "./FullDescriptionClient";

interface FullDescriptionProps {
  rowUrl: string;
}

export async function FullDescription({ rowUrl }: FullDescriptionProps) {
  const client = generateClient<Schema>();
  const {data: rawPositions} = await client.models.Positions.list({
    filter: {
      url: {
        eq: rowUrl
      }
    },
    selectionSet: ["url", "positionName", "companyName", "location", "publishDate", "description"]
  })

  if (rawPositions.length <= 0) return <></>;

  const rawPosition = rawPositions[0]
  const position: Position = {
    url: rawPosition.url,
    positionName: rawPosition.positionName,
    companyName: rawPosition.companyName,
    location: rawPosition.location ?? undefined,
    publishDate: !!rawPosition.publishDate ? new Date(rawPosition.publishDate) : undefined,
    description: rawPosition.description ?? undefined,
  }

  return (
    <FullDescriptionClient position={position} />
  );
}