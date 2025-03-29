export const fetchMapData = async (mapUuid) => {
    try {
        const response = await fetch(`https://valorant-api.com/v1/maps/${mapUuid}`);
        const data = await response.json();
        console.log("Map data:", data.data);
        return data.data;
    } catch (error) {
        console.error('Error fetching map data:', error);
        throw error;
    }
};

export const fetchAllMaps = async () => {
    try {
        const response = await fetch("https://valorant-api.com/v1/maps/");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching maps:', error);
        throw error;
    }
};

export const findMapUuidByName = async (mapName) => {
    try {
        const maps = await fetchAllMaps();
        const map = maps.find(map => map.displayName.toLowerCase() === mapName);
        return map ? map.uuid : null;
    } catch (error) {
        console.error('Error finding map UUID:', error);
        throw error;
    }
};