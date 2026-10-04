import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { LIMITS } from "./ingest";

/** Reads the text of a PDF in the browser. The PDF library is loaded only when a PDF is chosen. It does not read scans (no OCR). */
export async function pdfPages(data: ArrayBuffer): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  if (pdf.numPages > LIMITS.maxPages) throw new Error(`This PDF has ${pdf.numPages} pages (limit ${LIMITS.maxPages}).`);
  const pages: string[] = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const content = await (await pdf.getPage(n)).getTextContent();
    let text = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      text += item.str + (item.hasEOL ? "\n" : " ");
    }
    pages.push(text.replace(/[ \t]+\n/g, "\n").replace(/ {2,}/g, " ").trim());
  }
  return pages;
}
