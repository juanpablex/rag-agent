import type { Doc } from "../types";

export const PRICE_LISTS: Doc[] = [
  {
    id: "price-list-wholesale-2025",
    title: "Wholesale Price List 2025",
    category: "Price lists",
    date: "2025-02-01",
    version: "2025-Q1",
    owner: "Sales",
    sections: [
      { id: "1", title: "Pendant lamps", text: ["P-100 Aurora pendant: 42.00 USD. P-120 Aurora large pendant: 58.00 USD. P-200 Fjord glass pendant: 76.50 USD. P-250 Fjord cluster of three: 189.00 USD."] },
      { id: "2", title: "Wall and floor lamps", text: ["W-300 Ridge wall light: 31.00 USD. W-340 Ridge outdoor wall light (IP65): 46.00 USD. F-400 Harbor floor lamp: 88.00 USD. F-450 Harbor reading floor lamp: 97.00 USD."] },
      { id: "3", title: "LED bulbs and components", text: ["B-10 LED bulb E27 9W warm white: 2.40 USD. B-12 LED bulb E27 12W daylight: 2.95 USD. D-50 LED driver 24W: 7.80 USD. S-20 smart controller: 18.50 USD."] },
      { id: "4", title: "Volume discounts", text: ["Orders of 100 to 499 units of the same item receive 5% off. 500 to 999 units receive 8%. 1,000 units or more receive 12%. Discounts do not combine with promotional prices."] },
    ],
  },
  {
    id: "price-list-retail-2025",
    title: "Retail Price List 2025",
    category: "Price lists",
    date: "2025-02-01",
    version: "2025-Q1",
    owner: "Sales",
    sections: [
      { id: "1", title: "Pendant lamps", text: ["P-100 Aurora pendant: 79.00 USD. P-120 Aurora large pendant: 109.00 USD. P-200 Fjord glass pendant: 145.00 USD. P-250 Fjord cluster of three: 359.00 USD."] },
      { id: "2", title: "Wall and floor lamps", text: ["W-300 Ridge wall light: 59.00 USD. W-340 Ridge outdoor wall light (IP65): 85.00 USD. F-400 Harbor floor lamp: 165.00 USD. F-450 Harbor reading floor lamp: 179.00 USD."] },
      { id: "3", title: "LED bulbs and components", text: ["B-10 LED bulb E27 9W warm white: 4.50 USD. B-12 LED bulb E27 12W daylight: 5.50 USD. D-50 LED driver 24W: 14.90 USD. S-20 smart controller: 34.00 USD."] },
      { id: "4", title: "Taxes and shipping", text: ["Prices exclude sales tax. Standard shipping is 9.90 USD per order; orders above 150 USD ship free."] },
    ],
  },
  {
    id: "price-list-distributors",
    title: "Distributor Terms and Price Tiers",
    category: "Price lists",
    date: "2025-02-01",
    version: "2025-Q1",
    owner: "Sales",
    sections: [
      { id: "1", title: "Tiers", text: ["Silver distributors (annual purchases under 150,000 USD) buy at wholesale prices. Gold distributors (150,000 to 400,000 USD) receive an additional 4% off. Platinum distributors (above 400,000 USD) receive an additional 7% off and a dedicated account manager."] },
      { id: "2", title: "Payment terms", text: ["Silver: payment at 30 days. Gold: 45 days. Platinum: 60 days. Overdue invoices accrue 1.25% interest per month and orders are paused after 15 days overdue."] },
      { id: "3", title: "Minimum order", text: ["The minimum order is 500 USD for Silver and 1,000 USD for Gold and Platinum."] },
    ],
  },
];

export const CATALOGS: Doc[] = [
  {
    id: "catalog-lighting-2025",
    title: "Lighting Product Catalog 2025",
    category: "Catalogs",
    date: "2025-02-01",
    version: "2025",
    owner: "Marketing",
    sections: [
      { id: "1", title: "Aurora pendant series", text: ["Spun aluminium shade in matte white, black or brass. Fits E27 bulbs up to 15W. Cable length 150 cm, adjustable at ceiling mount. Available as P-100 (30 cm diameter) and P-120 (45 cm diameter). Warranty 3 years."] },
      { id: "2", title: "Fjord glass series", text: ["Hand-blown opal glass, available in clear and smoke finishes. P-200 is a single pendant (24 cm); P-250 is a cluster of three on a common canopy. Each glass is unique, so small variations are normal. Warranty 3 years."] },
      { id: "3", title: "Ridge outdoor and indoor wall lights", text: ["W-300 is for indoor use. W-340 is rated IP65 for outdoor use and suitable for covered porches and facades. Both use E27 bulbs up to 12W. Powder-coated steel in graphite."] },
      { id: "4", title: "Smart controls", text: ["The S-20 smart controller works with the Harborline app and standard voice assistants, supports dimming and schedules, and controls up to 10 compatible bulbs. It requires a 2.4 GHz Wi-Fi network. Warranty 2 years."] },
    ],
  },
  {
    id: "catalog-services-2025",
    title: "Services Catalog",
    category: "Catalogs",
    date: "2025-01-15",
    version: "2025",
    owner: "Marketing",
    sections: [
      { id: "1", title: "Lighting design consultation", text: ["Remote or on-site design of lighting plans for retail and hospitality projects. Remote: 120 USD per hour. On-site: 190 USD per hour plus travel. Minimum 2 hours."] },
      { id: "2", title: "Installation", text: ["Certified installers fit Harborline products within 30 km of Eastgate. Standard installation is 65 USD per fixture; ceiling heights above 4 metres add 25 USD per fixture."] },
      { id: "3", title: "Maintenance plans", text: ["Annual maintenance covers inspection, bulb replacement and cleaning for 12 USD per fixture per year, with a 48-hour response time for failures."] },
    ],
  },
  {
    id: "catalog-spare-parts",
    title: "Spare Parts Catalog",
    category: "Catalogs",
    date: "2025-01-15",
    version: "2025",
    owner: "After-sales",
    sections: [
      { id: "1", title: "Shades and glass", text: ["Replacement Aurora shades: 14.00 USD (30 cm) and 21.00 USD (45 cm). Replacement Fjord glass: 28.00 USD. Glass replacement ships in protective packaging in 3 to 5 business days."] },
      { id: "2", title: "Electrical parts", text: ["Ceiling canopy kit: 9.50 USD. Cable set 150 cm: 6.00 USD. E27 lamp holder: 3.20 USD. D-50 driver: 7.80 USD wholesale or 14.90 USD retail."] },
    ],
  },
];

