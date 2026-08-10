type DataFolders = "organizers" | "sponsors" | "pauses";

const paths = {
  organizers: import.meta.glob("/src/assets/organizers/*.json"),
  sponsors: import.meta.glob("/src/assets/sponsors/*.json"),
  pauses: import.meta.glob("/src/assets/pauses.json"),
};

const speakerPaths = import.meta.glob("/src/assets/speakers-*/**/*.json");

export async function loadData<T>(folder: DataFolders): Promise<T[]> {
  const modules = Object.entries(paths)
    .filter(([key]) => key === folder)
    .flatMap(([, value]) => Object.entries(value))
    .map(([, loader]) => loader);

  return loadAll<T>(modules);
}

export async function loadSpeakers<T>(year: number): Promise<T[]> {
  const prefix = `/src/assets/speakers-${year}/`;
  const modules = Object.entries(speakerPaths)
    .filter(([path]) => path.startsWith(prefix))
    .map(([, loader]) => loader);

  return loadAll<T>(modules);
}

function loadAll<T>(modules: (() => Promise<unknown>)[]) {
  return Promise.all(
    modules.map(async (load) => {
      const mod = (await load()) as { default: T };
      return mod.default;
    }),
  );
}
