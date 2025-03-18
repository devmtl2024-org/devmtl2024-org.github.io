const paths = {
    organizers: import.meta.glob("/src/assets/organizers/*.json"),
    speakers: import.meta.glob("/src/assets/speakers-2024/*.json"),
    sponsors: import.meta.glob("/src/assets/sponsors/*.json"),
};

export const loadData = async <T>(folder: keyof typeof paths, limit?: number, random?: boolean): Promise<T[]> => {
    const modules = paths[folder];

    const loadedData = await Promise.all(
        Object.keys(modules).map(async (key) => {
            const module = await modules[key]();
            return module as T;
        })
    );

    if (random) {
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = loadedData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [loadedData[i], loadedData[j]] = [loadedData[j], loadedData[i]];
        }
    }

    return limit ? loadedData.slice(0, limit) : loadedData;
};
