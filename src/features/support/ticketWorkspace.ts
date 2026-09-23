import type { LatLng } from "../../types/geo";
import { requesterHref } from "./tickets";
import type { TicketMessage } from "./ticketMessages";
import type { SupportTicket } from "./types";

export interface TicketWorkspace {
  ticket: SupportTicket;
  displayId: string;
  messages: TicketMessage[];
  customer: { company: string; contact: string; email: string; accountType: string; supportHref?: string };
  route: { statusLabel: string; origin: string; destination: string; pickup: LatLng; dropoff: LatLng; current: LatLng };
  driver: { name: string; role: string; phone: string; supportHref?: string };
  vehicle: { name: string; status: string; plate: string };
  order: { id: string; status: string; originalEta: string; revisedEta: string; cargo: string };
}

// Hand-authored to match the Ticket Detail Workspace screenshot exactly.
const delayedDelivery: Omit<TicketWorkspace, "ticket"> = {
  displayId: "#8841-B",
  messages: [
    { id: "m1", kind: "customer", author: "Sarah Connor (Customer)", time: "10:42 AM", body: "Hi support, checking on Order #8841. Tracking shows it was supposed to be delivered yesterday but it seems stuck at the regional hub. Can you provide an update? This is holding up our production line." },
    { id: "m2", kind: "agent", author: "Mike Engine (Support)", time: "11:05 AM", body: "Hello Sarah, I apologize for the delay. I'm looking into Order #8841 now. It appears there was a localized mechanical issue with the assigned vehicle (Volvo FH16) early this morning. Let me check the current status of the replacement vehicle and get back to you with a revised ETA within 15 minutes." },
    { id: "m3", kind: "internal", author: "Mike Engine", time: "11:08 AM", body: "Called Dispatch. Driver James D. reported an alternator failure. Load is being transferred to a backup unit (Unit #B-42). Expected delay is 4 hours total. Need to monitor SLA closely as this is a Tier 1 customer." },
  ],
  customer: { company: "Cyberdyne Systems", contact: "Sarah Connor", email: "s.connor@cyberdyne.com", accountType: "Enterprise Tier 1" },
  route: {
    statusLabel: "In Route (Delayed)",
    origin: "Distribution Center Alpha (Chicago)",
    destination: "Assembly Plant 4 (Detroit)",
    pickup: { lat: 41.8781, lng: -87.6298 },
    dropoff: { lat: 42.3314, lng: -83.0458 },
    current: { lat: 42.0987, lng: -85.6 },
  },
  driver: { name: "James D.", role: "Senior Operator", phone: "+1 (312) 555-0142" },
  vehicle: { name: "Volvo FH16", status: "Maintenance Issue", plate: "TRK-45C" },
  order: { id: "#8841", status: "Delayed", originalEta: "Oct 24, 14:00", revisedEta: "Oct 24, 18:00", cargo: "Industrial Robotics Components (Fragile)" },
};

function fallbackFor(ticket: SupportTicket): Omit<TicketWorkspace, "ticket"> {
  const isDriver = ticket.requester?.kind === "driver";
  const href = requesterHref(ticket);
  return {
    ...delayedDelivery,
    displayId: `#${ticket.id}`,
    messages: [
      {
        id: "m1",
        kind: "customer",
        author: `${ticket.customer} (${isDriver ? "Driver" : "Customer"})`,
        time: "9:30 AM",
        body: ticket.requester?.summary ?? `Hi team, we need help with: ${ticket.subject}. Please advise on next steps.`,
      },
    ],
    customer: isDriver
      ? { ...delayedDelivery.customer, supportHref: undefined }
      : { company: ticket.customer, contact: ticket.customer, email: "contact@example.com", accountType: "Standard", supportHref: href },
    // A driver-raised ticket's assigned driver IS the requester.
    driver: isDriver
      ? { name: ticket.customer, role: "Owner-Operator", phone: "+1 (555) 012-4493", supportHref: href }
      : delayedDelivery.driver,
  };
}

// TODO: replace with GET /support/tickets/:id (thread, linked customer,
// order, route and assets) once the Support module API exists. Only
// TKT-8841 is hand-authored; every other ticket (including ones just made
// via New Ticket) gets a thin fallback built from the ticket itself.
export function getTicketWorkspace(ticket: SupportTicket): TicketWorkspace {
  return { ticket, ...(ticket.id === "TKT-8841" ? delayedDelivery : fallbackFor(ticket)) };
}

export const replyTemplates = [
  { label: "Acknowledge & investigating", body: "Thanks for reaching out — I'm looking into this now and will update you within the hour." },
  { label: "Revised ETA", body: "Your shipment has a revised ETA of **{eta}**. We apologize for the delay and will keep you posted." },
  { label: "Resolved — closing", body: "This issue has been resolved. If anything else comes up, just reply to this ticket." },
];
