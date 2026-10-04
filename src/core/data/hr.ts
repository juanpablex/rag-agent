import type { Doc } from "../types";

export const SALARIES: Doc[] = [
  {
    id: "salary-bands-2025",
    title: "Salary Bands 2025",
    category: "Salaries",
    date: "2025-01-01",
    version: "2025.1",
    owner: "Human Resources",
    sections: [
      { id: "1", title: "How the bands work", text: ["Each role belongs to a band with a minimum, a midpoint and a maximum annual gross salary in USD. New hires start between the minimum and the midpoint. Moving above the midpoint requires a documented performance rating of 'exceeds' for two consecutive reviews."] },
      { id: "2", title: "Operations roles", text: ["Warehouse Associate: 28,000 to 34,000 (midpoint 31,000). Forklift Operator: 31,000 to 38,000 (midpoint 34,500). Shift Supervisor: 40,000 to 52,000 (midpoint 46,000). Logistics Coordinator: 38,000 to 49,000 (midpoint 43,500)."] },
      { id: "3", title: "Commercial roles", text: ["Sales Representative: 38,000 to 52,000 (midpoint 45,000) plus commission. Key Account Manager: 55,000 to 72,000 (midpoint 63,500) plus commission. Customer Support Agent: 30,000 to 38,000 (midpoint 34,000)."] },
      { id: "4", title: "Corporate roles", text: ["Accountant: 42,000 to 56,000 (midpoint 49,000). HR Generalist: 40,000 to 54,000 (midpoint 47,000). Software Developer: 58,000 to 85,000 (midpoint 71,500). Finance Manager: 75,000 to 98,000 (midpoint 86,500)."] },
    ],
  },
  {
    id: "bonus-commission-plan",
    title: "Bonus and Commission Plan",
    category: "Salaries",
    date: "2025-01-01",
    version: "2025.1",
    owner: "Human Resources",
    sections: [
      { id: "1", title: "Annual bonus", text: ["All employees with at least 6 months of service take part in the annual bonus. The target is 5% of annual salary for operations and corporate roles and 8% for managers. The payout ranges from 0% to 150% of target depending on company results and individual rating."] },
      { id: "2", title: "Sales commission", text: ["Sales Representatives earn 3% of net sales they close, paid monthly. Key Account Managers earn 2% of net sales from their accounts. Commission is paid only on invoices collected within 90 days."] },
      { id: "3", title: "Payment dates", text: ["Salaries are paid on the last working day of each month. The annual bonus is paid with the March salary. Commission is paid with the salary of the month after collection."] },
    ],
  },
  {
    id: "benefits-guide",
    title: "Employee Benefits Guide",
    category: "Salaries",
    date: "2025-01-01",
    version: "2025.1",
    owner: "Human Resources",
    sections: [
      { id: "1", title: "Health insurance", text: ["The company pays 80% of the premium for employees and 50% for dependants. Coverage starts on the first day of the month after joining."] },
      { id: "2", title: "Retirement plan", text: ["The company matches contributions dollar for dollar up to 4% of salary after 12 months of service."] },
      { id: "3", title: "Learning budget", text: ["Each employee has 1,200 USD per year for courses, books and conferences, with manager approval. Unused budget does not carry over."] },
      { id: "4", title: "Meal allowance", text: ["Warehouse and office employees receive a meal card with 6.50 USD per worked day."] },
    ],
  },
];

