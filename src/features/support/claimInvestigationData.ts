import type { ClaimInvestigation } from "./claimInvestigation";

// Hand-authored to match the Ticket details (claim investigation) and
// Evidence Viewer screenshots. Photos are the user-supplied samples in
// public/ (originalvehicleimg.svg = pickup, damagedcarimg.svg = delivery).
export const acmeSedanClaim: ClaimInvestigation = {
  id: "CLM-882910-X",
  ticketId: "TKT-8810",
  status: "in-review",
  category: "transit-damage",
  type: "Damage Report",
  amount: 1850,
  createdDaysAgo: 2,
  incidentDate: "2023-10-24",
  attachments: [],
  submitted: "Oct 24, 2023",
  serviceTag: "EXPRESS",
  dispatcher: "Sarah J.",
  incidentDescription:
    "Driver reported significant scratch on front right fender upon delivery to client location. Previous inspection photos from the origin point do not show this mark.",
  customerStatement:
    "The vehicle arrived with a 6-inch scratch that wasn't noted on the initial dispatch agreement. I am requesting a professional body shop assessment.",
  internalNotes: "Cross-checking GPS data with hall-booth timestamps to verify route deviation.",
  reviewer: "James Brennan",
  resolutionState: "Pending Review",
  policyLimit: 2500,
  order: {
    ref: "#22910",
    status: "Delivered",
    title: "Vehicle Transport - Sedan",
    route: "Houston, TX → Chicago, IL",
    dates: "Oct 22 - Oct 24, 2023",
  },
  customer: { name: "Premier Auto Logistics", accountId: "ID: 0122-7781" },
  driver: { name: "Marcus Webb", meta: "DPS-10142 • 4.8 ★" },
  photos: [
    {
      kind: "pickup",
      src: "/originalvehicleimg.svg",
      timestamp: "Oct 22, 08:14 AM",
      caption: "Verified by origin agent S. Miller. No external defects noted during AAA-level inspection.",
      lat: 29.7604,
      lng: -95.3698,
    },
    {
      kind: "delivery",
      src: "/damagedcarimg.svg",
      timestamp: "Oct 24, 04:15 PM",
      caption: "Uploaded by Driver Marcus Webb. Incident flagged during on-site receiver inspection.",
      lat: 41.8781,
      lng: -87.6298,
    },
  ],
  gps: [
    { label: "Pickup — Houston Terminal", time: "Oct 22, 08:14 AM", lat: 29.7604, lng: -95.3698, note: "Geofence match (12 m)" },
    { label: "Checkpoint — Dallas, TX", time: "Oct 22, 01:02 PM", lat: 32.7767, lng: -96.797, note: "On planned route" },
    { label: "Rest Stop — Tulsa, OK", time: "Oct 23, 12:40 AM", lat: 36.154, lng: -95.9928, note: "7h 20m stationary (HOS rest)" },
    { label: "Checkpoint — St. Louis, MO", time: "Oct 23, 04:18 PM", lat: 38.627, lng: -90.1994, note: "On planned route" },
    { label: "Delivery — Chicago Receiver", time: "Oct 24, 04:15 PM", lat: 41.8781, lng: -87.6298, note: "Geofence match (8 m)" },
  ],
  signatures: [
    { signer: "S. Miller", role: "Origin Agent", time: "Oct 22, 08:20 AM", method: "In-app e-signature", status: "verified", note: "Clean bill of lading — no exceptions." },
    { signer: "Marcus Webb", role: "Driver", time: "Oct 22, 08:22 AM", method: "In-app e-signature", status: "verified", note: "Accepted load at pickup." },
    { signer: "R. Alvarez", role: "Receiver", time: "Oct 24, 04:21 PM", method: "Stylus on driver device", status: "flagged", note: "Signed with exception: “scratch, front right fender”." },
  ],
  timeline: [
    { id: "t1", title: "Claim Created", time: "Oct 24, 09:12", description: "System generated from driver app submission.", status: "done" },
    { id: "t2", title: "Evidence Reviewed", time: "Oct 25, 11:30", description: "Reviewer James B. reviewed photos and GPS logs.", status: "active" },
    { id: "t3", title: "Resolution Pending", time: "", description: "Awaiting insurance adjuster report.", status: "pending" },
  ],
  similarIncidents: [
    { claimId: "CLM-990-W", driver: "Marcus Webb", location: "Chicago Terminal", date: "Aug 12, 2023", status: "closed", settlement: 1200 },
    { claimId: "CLM-441-A", driver: "Marcus Webb", location: "Houston Hub", date: "Jun 04, 2023", status: "closed", settlement: 450 },
  ],
  evidenceValidated: false,
};
