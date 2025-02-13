const paths = {
    organizers: import.meta.glob("/src/assets/organizers/*.json"),
    speakers: import.meta.glob("/src/assets/speakers-2024/*.json"),
    sponsors: import.meta.glob("/src/assets/sponsors/*.json"),
};

export const loadData = async <T>(folder: keyof typeof paths, limit?: number): Promise<T[]> => {
    const modules = paths[folder]; // On sélectionne le bon chemin statique

    const loadedData = await Promise.all(
        Object.keys(modules).map(async (key) => {
            const module = await modules[key]();
            return module as T;
        })
    );

    return limit ? loadedData.slice(0, limit) : loadedData;
};
