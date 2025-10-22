export type DataFolders = "organizers" | "sponsors" | `speakers${number}`;

const paths = {
  organizers: import.meta.glob("/src/assets/organizers/*.json"),
  sponsors: import.meta.glob("/src/assets/sponsors/*.json"),
  ...import.meta.glob("/src/assets/speakers*/**/*.json"),
};

export const loadData = async <T>(
  folder: string,
  limit?: number,
  random?: boolean,
): Promise<T[]> => {
  const allPaths = Object.entries(paths)
    .filter(
      ([path, loader]) => typeof loader === "function" && path.includes(folder),
    )
    .map(([, loader]) => loader as unknown as () => Promise<{ default: T }>);

  const loadedData = await Promise.all(
    allPaths.map(async (load) => (await load()).default),
  );

  if (random) {
    for (let i = loadedData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [loadedData[i], loadedData[j]] = [loadedData[j], loadedData[i]];
    }
  }

  return limit ? loadedData.slice(0, limit) : loadedData;
};
