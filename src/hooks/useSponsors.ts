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

  return sponsors;
}
