import { Row } from "@tanstack/react-table";
import { companyInfo } from "@/app/columns";

export function sponsorSort<TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number {
    const companyA = rowA.getValue(columnId) as string;
    const { sponsorLevel: levelA } = companyInfo[companyA];
    const companyB = rowB.getValue(columnId) as string;
    const { sponsorLevel: levelB } = companyInfo[companyB];
    if (levelA === undefined && levelB === undefined) {
        return 0;
    } else if (levelA === undefined) {
        return -1;
    } else if (levelB === undefined) {
        return 1;
    } else if (levelA < levelB) {
        return -1;
    } else if (levelA > levelB) {
        return 1;
    } else {
        return 0;
    }
}