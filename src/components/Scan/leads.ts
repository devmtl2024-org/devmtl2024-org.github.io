import { Contact } from "./vcard";

export type Lead = Contact & { id: string; scannedAt: string; note: string };

export function addLead(leads: Lead[], contact: Contact, scannedAt: string) {
  const id = identify(contact);
  if (leads.some((lead) => lead.id === id)) {
    return { outcome: "duplicate" as const, leads };
  }
  return {
    outcome: "added" as const,
    leads: [{ ...contact, id, scannedAt, note: "" }, ...leads],
  };
}

function identify(contact: Contact) {
  const key = contact.email ?? `${contact.fullName}|${contact.organization}`;
  return key.trim().toLowerCase();
}

export function removeLead(leads: Lead[], id: string) {
  return leads.filter((lead) => lead.id !== id);
}

export function updateNote(leads: Lead[], id: string, note: string) {
  return leads.map((lead) => (lead.id === id ? { ...lead, note } : lead));
}

const STORAGE_KEY = "devmtl-scan-leads";

export function loadLeads(): Lead[] {
  try {
    const leads: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(leads) ? leads : [];
  } catch {
    return [];
  }
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}
