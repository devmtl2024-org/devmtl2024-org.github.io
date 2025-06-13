import { Sponsor } from "@/type/sponsors";
import { useEffect, useState } from "react";
import { loadData } from "../utils/loadData";

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    loadData<Sponsor>("sponsors").then((sponsors) => {
      setSponsors(sponsors.filter((s) => s.isEnabled));
    });
  }, []);

  return {
    allSponsors: sponsors,
    orSponsors: sponsors.filter((s) => s.level === "or"),
    argentSponsors: sponsors.filter((s) => s.level === "argent"),
    bronzeSponsors: sponsors.filter((s) => s.level === "bronze"),
    supporterSponsors: sponsors.filter((s) => s.level === "supporter"),
  };
}
