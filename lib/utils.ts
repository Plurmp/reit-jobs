import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface ICompanyInfo {
  [key: string]: {
    fullName: string;
    logo: string;
  };
}
import _companyInfo from "@/companyInfo.json";
const companyInfo = _companyInfo as ICompanyInfo;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function companyFullName(name: string | undefined): string | undefined {
  if (!name || name === "") {
    return;
  }

  return companyInfo[name].fullName;
}