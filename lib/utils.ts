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
