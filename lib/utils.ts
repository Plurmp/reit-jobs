'use client';

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import states from "states-us"
import lookup from "country-code-lookup";

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

export function normalizeLocation(locations?: string[]): string[] {
  if (!locations) return [];

  return locations.map((location) => {
    location = location.trim();
    states.forEach((state) => {
      if (location.indexOf(state.name) === -1) {
        return;
      }
      if (location.indexOf(state.name) === 0) {
        location = state.abbreviation;
        return;
      }
      location = location.replace(`, ${state.name}`, `, ${state.abbreviation}`);
    })

    const onlyCountry = lookup.byCountry(location)
    if (onlyCountry !== null) {
      location = onlyCountry.iso3;
    }
    const lastPart = location.match(/, ([a-zA-z ]+)$/)?.[1];
    const lastCountry = !!lastPart ? lookup.byCountry(lastPart) : undefined;
    if (!!lastCountry) {
      location = location.replace(`, ${lastCountry.country}`, `, ${lastCountry.iso3}`);
    }

    return location
  })
}