export const REPORTS: Doc[] = [
  {
    id: "sales-report-q2-2025",
    title: "Quarterly Sales Report: Q2 2025",
    category: "Reports",
    date: "2025-07-10",
    version: "final",
    owner: "Finance",
    sections: [
      { id: "1", title: "Summary", text: ["Net sales in Q2 2025 were 4.82 million USD, up 11% on Q2 2024 and 3% above budget. Gross margin was 38.4%, down 0.6 points because of higher freight costs."] },
      { id: "2", title: "By channel", text: ["Distributors contributed 2.61 million USD (54%), direct retail 1.28 million (27%), online 0.69 million (14%) and project sales 0.24 million (5%). Online grew fastest, up 29% year on year."] },
      { id: "3", title: "Best sellers", text: ["The top three products by units were B-10 LED bulb (41,200 units), P-100 Aurora pendant (6,850 units) and W-300 Ridge wall light (5,120 units). By revenue, the top product was the P-200 Fjord glass pendant with 412,000 USD."] },
      { id: "4", title: "Outlook", text: ["Q3 sales are forecast at 5.1 million USD. Main risks are a 4% price increase announced by Lumina Electric and container delays on the Asia route."] },
    ],
  },
  {
    id: "operations-report-h1-2025",
    title: "Operations Report: First Half 2025",
    category: "Reports",
    date: "2025-07-20",
    version: "final",
    owner: "Operations",
    sections: [
      { id: "1", title: "Fulfilment performance", text: ["On-time shipping reached 97.8% (target 98%). Order accuracy was 99.4%, just below the 99.5% service level agreed with Meridian Logistics, which triggered a service credit of 1.6% on the March invoice."] },
      { id: "2", title: "Inventory", text: ["Inventory value at 30 June was 3.1 million USD, equal to 71 days of sales. Slow-moving stock (no sales for 180 days) was 4.2% of value, mostly discontinued Fjord smoke glass."] },
      { id: "3", title: "Safety", text: ["There were 3 recordable incidents in H1 (2 minor cuts and 1 forklift near miss with no injury). No lost-time injuries."] },
    ],
  },
  {
    id: "hr-headcount-report-2025",
    title: "People Report: Headcount and Turnover, mid-2025",
    category: "Reports",
    date: "2025-07-05",
    version: "final",
    owner: "Human Resources",
    sections: [
      { id: "1", title: "Headcount", text: ["Total headcount at 30 June 2025 was 164: Operations 91, Commercial 38, Corporate 35. The company hired 17 people and 11 left during the half."] },
      { id: "2", title: "Turnover", text: ["Annualised turnover was 13.4%. Warehouse associates had the highest turnover at 22%, while corporate roles were at 6%."] },
      { id: "3", title: "Engagement", text: ["The June engagement survey had 81% participation and an engagement score of 74 out of 100, up 3 points. The lowest-scoring topic was career development."] },
    ],
  },
  {
    id: "incident-report-2025-05",
    title: "Incident Report: Forklift near miss, 14 May 2025",
    category: "Reports",
    date: "2025-05-20",
    version: "closed",
    owner: "Operations",
    sections: [
      { id: "1", title: "What happened", text: ["At 15:10 on 14 May, a forklift reversing in aisle C came within 1.5 metres of a pedestrian. Nobody was injured."] },
      { id: "2", title: "Causes", text: ["The reversing alarm was working, but the pedestrian was wearing headphones and the aisle crossing was not marked."] },
      { id: "3", title: "Actions", text: ["Floor markings were repainted in all aisles by 30 May. Headphones are now banned on the warehouse floor. All forklift drivers repeated the pedestrian awareness module by 15 June."] },
    ],
  },
];
