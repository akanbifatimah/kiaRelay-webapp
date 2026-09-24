export interface Option {
  value: string;
  label: string;
}

const same = (values: string[]): Option[] => values.map((value) => ({ value, label: value }));

export const COUNTRY_OPTIONS = same(["United States", "Canada"]);

export const REGIONS_BY_COUNTRY: Record<string, Option[]> = {
  "United States": same([
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ]),
  Canada: same([
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario",
    "Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon",
  ]),
};

export const PAYMENT_TERMS: Option[] = [
  { value: "due-on-receipt", label: "Due on Receipt" },
  { value: "net-15", label: "Net 15" },
  { value: "net-30", label: "Net 30 (Standard Enterprise)" },
  { value: "net-45", label: "Net 45" },
  { value: "net-60", label: "Net 60 (Extended)" },
];

export const DUE_DATE_CALCULATIONS: Option[] = [
  { value: "after-issue-30", label: "30 days after invoice issuance date" },
  { value: "after-delivery-30", label: "30 days after proof of delivery" },
  { value: "end-of-month", label: "End of the month following issuance" },
  { value: "match-terms", label: "Match the account's payment terms" },
];

export const PAYOUT_SCHEDULES: Option[] = [
  { value: "daily", label: "Daily (Every day at 00:00 CST)" },
  { value: "weekly-tue", label: "Weekly (Every Tuesday at 00:00 CST)" },
  { value: "biweekly-tue", label: "Bi-weekly (Every other Tuesday)" },
  { value: "monthly-1st", label: "Monthly (1st of the month)" },
];

export const DELIVERY_STATUSES: Option[] = [
  { value: "pending", label: "Pending / Awaiting Review" },
  { value: "confirmed", label: "Confirmed / Awaiting Assignment" },
  { value: "scheduled", label: "Scheduled / Future Dispatch" },
];

export const GRACE_PERIODS: Option[] = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes (Industry Standard)" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "120", label: "2 hours (Extended)" },
];

export const TIME_ZONES: Option[] = [
  { value: "America/Chicago", label: "Central Time (Houston, Dallas)" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Denver", label: "Mountain Time (El Paso)" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "recipient", label: "Recipient's local time zone" },
];
