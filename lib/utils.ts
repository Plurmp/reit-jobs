"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ICompanyInfo {
  [key: string]: {
    fullName: string;
    logo: string;
  };
}
import _companyInfo from "@/companyInfo.json";
const companyInfo = _companyInfo as ICompanyInfo;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function companyFullName(name: string | undefined): string | undefined {
  if (!name || name === "") {
    return;
  }

  return companyInfo[name].fullName;
}

export function mostCommonWords(text: string, amount: number): string[] {
  if (!text) return [];
  const vettedText = text
    .replace(/\(.+\)/g, "")
    .replace(/and/g, "")
    .replace(/[^a-zA-Z ]/g, "")
    .replace(/ I+ /g, " ")
    .replace(/Part/g, " ")
    .replace(/Tanger/g, " ");
  let hash: { [key: string]: number } = {};
  vettedText
    .split(/\s+/)
    .map((word) => word.toLowerCase())
    .forEach((word) => {
      if (!hash[word]) {
        hash[word] = 1;
      } else {
        hash[word] += 1;
      }
    });

  let wordCounts: string[][] = [];
  Object.entries(hash).forEach(([word, count]) => {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    if (!wordCounts[count]) {
      wordCounts[count] = [word];
    } else {
      wordCounts[count].push(word);
    }
  });
  return wordCounts
    .toReversed()
    .filter((arr): arr is string[] => !!arr)
    .flat()
    .slice(0, amount);
}

export function locationSort(a: string, b: string): number {
  if (a === "Hybrid" && b === "Hybrid") {
    return 0;
  } else if (a === "Hybrid") {
    return -1;
  } else if (b === "Hybrid") {
    return 1;
  }

  const countryOrState = /(?<country>[A-Z]{3})|(?<state>[A-Z]{2})$/;
  const groupsA = countryOrState.exec(a)?.groups;
  const groupsB = countryOrState.exec(b)?.groups;

  if (!groupsA && !groupsB) {
    return a.localeCompare(b);
  } else if (!groupsA) {
    return -1;
  } else if (!groupsB) {
    return 1;
  }

  const { country: countryA, state: stateA } = groupsA;
  const { country: countryB, state: stateB } = groupsB;

  if (!!countryA && !!countryB && countryA === countryB) {
    if (a.indexOf(countryA) === 0) {
      return -1
    }
    if (b.indexOf(countryB) === 0) {
      return 1
    }
    if (a.indexOf(countryA) === 0 && b.indexOf(countryB) === 0) {
      return 0
    }
  }

  if (!!countryA && !!countryB && countryA !== countryB) {
    return countryA.localeCompare(countryB);
  } else if (!countryA && !!countryB) {
    return -1;
  } else if (!!countryA && !countryB) {
    return 1;
  }

  if (!!stateA && stateB && stateA === stateB) {
    if (a.indexOf(stateA) === 0) {
      return -1
    }
    if (b.indexOf(stateB) === 0) {
      return 1
    }
  }

  if (!!stateA && !!stateB && stateA !== stateB) {
    return stateA.localeCompare(stateB);
  } else if (!stateA && !!stateB) {
    return -1;
  } else if (!!stateA && !stateB) {
    return 1;
  }

  return a.localeCompare(b);
}
