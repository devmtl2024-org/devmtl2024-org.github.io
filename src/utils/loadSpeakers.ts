import { Speaker } from "@/type/speakers";

export const loadSpeakers = async (limit: number): Promise<Speaker[]> => {
  const modules = import.meta.glob("/src/assets/speakers-2024/*.json");

  // Charger chaque fichier JSON et en extraire les données
  const loadedSpeakers = await Promise.all(
    Object.keys(modules).map(async (key) => {
      const module = await modules[key]();
      return module as Speaker;
    })
  );

  const sortedSpeakers = loadedSpeakers.slice(0, limit);

  return sortedSpeakers;
};
