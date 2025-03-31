import { GameProvider } from "./context/GameContext.jsx";
import Menu from "./components/Menu.jsx";
import Content from "./components/Content.jsx";
import { useState } from "react";

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);

    return (
        <GameProvider>
            {isGameStarted ? (
                <Content />
            ) : (
                <Menu onStartGame={() => setIsGameStarted(true)} />
            )}
        </GameProvider>
    );
}

export default App;
