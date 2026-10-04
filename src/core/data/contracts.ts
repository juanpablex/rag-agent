import type { Doc } from "../types";

export const CONTRACTS: Doc[] = [
  {
    id: "msa-meridian-logistics",
    title: "Master Services Agreement: Meridian Logistics",
    category: "Contracts",
    date: "2025-03-01",
    version: "v2.1",
    owner: "Legal",
    sections: [
      { id: "1", title: "Scope of services", text: ["Meridian Logistics ('Carrier') provides warehousing, pick-and-pack and regional freight services to Harborline Supply Co. ('Harborline') from its Eastgate facility.", "Services outside this scope require a written change order signed by both parties."] },
      { id: "2", title: "Service levels", text: ["Orders received before 14:00 on a business day must ship the same day. Orders received later ship the next business day.", "The Carrier must keep order accuracy at or above 99.5% per month. Below that level Harborline receives a credit of 2% of that month's fees for each full 0.1 point of shortfall."] },
      { id: "3", title: "Fees and payment", text: ["Storage is billed at 11.50 USD per pallet position per month. Pick-and-pack is billed at 0.85 USD per line item.", "Invoices are payable within 45 days of receipt. Late payments accrue interest at 1.5% per month."] },
      { id: "4", title: "Term and termination", text: ["The agreement runs for 36 months from 1 March 2025 and renews for successive 12-month periods unless either party gives 90 days' written notice.", "Either party may terminate for material breach if the breach is not cured within 30 days of written notice."] },
      { id: "5", title: "Liability", text: ["The Carrier's liability for lost or damaged goods is limited to the replacement cost of the goods, up to 50,000 USD per incident.", "Neither party is liable for indirect or consequential losses."] },
    ],
  },
  {
    id: "supplier-lumina-electric",
    title: "Supply Contract: Lumina Electric Components",
    category: "Contracts",
    date: "2024-09-15",
    version: "v1.4",
    owner: "Procurement",
    sections: [
      { id: "1", title: "Supply commitment", text: ["Lumina Electric supplies LED drivers, sockets and cable assemblies listed in Annex A. Harborline commits to a minimum annual purchase of 400,000 USD."] },
      { id: "2", title: "Pricing", text: ["Prices are fixed for the first 12 months. After that, Lumina may adjust prices once per year by at most 4%, with 60 days' notice.", "Volume rebate: 3% of annual spend above 500,000 USD, credited in January."] },
      { id: "3", title: "Delivery and quality", text: ["Standard lead time is 21 days. Deliveries more than 5 days late entitle Harborline to a 1% discount per additional week of delay, up to 8%.", "Defect rate above 0.8% in any delivered lot allows Harborline to reject the whole lot at Lumina's cost."] },
      { id: "4", title: "Payment terms", text: ["Payment is due 45 days after delivery. Early payment within 10 days earns a 1.5% discount."] },
      { id: "5", title: "Confidentiality", text: ["Technical drawings and price schedules are confidential for 5 years after the contract ends."] },
    ],
  },
  {
    id: "nda-template",
    title: "Mutual Non-Disclosure Agreement (standard template)",
    category: "Contracts",
    date: "2024-01-10",
    version: "v3.0",
    owner: "Legal",
    sections: [
      { id: "1", title: "Definition of confidential information", text: ["Confidential information is any non-public business, technical or financial information disclosed in writing, orally or by inspection, and marked or reasonably understood to be confidential."] },
      { id: "2", title: "Obligations", text: ["The receiving party must protect the information with at least the care it uses for its own, use it only for the agreed purpose, and share it only with employees and advisers who need to know it and are bound by equivalent duties."] },
      { id: "3", title: "Duration", text: ["Obligations last 3 years from the date of disclosure. Trade secrets stay protected for as long as they remain trade secrets."] },
      { id: "4", title: "Return of materials", text: ["On written request, the receiving party returns or destroys all confidential materials within 15 days and confirms it in writing."] },
    ],
  },
  {
    id: "lease-eastgate-warehouse",
    title: "Commercial Lease: Eastgate Warehouse",
    category: "Contracts",
    date: "2023-07-01",
    version: "v1.0",
    owner: "Facilities",
    sections: [
      { id: "1", title: "Premises and term", text: ["Harborline leases 6,200 square metres of warehouse and 450 square metres of office space at 18 Eastgate Road for 7 years, from 1 July 2023 to 30 June 2030."] },
      { id: "2", title: "Rent", text: ["Base rent is 8.40 USD per square metre per month, increasing 3% each July. The deposit is equal to three months' rent."] },
      { id: "3", title: "Maintenance", text: ["The landlord maintains the roof, structure and external areas. Harborline maintains interior fittings, racking and loading dock equipment."] },
      { id: "4", title: "Early termination", text: ["Harborline may end the lease after year 5 with 9 months' notice and a payment equal to 4 months' rent."] },
    ],
  },
];
