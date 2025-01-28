import { Organizer } from "@/type/organizers";

export const loadOrganizers = async () => {
    const modules = import.meta.glob("/src/assets/organizers/*.json");
  
    // Charger chaque fichier JSON et en extraire les données
    const loadedOrganizers = await Promise.all(
      Object.keys(modules).map(async (key) => {
        const module = await modules[key]();
        return module as Organizer;
      })
    );
  
    const sortedOrganizers = loadedOrganizers.slice(0);
  
    return sortedOrganizers;
  };