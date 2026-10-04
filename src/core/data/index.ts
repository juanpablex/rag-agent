import type { Doc } from "../types";
import { CONTRACTS } from "./contracts";
import { REGULATIONS } from "./regulations";
import { POLICIES, SALARIES } from "./hr";
import { CATALOGS, PRICE_LISTS, REPORTS } from "./commercial";

/** All documents of the fictional company Harborline Supply Co. */
export const DOCS: Doc[] = [...CONTRACTS, ...REGULATIONS, ...SALARIES, ...PRICE_LISTS, ...CATALOGS, ...POLICIES, ...REPORTS];

