import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import sources from "../utils/sources";
import { readJsonFile } from "../utils/jsonUtils.jsx";
import InteractiveMap from "./InteractiveMap.jsx";

export default function Game() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        gameSettings,
        addImage,
        getImages,
        gameState,
        setImageCoords,
        setMapName,
        image,
        mapName,
        imageCoords,
        setImage,
        currentDistance,
        setCurrentDistance,
        validGuess,
        setValidGuess,
        validateGuess,
        handlePlayAgain,
    } = useGameStore();

    const gameStore = useGameStore.getState();

    useEffect(() => {
        if (!gameStore.initialized) {
            gameStore.setCurrentDistance = (distance) => {
                setCurrentDistance(distance);
            };

            gameStore.validateGuess = (guessPoint) => {
                if (!imageCoords) return;

                const distance = Math.sqrt(
                    Math.pow(guessPoint.x - imageCoords.x, 2) +
                    Math.pow(guessPoint.y - imageCoords.y, 2)
                );

                const distanceInMeters = distance * 0.25;
                setCurrentDistance(distanceInMeters);

                const maxDistance = 500;
                const maxScore = 5000;
                const score = Math.max(0, Math.round(maxScore * (1 - distanceInMeters / maxDistance)));

                gameStore.updateScore(score);
                setValidGuess(true);
                gameStore.showSolution = true;
            };

            gameStore.handlePlayAgain = () => {
                setValidGuess(false);
                gameStore.showSolution = false;
                gameStore.nextRound();

                const images = getImages();
                if (images.length === 0) return;

                const randomNum = Math.floor(Math.random() * images.length);
                const randomImage = images[randomNum]?.imageName;
                if (!randomImage) return;

                setImage("maps/" + mapName.toLowerCase() + "/" + gameSettings.difficulty.toLowerCase() + "/" + randomImage);
                setImageCoords(images[randomNum]?.location);
                setMapName(images[randomNum]?.mapName);
            };

            gameStore.initialized = true;
        }
    }, []);

    useEffect(() => {
        sources.forEach(source => {
            readJsonFile(source.path)
                .then(data => {
                    setData(data);
                    if (gameSettings.difficulty) {
                        data.map_data.forEach(map => {
                            if (map.difficulty === gameSettings.difficulty.toLowerCase()) {
                                map.callouts.forEach(callout => {
                                    addImage(callout);
                                });
                            }
                        });
                    } else {
                        console.error("gameSettings.difficulty is null or undefined");
                    }
                })
                .catch(error => {
                    console.error("Error loading JSON file:", error);
                    setError(error);
                });
        });

        setIsLoading(false);
    }, [gameSettings.difficulty, addImage]);

    useEffect(() => {
        if (!data) return;
        console.log("Map Data:", data);
        const images = getImages();
        if (images.length === 0) {
            console.error("No images available");
            return;
        }
        const randomNum = Math.floor(Math.random() * images.length);
        const randomImage = images[randomNum]?.imageName;
        if (!randomImage) {
            console.error("randomImage is undefined");
            return;
        }
        setImage("maps/ascent/" + gameSettings.difficulty.toLowerCase() + "/" + randomImage);
        setImageCoords(images[randomNum]?.location);
        setMapName(images[randomNum]?.mapName);
    }, [data]);

    if (isLoading) {
        return (
            <Loader>Loading map information...</Loader>
        )
    }

    if (error) {
        return (
            <Error>Failed to load map information</Error>
        )
    }

    if (!data || !image) {
        return (
            <Error>Map data is not available</Error>
        )
    }


    return (
        <div className="flex h-screen w-screen bg-[var(--background)] items-center justify-center flex-col">
            <div className="flex space-x-8 w-full max-w-[80%]">
                <div className="w-2/3 flex items-center justify-center flex-col">
                    <img
                        src={image}
                        alt={`${mapName} Icon`}
                        className="rounded-lg object-cover select-none"
                        draggable={false}
                    />
                </div>

                <div className="w-1/2 flex flex-col items-center justify-between p-6 h-[500px]">
                    <InteractiveMap imagePath={data.filePath + data.imageName} imgCoords={imageCoords} />
                </div>
            </div>

            <div className="mt-4 flex flex-col items-center">
                {validGuess && (
                    <button
                        className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-opacity-80"
                        onClick={handlePlayAgain}
                    >
                        Jouer encore
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center justify-center mt-10 h-10">
                {currentDistance !== null && (
                    <div className="text-center">
                        <p className="text-[var(--primary-color)] text-xl font-bold">Score: {gameState.score}</p>
                        <p className="text-[var(--primary-color)]">Round: {gameState.round}</p>
                        <p className="text-[var(--secondary-color)]">
                            Distance: {currentDistance.toFixed(2)}m
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}