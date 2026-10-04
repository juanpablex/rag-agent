export type Category = "Contracts" | "Regulations" | "Salaries" | "Price lists" | "Catalogs" | "Policies" | "Reports" | "My documents";

export const CATEGORIES: Category[] = ["Contracts", "Regulations", "Salaries", "Price lists", "Catalogs", "Policies", "Reports", "My documents"];

/** Categories of the built-in (fictional) documents. */
export const BUILT_IN_CATEGORIES = CATEGORIES.filter((c) => c !== "My documents");

export interface Section {
  /** Short id used in citations, e.g. "3". */
  id: string;
  title: string;
  /** Paragraphs of the section. */
  text: string[];
}

export interface Doc {
  id: string;
  title: string;
  category: Category;
  /** ISO date of the current version. */
  date: string;
  version: string;
  owner: string;
  sections: Section[];
}
