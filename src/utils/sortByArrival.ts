import { Sponsor } from "@/type/sponsors";

// JSON isn't type-checked: a sponsor missing its date is most likely the newest
const NOT_DATED_YET = "9999-12-31";

export function sortByArrival(sponsors: Sponsor[]) {
  return [...sponsors].sort((a, b) => arrival(a).localeCompare(arrival(b)));
}

function arrival(sponsor: Sponsor) {
  return sponsor.joinedAt || NOT_DATED_YET;
}