export const POLICIES: Doc[] = [
  {
    id: "remote-work-policy",
    title: "Remote Work Policy",
    category: "Policies",
    date: "2025-04-01",
    version: "v2.0",
    owner: "Human Resources",
    sections: [
      { id: "1", title: "Who is eligible", text: ["Office-based employees who have completed their 3-month probation may work remotely. Warehouse and customer-facing roles that need on-site presence are not eligible."] },
      { id: "2", title: "How many days", text: ["Eligible employees may work remotely up to 3 days per week. Tuesdays and Wednesdays are anchor days when everyone works from the office."] },
      { id: "3", title: "Equipment and costs", text: ["The company provides a laptop and one monitor. A one-time home-office allowance of 300 USD is available, and an internet allowance of 25 USD per month."] },
      { id: "4", title: "Security", text: ["Remote work requires the company VPN, disk encryption and multi-factor authentication. Work on public Wi-Fi without the VPN is not allowed."] },
    ],
  },
  {
    id: "expense-policy",
    title: "Travel and Expense Policy",
    category: "Policies",
    date: "2024-11-01",
    version: "v3.3",
    owner: "Finance",
    sections: [
      { id: "1", title: "Approval", text: ["Trips need prior manager approval. Expenses above 500 USD per item need Finance Manager approval before purchase."] },
      { id: "2", title: "Meals and lodging", text: ["The daily meal limit is 45 USD while travelling. Hotel nightly limits are 140 USD in standard cities and 190 USD in high-cost cities (New York, San Francisco, London). Alcohol is not reimbursed."] },
      { id: "3", title: "Transport", text: ["Economy class is required for flights under 6 hours. Business class may be approved for flights over 6 hours. Personal vehicle mileage is reimbursed at 0.62 USD per mile."] },
      { id: "4", title: "Claims deadline", text: ["Expense reports with receipts must be submitted within 30 days of the expense. Claims after 60 days are not reimbursed. Reimbursement is paid in the next payroll run."] },
    ],
  },
  {
    id: "leave-policy",
    title: "Leave and Time-Off Policy",
    category: "Policies",
    date: "2025-01-01",
    version: "v4.1",
    owner: "Human Resources",
    sections: [
      { id: "1", title: "Annual leave", text: ["Full-time employees receive 22 paid vacation days per year, rising to 25 after 5 years of service. Up to 5 unused days may carry over to the next year and must be used by 31 March."] },
      { id: "2", title: "Sick leave", text: ["Employees receive 10 paid sick days per year. A medical certificate is required from the third consecutive day."] },
      { id: "3", title: "Parental leave", text: ["Birth parents receive 16 weeks of paid leave. Non-birth parents and adoptive parents receive 6 weeks. Leave may be taken within the first 12 months."] },
      { id: "4", title: "Other leave", text: ["Bereavement leave is 5 days for immediate family and 2 days for other relatives. Employees receive 1 paid day for their own wedding and 1 paid volunteering day per year."] },
    ],
  },
  {
    id: "data-privacy-policy",
    title: "Data Privacy and Security Policy",
    category: "Policies",
    date: "2025-02-01",
    version: "v2.4",
    owner: "IT Security",
    sections: [
      { id: "1", title: "Classification", text: ["Information is classified as Public, Internal, Confidential or Restricted. Customer personal data and payroll data are Restricted and may only be stored in approved systems."] },
      { id: "2", title: "Passwords and access", text: ["Passwords must have at least 14 characters and are never shared. Multi-factor authentication is required for email, the ERP and the VPN. Access rights are reviewed every 6 months."] },
      { id: "3", title: "Data breaches", text: ["Suspected breaches must be reported to IT Security within 2 hours. The company notifies the regulator within 72 hours when personal data is affected."] },
      { id: "4", title: "Retention", text: ["Customer records are kept for 7 years after the last transaction. Job applications are deleted after 12 months. Security logs are kept for 13 months."] },
    ],
  },
  {
    id: "returns-warranty-policy",
    title: "Returns and Warranty Policy",
    category: "Policies",
    date: "2025-03-01",
    version: "v3.0",
    owner: "Customer Service",
    sections: [
      { id: "1", title: "Returns window", text: ["Unused products in original packaging may be returned within 30 days of delivery for a refund. A 15% restocking fee applies to opened packaging and to orders returned without prior authorisation."] },
      { id: "2", title: "Defective goods", text: ["Defective products are replaced or refunded in full, with no restocking fee, if reported within 12 months of delivery. Return shipping for defective goods is paid by Harborline."] },
      { id: "3", title: "Warranty", text: ["Lamps and fixtures carry a 3-year warranty. LED drivers and smart controllers carry a 2-year warranty. Warranty does not cover damage from misuse, water exposure or unauthorised repair."] },
      { id: "4", title: "Refund timing", text: ["Approved refunds are paid to the original payment method within 10 business days of receiving the goods."] },
    ],
  },
];
