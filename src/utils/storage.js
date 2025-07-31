// A key to identify our app's data in local storage
const APP_STORAGE_KEY = 'leetcodeSpeedrunTrackerData';

/**
 * Retrieves all data from local storage.
 * @returns {object} The parsed data object or a default structure if not found.
 */
export const getStoredData = () => {
    if (typeof window === 'undefined') {
        return { playlists: {}, questions: {} };
    }
    try {
        const rawData = localStorage.getItem(APP_STORAGE_KEY);
        if (!rawData) {
            // If no data exists, return a default empty structure
            return { playlists: {}, questions: {} };
        }
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Failed to parse data from local storage", error);
        // Return default structure on error
        return { playlists: {}, questions: {} };
    }
};

/**
 * Saves the entire data object to local storage.
 * @param {object} data - The complete state of the application to save.
 */
export const saveStoredData = (data) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const dataString = JSON.stringify(data);
        localStorage.setItem(APP_STORAGE_KEY, dataString);
    } catch (error) {
        console.error("Failed to save data to local storage", error);
    }
};