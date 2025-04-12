import React, {useEffect, useState} from 'react';
import {useGameStore} from '../stores/gameStore';
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import sources from "../utils/sources";
import {readJsonFile} from "../utils/jsonUtils.jsx";
import InteractiveMap from "./InteractiveMap.jsx";
import Button from "./Button.jsx";

export default function Game() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        setValidGuess,
        validGuess,
        setImage,
        setImageCoords,
        setMapName,
        setCurrentDistance,
        imageCoords,
        gameSettings,
        gameState,
        getImages,
        nextRound,
        haveGuessed,
        mapName,
        addImage,
        image,
        currentDistance,
    } = useGameStore();

    console.log("haveGuessed", haveGuessed);

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
        <div className="flex h-screen w-screen items-center justify-center flex-col">
            <div className="relative flex max-w-[90%] items-center justify-center gap-4">
                <div className="relative w-2/3 h-full flex items-center justify-center">
                    <img
                        src={image}
                        alt={`${mapName} Icon`}
                        className="rounded-lg object-cover select-none"
                        draggable={false}
                    />
                </div>

                <div className="relative w-1/3 h-full flex flex-col items-center justify-center gap-4">
                    <InteractiveMap imagePath={data.filePath + data.imageName} imgCoords={imageCoords}/>

                    <Button onClick={setValidGuess} disabled={!haveGuessed}>
                        Validate Guess
                    </Button>
                </div>
            </div>

            {validGuess && (
                <div className="absolute bottom-0 -translate-y-1/2 z-10">
                    <div className="text-center">
                        <p className="text-[var(--primary-color)] text-xl font-bold">Score: {gameState.score}</p>
                        <p className="text-[var(--primary-color)]">Round: {gameState.round}</p>
                        <p className="text-[var(--secondary-color)]">
                            Distance: {currentDistance.toFixed(2)}m
                        </p>
                    </div>
                    <Button onClick={nextRound} className="bg-green-500 hover:bg-green-600">
                        Play Again
                    </Button>
                </div>
            )}
        </div>
    )
}