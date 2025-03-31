import { createContext, useContext, useState } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
    const [gameSettings, setGameSettings] = useState({
        difficulty: "Easy",
        selectedMaps: []
    });

    return (
        <GameContext.Provider value={{ gameSettings, setGameSettings }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameSettings() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameSettings doit être utilisé à l'intérieur de GameProvider");
    }
    return context;
}
