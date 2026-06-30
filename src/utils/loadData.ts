type DataFolders = "organizers" | "sponsors" | "pauses";

const paths = {
  organizers: import.meta.glob("/src/assets/organizers/*.json"),
  sponsors: import.meta.glob("/src/assets/sponsors/*.json"),
  pauses: import.meta.glob("/src/assets/pauses.json"),
};

const speakerPaths = import.meta.glob("/src/assets/speakers-*/**/*.json");

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

export async function loadSpeakers<T>(
  year: number,
  limit?: number,
  random?: boolean,
): Promise<T[]> {
  const prefix = `/src/assets/speakers-${year}/`;
  const modules = Object.entries(speakerPaths)
    .filter(([path]) => path.startsWith(prefix))
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
