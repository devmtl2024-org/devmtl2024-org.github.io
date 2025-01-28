import { Sponsor } from "@/type/sponsors";

export const loadSponsors = async () => {
    const modules = import.meta.glob("/src/assets/sponsors/*.json");
  
    // Charger chaque fichier JSON et en extraire les données
    const loadedSponsors = await Promise.all(
      Object.keys(modules).map(async (key) => {
        const module = await modules[key]();
        return module as Sponsor;
      })
    );
  
    const sortedSponsors = loadedSponsors.slice(0);
  
    return sortedSponsors;
  };