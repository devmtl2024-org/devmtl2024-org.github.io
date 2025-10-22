type DataFolders = "organizers" | "sponsors" | "speakers2024" | "speakers2025";

const paths = {
  organizers: import.meta.glob("/src/assets/organizers/*.json"),
  sponsors: import.meta.glob("/src/assets/sponsors/*.json"),
  speakers2024: import.meta.glob("/src/assets/speakers-2024/**/*.json"),
  speakers2025: import.meta.glob("/src/assets/speakers-2025/**/*.json"),
};

export async function loadData<T>(
  folder: DataFolders,
  limit?: number,
  random?: boolean,
): Promise<T[]> {
  const modules = Object.entries(paths)
    .filter(([key]) => key === folder)
    .flatMap(([, value]) => Object.entries(value))
    .map(([, loader]) => loader);

  const loadedData = await Promise.all(
    modules.map(async (load) => {
      const mod = await (load as () => Promise<{ default: T }>)();
      return mod.default;
    }),
  );

  const data = random ? loadedData.sort(() => Math.random() - 0.5) : loadedData;

  return limit ? data.slice(0, limit) : data;
}
