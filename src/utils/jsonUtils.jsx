// This function reads a JSON file from the given file path and returns the parsed data.
async function readJsonFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) console.error('Network response was not ok:', response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error reading JSON file:', error);
        throw error;
    }
}

export {readJsonFile};