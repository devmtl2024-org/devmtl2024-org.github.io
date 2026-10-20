import { Lead } from "./leads";

const CSV_COLUMNS: [string, (lead: Lead) => string | undefined][] = [
  ["First name", (lead) => lead.firstName],
  ["Last name", (lead) => lead.lastName],
  ["Organization", (lead) => lead.organization],
  ["Title", (lead) => lead.title],
  ["Email", (lead) => lead.email],
  ["Phone", (lead) => lead.phone],
  ["LinkedIn", (lead) => lead.url],
  ["Note", (lead) => lead.note],
  ["Scanned at", (lead) => lead.scannedAt],
];

export function toCsv(leads: Lead[]) {
  const header = CSV_COLUMNS.map(([name]) => name).join(",");
  const rows = leads.map((lead) =>
    CSV_COLUMNS.map(([, value]) => csvCell(value(lead) ?? "")).join(","),
  );
  return "﻿" + [header, ...rows].join("\r\n");
}

function csvCell(value: string) {
  // Spreadsheets run cells starting like a formula
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

// Mail apps truncate or refuse longer mailto links
const MAX_MAILTO_LENGTH = 2000;

export function mailtoLink(leads: Lead[], subject: string) {
  const body = leads.map(emailBlock).join("\n\n");
  const link = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return link.length > MAX_MAILTO_LENGTH ? null : link;
}

function emailBlock(lead: Lead) {
  const role = [lead.title, lead.organization].filter(Boolean).join(" · ");
  return [
    lead.fullName,
    role,
    lead.email,
    lead.phone,
    lead.url,
    lead.note && `Note: ${lead.note}`,
  ]
    .filter(Boolean)
    .join("\n");
}
