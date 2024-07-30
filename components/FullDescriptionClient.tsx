"use client";

import { Position } from "@/app/columns";
import { usePathname } from "next/navigation";
import { companyInfo, SponsorLevel } from "@/app/columns";
import Link from "next/link";
import { CircleX, LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import { Button } from "./ui/button";

interface FullDescriptionClientProps {
  position: Position;
}

export default function FullDescriptionClient({
  position,
}: FullDescriptionClientProps) {
  const pathname = usePathname();

  const companyName: string = position.companyName;
  const companyFullName = companyInfo[companyName]?.fullName;
  const logo = companyInfo[companyName]?.logo;
  const sponsorLevel = companyInfo[companyName]?.sponsorLevel;
  const sponsorLevelStr = (
    sponsorLevel !== undefined ? SponsorLevel[sponsorLevel] : ""
  ).toUpperCase();

  return (
    <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto flex justify-center items-center">
      <div className="bg-white m-auto p-0 rounded-xl size-5/6 overflow-auto">
        <div className="flex flex-col items-center gap-5">
          <div
            className="flex justify-evenly w-full h-16 top-0 items-center sticky bg-accent bg-sponsor-color"
            data-sponsor={"n" + sponsorLevel}
          >
            <div className="basis-1/6"></div>
            <h1 className="basis-2/3 self-center text-center text-4xl font-bold">
              {sponsorLevel !== undefined ? sponsorLevelStr + " SPONSOR" : ""}
            </h1>
            <Link href={pathname} className="flex justify-end basis-1/6">
              <CircleX className="size-12" />
            </Link>
          </div>
          <img
            src={`/img/logos/${logo}`}
            alt={`${companyFullName} logo`}
            className="max-h-32"
          />
          <h1 className="font-bold text-3xl">
            {(position.positionName as string) ?? ""}
          </h1>
          <h2 className="font-semibold">{`Company: ${companyFullName}`}</h2>
          <h2 className="font-semibold">{`Locations: ${(position.location as string[]).join(", ")}`}</h2>
          <h2 className="font-semibold">
            Published:{" "}
            {position.publishDate
              ? new Date(position.publishDate).toLocaleDateString()
              : ""}
          </h2>
          <Link href={position.url}>
            <Button className="transition ease-in-out hover:scale-105">
              Apply Here
            </Button>
          </Link>
          <div className="m-8">
            <Suspense fallback={<LoaderCircle />}>
              <p>{position.description}</p>
            </Suspense>
          </div>
        </div>
      </div>
    </dialog>
  );
}
