import React, {useEffect, useState} from 'react';
import InteractiveMap from './InteractiveMap';
import {fetchMapData, findMapUuidByName} from '../services/mapService';
import {useGameSettings} from '../context/GameContext';
import Button from "./Button.jsx";

export default function Content() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapUUID, setMapUUID] = useState(null);
    const [mapData, setMapData] = useState(null);

    const [image, setImage] = useState(null);
    const [imageCoords, setImageCoords] = useState(null);
    const [mapName, setMapName] = useState(null);
    const [ascentImages, setAscentImages] = useState([]);
    const [ascentCallouts, setAscentCallouts] = useState([]);

    const [validGuess, setValidGuess] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [currentDistance, setCurrentDistance] = useState(null);
    const [score, setScore] = useState(null);

    const {gameSettings} = useGameSettings();
    console.log("Game Settings:", gameSettings);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await fetch('/maps/ascent/ascent.json');
                const mapData = await response.json();
                const maps = ["ascent"];
                const randomMap = maps[Math.floor(Math.random() * maps.length)];
                setMapName(randomMap);

                const images = [];
                const callouts = [];
                console.log("Map Data:", mapData);
                setMapData(mapData);
                mapData.map_data.forEach(map => {
                    if (map.difficulty === gameSettings.difficulty.toLowerCase()) {
                        map.callouts.forEach(callout => {
                            const filename = map.difficulty + "/" + callout.regionName + "_" + callout.superRegionName + ".png";
                            images.push(filename);
                            callouts.push(callout);
                        });
                    }
                });
                setAscentImages(images);
                setAscentCallouts(callouts);
            } catch (error) {
                console.error('Error fetching map data:', error);
                setError(error);
            }
        };

        fetchMapData();
    }, []);

    useEffect(() => {
        if (!mapName) return;

        async function getMapUuid() {
            try {
                setIsLoading(true);
                const uuid = await findMapUuidByName(mapName);
                console.log("UUID:", uuid);
                setMapUUID(uuid);
            } catch (error) {
                console.error('Error finding map UUID:', error);
                setError(error);
                setIsLoading(false);
            }
        }

        getMapUuid();
    }, [mapName]);

    useEffect(() => {
        if (!mapUUID) return;

        async function getMapData() {
            try {
                const fetchedData = await fetchMapData(mapUUID);
                setData(fetchedData);
                setIsLoading(false);

                setRandomImage();
            } catch (error) {
                console.error('Error fetching map data:', error);
                setError(error);
                setIsLoading(false);
            }
        }

        getMapData();
    }, [mapUUID]);

    const setRandomImage = () => {
        const images = {
            fracture: ["B_Main.png"],
            pearl: ["Top_Mid.png"],
            ascent: ascentImages
        };

        const callouts = {
            fracture: [],
            pearl: [],
            ascent: ascentCallouts
        };

        if (!mapName || !images[mapName] || images[mapName].length === 0) {
            setError(new Error(`No images available for map: ${mapName}`));
            return;
        }

        const randomNum = Math.floor(Math.random() * images[mapName].length);

        const randomImage = images[mapName][randomNum];
        setImage(randomImage);

        const randomCallouts = callouts[mapName][randomNum];
        setImageCoords(randomCallouts.location);
    };

    const handlePositionSelect = (position, distance) => {
        setSelectedPosition(position);
        setCurrentDistance(distance);
    };

    const handleValidateGuess = () => {
        if (!selectedPosition || currentDistance === null) {
            alert("Please select a position on the map first!");
            return;
        }

        setValidGuess(true);

        const calculatedScore = Math.max(0, Math.round(100 - currentDistance));
        setScore(calculatedScore);
    };

    const handlePlayAgain = () => {
        setValidGuess(false);
        setSelectedPosition(null);
        setCurrentDistance(null);
        setScore(null);

        setRandomImage();
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)]">
                <div className="animate-pulse text-[var(--primary-color)] text-2xl">
                    Loading map details...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)] text-center">
                <div className="text-[var(--secondary-color)] text-2xl">
                    Failed to load map information
                    <p className="text-[var(--primary-color)] text-base mt-4">Please try again later</p>
                </div>
            </div>
        )
    }

    if (!data || !image) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)]">
                <div className="text-[var(--primary-color)] text-2xl">
                    No map data available
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-screen bg-[var(--background)] items-center justify-center flex-col">
            <p className="absolute top-0 left-2 text-[var(--primary-color)] text-2xl font-bold mb-4">Difficulté: {gameSettings.difficulty}</p>
            <p className="absolute top-10 left-2 text-[var(--primary-color)] text-2xl font-bold mb-4">Cartes
                sélectionnées: {gameSettings.selectedMaps.join(", ")}</p>

            <div className="flex space-x-8 w-full max-w-[80%]">
                <div className="w-2/3 flex items-center justify-center flex-col">
                    <img
                        src={`/maps/${mapName}/${image}`}
                        alt={`${mapName} - ${image}`}
                        className="rounded-lg object-cover"
                    />
                </div>

                <div className="w-1/2 flex flex-col items-center justify-between p-6">
                    <InteractiveMap
                        image={data.displayIcon}
                        name={data.displayName}
                        mapData={mapData}
                        imageCoords={imageCoords}
                        validateGuess={validGuess}
                        onPositionSelect={handlePositionSelect}
                    />

                </div>
            </div>
            <div className="mt-4 flex flex-col items-center">

                {!validGuess ? (<Button onClick={handleValidateGuess}>Valider</Button>) : (
                    <Button onClick={handlePlayAgain}>Jouer encore</Button>)}
            </div>

            <div className="flex flex-col items-center justify-center mt-10 h-10">
                {score !== null && (<div className="text-center">
                    <p className="text-[var(--primary-color)] text-xl font-bold">Score: {score}</p>
                    <p className="text-[var(--secondary-color)]">
                        Distance: {currentDistance.toFixed(2)}m
                    </p>
                </div>)}
            </div>
        </div>
    )
}