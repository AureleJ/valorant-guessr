import React, {useEffect, useState} from 'react';
import {useGameStore} from '../stores/gameStore';
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import sources from "../utils/sources";
import {readJsonFile} from "../utils/jsonUtils.jsx";
import InteractiveMap from "./InteractiveMap.jsx";
import Button from "./Button.jsx";
import {useNavigate} from "react-router-dom";
import {useLanguageStore} from "../stores/languageStore.jsx";
import {useDatabaseStore} from "../stores/databaseStore.jsx";

export default function Game() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [error, setError] = useState(null);
    const [endGame, setEndGame] = useState(false);
    const navigate = useNavigate();

    const translations = useLanguageStore(state => state.getCurrentTranslations());

    const {addLeaderboardEntry} = useDatabaseStore();

    const {
        validateGuess,
        guessPosition,
        validGuess,
        setImage,
        setImageCoords,
        setMapName,
        restartGame,
        imageCoords,
        gameSettings,
        gameState,
        getUnusedImages,
        markImageAsUsed,
        nextRound,
        maxScore,
        haveGuessed,
        addImage,
        image,
        currentDistance,
        resetGame,
        isChallenge
    } = useGameStore();

    useEffect(() => {
        async function loadData() {
            try {
                for (const source of sources) {
                    if (!gameSettings.mapSelected.includes(source.mapName)) continue;

                    const data = await readJsonFile(source.path);
                    const difficulty = gameSettings.difficulty.toLowerCase();
                    const difficultyDataPath = data.filePath + data.mods[difficulty];
                    console.log("Loading data from:", difficultyDataPath);
                    setData(data);
                    const mapsData = await readJsonFile(difficultyDataPath);
                    console.log("Maps data loaded:", mapsData);
                    const callouts = mapsData.callouts;
                    callouts.forEach(callout => {
                        callout.mapName = source.mapName;
                        addImage(callout);
                    });
                }
                setIsLoading(false);

                if (!image)
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
        console.log("Selected image path:", imagePath);

        markImageAsUsed(randomImage.id || randomImage.imageName);

        setIsImageLoading(true);
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

    const restart = () => {
        restartGame()
        setEndGame(false);
        selectRandomImage();
    }

    const backToHome = () => {
        resetGame();
        navigate('/');
    }

    const handleImageLoad = () => {
        setIsImageLoading(false);
    }

    if (isLoading) return <Loader>Loading map information...</Loader>;
    if (error) return <Error>Failed to load map information</Error>;
    if (!data || !image) return <Error>Map data is not available</Error>;
    if (!imageCoords) return <Error>Image coordinates are not available</Error>;

    return (
        <div className="flex flex-col w-full h-full bg-gray-800 items-center justify-start relative p-6 text-primary">
            <div className="relative flex items-center justify-between w-full mb-5">
                <p className="text-xl font-bold">{translations.round}: {gameState.round}/{gameSettings.numRounds}</p>
                <Button onClick={backToHome}>
                    {translations.buttons.backToMenu}
                </Button>
            </div>

            <div className="relative flex w-full h-full items-center justify-center gap-4 md:flex-row flex-col ">
                <div className="relative flex items-center justify-center w-full rounded-lg overflow-hidden">
                    <img
                        src={image}
                        alt="Game view"
                        className="object-cover select-none "
                        draggable={false}
                        onLoad={handleImageLoad}
                    />

                    {isImageLoading && (
                        <div
                            className="absolute flex items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-red to-gray-700">
                            <Loader>Loading image...</Loader>
                        </div>
                    )}
                </div>

                <div className="relative flex flex-col items-center justify-start w-1/2 gap-4">
                    <InteractiveMap
                        imagePath={data.filePath + data.imageName}
                        imgCoords={imageCoords}
                    />

                    <Button
                        onClick={() => validateGuess(guessPosition)}
                        disabled={!haveGuessed || validGuess}
                    >
                        {translations.buttons.validateGuess}
                    </Button>
                </div>
            </div>

            {validGuess && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center flex-col gap-4 transition-all duration-300 ease-in-out bg-gray-700 p-10 rounded-lg shadow-lg border-2 border-gray-500 backdrop-blur-lg bg-opacity-50 border-opacity-50">
                        <p className="text-lg font-bold">Score de la manche : {gameState.score} / {maxScore}</p>
                        <p className="text-lg font-bold">Pourcentage de précision : {((gameState.score / maxScore) * 100).toFixed(2)}%</p>
                        <p className="text-lg font-bold">Score total : {gameState.totalScore} / {gameSettings.numRounds * maxScore}</p>
                        <p className="text-xl font-bold">Distance: {currentDistance.toFixed(2)}m</p>

                        <Button onClick={handleNextRound}>
                            {gameState.round >= gameSettings.numRounds ? translations.buttons.seeResults : translations.buttons.nextRound}
                        </Button>
                </div>
            )}

            {endGame && (
                <div
                    className="absolute w-full h-full flex items-center justify-center flex-col gap-4 bg-gray-800 bg-opacity-70 backdrop-blur-sm z-20">
                    <h2 className="text-2xl font-bold">{translations.scoreResultsTitle}</h2>
                    <p className="text-[var(--primary-color)]">{translations.totalScore} : {gameState.totalScore} / {gameSettings.numRounds * maxScore}</p>
                    <p className="text-[var(--primary-color)]">{translations.averageAccuracy} : {((gameState.totalScore / (gameSettings.numRounds * maxScore)) * 100).toFixed(2)}%</p>
                    {((gameState.totalScore / (gameSettings.numRounds * maxScore)) * 100).toFixed(2) > 50 ? (
                        <p className="text-green-500">{translations.goodAccuracy}</p>
                    ) : (
                        <p className="text-red-500">{translations.badAccuracy}</p>
                    )}

                    {isChallenge && (
                        <>
                            <p className="mt-7">Add your score to the leaderboard</p>
                            <form className=" flex flex-row items-center justify-center gap-4"
                                  onSubmit={async (e) => {
                                      e.preventDefault();
                                      const pseudo = e.target.elements.pseudo.value;
                                      if (!pseudo) return;

                                      await addLeaderboardEntry(pseudo, gameState.totalScore);
                                      backToHome();
                                  }}>
                                <input
                                    type="text"
                                    name="pseudo"
                                    placeholder="Enter your pseudo"
                                    className="p-2 rounded-lg bg-[var(--second-background)] text-[var(--primary-color)]"
                                    required
                                />
                                <Button type="submit" color="blue">
                                    Add
                                </Button>
                            </form>
                        </>)}

                    <Button onClick={restart} color="yellow">
                        {translations.buttons.restartGame}
                    </Button>
                    <Button onClick={backToHome}>
                        {translations.buttons.backToMenu}
                    </Button>
                </div>
            )
            }
        </div>
    )

}