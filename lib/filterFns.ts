import { Row } from "@tanstack/react-table";
import { isBefore, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { companyInfo, SponsorLevel } from "@/app/columns";

export function isWithinRange<TData>(
  row: Row<TData>,
  columnId: string,
  value: string
): boolean {
  const date = new Date(row.getValue(columnId));
  let start: Date | undefined;
  switch (value) {
    case "Past day":
      start = subDays(new Date(), 1);
      break;
    case "Past week":
      start = subWeeks(new Date(), 1);
      break;
    case "Past two weeks":
      start = subWeeks(new Date(), 2);
      break;
    case "Past month":
      start = subMonths(new Date(), 1);
      break;
    case "Past three months":
      start = subMonths(new Date(), 3);
      break;
    case "Past six months":
      start = subMonths(new Date(), 6);
      break;
    case "Past year":
      start = subYears(new Date(), 1);
      break;
    default:
      start = undefined;
  }
  //If one filter defined and date is null filter it
  if (start && !date) return false;
  else if (!start) return true;
  else return isBefore(start, date)
}

export function locationFilter<TData>(
  row: Row<TData>,
  columnId: string,
  value: string
): boolean {
  const rowLocations: string[] | undefined = row.getValue(columnId);
  if (!rowLocations || rowLocations.length === 0) return false;
  return rowLocations
    .map((location) => location === value)
    .reduce((prev, curr) => prev || curr, false);
}

export function companyFilter<TData>(
  row: Row<TData>,
  columnId: string,
  value: string
): boolean {
  const companyName = row.getValue("companyName") as string;
  const companyLevel = companyInfo[companyName]?.sponsorLevel;
  if (!isNaN(Number(value))) {
    const valueNum = parseInt(value)
    if (companyLevel === undefined) return false;
    if (companyLevel === valueNum) return true;
  }
  return companyName === value;
}

