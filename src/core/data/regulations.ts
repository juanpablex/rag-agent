import type { Doc } from "../types";

export const REGULATIONS: Doc[] = [
  {
    id: "internal-regulations",
    title: "Internal Work Regulations",
    category: "Regulations",
    date: "2025-01-02",
    version: "v6.2",
    owner: "Human Resources",
    sections: [
      { id: "1", title: "Working hours", text: ["The standard week is 40 hours, Monday to Friday. Office staff work 08:30 to 17:30 with a one-hour unpaid break. Warehouse staff work in two shifts: 06:00 to 14:00 and 14:00 to 22:00."] },
      { id: "2", title: "Attendance and lateness", text: ["Employees record their arrival and departure in the time system. Three late arrivals of more than 10 minutes in one month trigger a written reminder. Unannounced absence of more than one day requires a medical or equivalent justification."] },
      { id: "3", title: "Overtime", text: ["Overtime must be approved in advance by the line manager. It is paid at 150% of the hourly rate on weekdays and 200% on weekends and public holidays. Employees may take time off in lieu instead, at the same rates, within 60 days."] },
      { id: "4", title: "Disciplinary process", text: ["Breaches are handled in four steps: verbal warning, written warning, final written warning, termination. Serious misconduct such as theft, violence or falsifying records may lead directly to termination after a documented hearing."] },
    ],
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    category: "Regulations",
    date: "2024-06-01",
    version: "v4.0",
    owner: "Compliance",
    sections: [
      { id: "1", title: "Respect and harassment", text: ["Harassment, discrimination and bullying are prohibited in every form, including online. Reports can be made to your manager, to Human Resources, or anonymously through the ethics line. Retaliation against someone who reports in good faith is itself a breach."] },
      { id: "2", title: "Gifts and hospitality", text: ["Employees may accept gifts up to 50 USD in value per giver per year. Anything above must be declined or declared to Compliance. Cash or cash equivalents are never allowed."] },
      { id: "3", title: "Conflicts of interest", text: ["Employees must declare any financial interest in, or family relationship with, a supplier, customer or competitor. Declarations are reviewed by Compliance within 10 working days."] },
      { id: "4", title: "Use of company assets", text: ["Company equipment, vehicles and inventory are for business use. Limited personal use of laptops and phones is allowed if it does not interfere with work or breach the security policy."] },
    ],
  },
  {
    id: "health-safety-rules",
    title: "Health and Safety Rules",
    category: "Regulations",
    date: "2025-02-15",
    version: "v5.1",
    owner: "Operations",
    sections: [
      { id: "1", title: "Personal protective equipment", text: ["Safety shoes and high-visibility vests are mandatory on the warehouse floor. Gloves are required when handling glass products. Hearing protection is required near the baler and the compressor room."] },
      { id: "2", title: "Forklifts and racking", text: ["Only employees with a current forklift licence may drive. Pedestrians must stay at least 2 metres away from moving forklifts. Racking above 3 metres may only be loaded by trained staff, and pallets must never be stacked beyond the marked load limit."] },
      { id: "3", title: "Incident reporting", text: ["Every injury, near miss or property damage must be reported to the shift supervisor immediately and recorded in the incident log within 24 hours. Serious injuries are reported to the authorities within 48 hours."] },
      { id: "4", title: "Evacuation", text: ["Assembly point A is the north car park. Fire drills are held twice a year. Fire wardens carry a yellow vest and check each zone before leaving."] },
    ],
  },
];
