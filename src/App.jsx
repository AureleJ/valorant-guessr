import { GameProvider } from "./context/GameContext.jsx";
import Menu from "./components/Menu.jsx";
import Game from "./components/Game.jsx";
import { useState } from "react";
import {useGameStore} from './stores/gameStore';
import { useEffect } from "react";

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);

    const { gameState } = useGameStore();
    useEffect(() => {
        if (gameState.round > 5) {
            setIsGameStarted(false);
        }
    }, [gameState.round]);

    return (
        <GameProvider>
            {isGameStarted ? (
                <Game />
            ) : (
                <Menu onStartGame={() => setIsGameStarted(true)} />
            )}
        </GameProvider>
    );
}

export default App;
