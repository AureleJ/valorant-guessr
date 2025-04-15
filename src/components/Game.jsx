import React, {useEffect, useState} from 'react';
import {useGameStore} from '../stores/gameStore';
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import sources from "../utils/sources";
import {readJsonFile} from "../utils/jsonUtils.jsx";
import InteractiveMap from "./InteractiveMap.jsx";
import Button from "./Button.jsx";
import {useNavigate} from "react-router-dom";

export default function Game() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [endGame, setEndGame] = useState(false);
    const navigate = useNavigate();

    const {
        validateGuess,
        guessPosition,
        validGuess,
        setImage,
        setImageCoords,
        setMapName,
        imageCoords,
        gameSettings,
        gameState,
        getUnusedImages,
        markImageAsUsed,
        nextRound,
        haveGuessed,
        addImage,
        image,
        currentDistance,
        resetGame,
    } = useGameStore();

    useEffect(() => {
        async function loadData() {
            try {
                for (const source of sources) {
                    if (!gameSettings.mapSelected.includes(source.mapName)) continue;

                    const data = await readJsonFile(source.path);
                    setData(data);

                    const mapsData = data.map_data.filter(map =>
                        map.difficulty === gameSettings.difficulty.toLowerCase()
                    );

                    mapsData.forEach(map => {
                        map.callouts.forEach(callout => {
                            callout.mapName = source.mapName;
                            addImage(callout);
                        });
                    });
                }
                setIsLoading(false);
                selectRandomImage();
            } catch (err) {
                console.error("Error loading JSON file:", err);
                setError(err);
                setIsLoading(false);
            }
        }

        loadData();
    }, [gameSettings.difficulty, addImage]);

    const selectRandomImage = () => {
        const unusedImages = getUnusedImages();

        if (unusedImages.length === 0) {
            resetGame();
            return;
        }

        const randomIndex = Math.floor(Math.random() * unusedImages.length);
        const randomImage = unusedImages[randomIndex];

        if (!randomImage) return;

        const selectedMapName = randomImage.mapName;
        const imagePath = `maps/${selectedMapName.toLowerCase()}/${gameSettings.difficulty.toLowerCase()}/${randomImage.imageName}`;

        markImageAsUsed(randomImage.id || randomImage.imageName);
        setImage(imagePath);
        setImageCoords(randomImage.location);
        setMapName(randomImage.mapName || selectedMapName);
    };

    const handleNextRound = () => {
        nextRound();

        if (gameState.round >= gameSettings.numRounds) {
            setEndGame(true);
            return;
        }

        selectRandomImage();
    };

    const restartGame = () => {
        resetGame();
        setEndGame(false);
        selectRandomImage();
    }

    const backToHome = () => {
        resetGame();
        navigate('/');
    }

    if (isLoading) return <Loader>Loading map information...</Loader>;
    if (error) return <Error>Failed to load map information</Error>;
    if (!data || !image) return <Error>Map data is not available</Error>;

    return (
        <div className="flex h-screen w-screen items-center justify-center flex-col">
            <div className="absolute top-0 left-0 p-4">
                <p className="text-[var(--primary-color)]">Map: {gameSettings.mapName}</p>
                <p className="text-[var(--primary-color)]">Difficulty: {gameSettings.difficulty}</p>
                <p className="text-[var(--primary-color)]">Round: {gameState.round}/{gameSettings.numRounds}</p>
                <p className="text-[var(--primary-color)]">Score: {gameState.score}</p>
            </div>

            <div className="relative flex max-w-[90%] items-center justify-center gap-4">
                <div className="relative w-2/3 h-full flex items-center justify-center">
                    <img
                        src={image}
                        alt="Game view"
                        className="rounded-lg object-cover select-none"
                        draggable={false}
                    />
                </div>

                <div className="relative w-1/3 h-full flex flex-col items-center justify-center gap-4">
                    <InteractiveMap
                        imagePath={data.filePath + data.imageName}
                        imgCoords={imageCoords}
                    />

                    <Button
                        onClick={() => validateGuess(guessPosition)}
                        disabled={!haveGuessed}
                    >
                        Validate Guess
                    </Button>
                </div>
            </div>

            {validGuess && (
                <div className="absolute bottom-0 -translate-y-1/2 z-10">
                    <div className="text-center">
                        <p className="text-[var(--primary-color)] text-xl font-bold">Score: {gameState.score}</p>
                        <p className="text-[var(--primary-color)]">Round: {gameState.round}/{gameSettings.numRounds}</p>
                        <p className="text-[var(--secondary-color)]">
                            Distance: {currentDistance.toFixed(2)}m
                        </p>
                    </div>
                    <Button
                        onClick={handleNextRound}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        {gameState.round >= gameSettings.numRounds ? "Voir le résultat final" : "Prochain Round"}
                    </Button>
                </div>
            )}

            {endGame && (
                <div className="absolute w-full h-full flex items-center justify-center flex-col gap-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <p className="text-[var(--primary-color)] text-xl font-bold">Game Over</p>
                    <p className="text-[var(--primary-color)]">Score: {gameState.score}</p>
                    <Button
                        onClick={restartGame}
                        className="bg-yellow-500 hover:bg-yellow-600"
                    >
                        Restart Game
                    </Button>

                    <Button
                        onClick={backToHome}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Back to Home
                    </Button>
                </div>
            )}
        </div>
    );
}