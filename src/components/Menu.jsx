import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faGear, faTimes, faTrophy} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import Button from "./Button.jsx";
import {useGameStore} from '../stores/gameStore';
import {useLanguageStore} from "../stores/languageStore";
import {useDatabaseStore} from "../stores/databaseStore.jsx";

library.add(faGear, faTimes, faTrophy);

const RadioInput = ({id, name, label, value, checked, type, onChange}) => (
    <div className="flex items-center justify-center">
        <label
            htmlFor={id}
            className={`flex items-center justify-center px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                checked
                    ? 'bg-secondary border-secondary text-white shadow-secondary/50 shadow-lg'
                    : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
            }`}
        >
            <input
                id={id}
                name={name}
                type={type}
                checked={checked}
                value={value}
                onChange={() => {
                    if (onChange) {
                        onChange(value);
                    }
                }}
                className="absolute opacity-0 w-0 h-0"
            />
            <span
                className="text-sm font-medium text-center select-none"
            >{label}</span>
        </label>
    </div>
);

const DifficultySelector = ({title, availableDifficulties, initialDifficulty, onDifficultyChange}) => {
    const [selected, setSelected] = useState(initialDifficulty || availableDifficulties[0]);

    useEffect(() => {
        if (initialDifficulty) {
            setSelected(initialDifficulty);
        }
    }, [initialDifficulty]);

    const handleSelection = (difficulty) => {
        setSelected(difficulty);
        onDifficultyChange(difficulty);
    };

    return (
        <fieldset className="w-full">
            <legend className="text-white text-lg font-semibold mb-3">{title}</legend>
            <div className="flex flex-row gap-3">
                {availableDifficulties.map((difficulty, index) => (
                    <RadioInput
                        key={index}
                        id={`difficulty-${index}`}
                        name="difficulty"
                        label={difficulty}
                        value={difficulty}
                        type="radio"
                        checked={difficulty === selected}
                        onChange={() => handleSelection(difficulty)}
                    />
                ))}
            </div>
        </fieldset>
    );
};

const MapSelector = ({title, availableMaps, initialMaps, onMapChange}) => {
    const [selectedMaps, setSelectedMaps] = useState(initialMaps || []);

    useEffect(() => {
        if (initialMaps) {
            setSelectedMaps(initialMaps);
        }
    }, [initialMaps]);

    const handleSelection = (map) => {
        const updatedSelection = selectedMaps.includes(map)
            ? selectedMaps.filter((selected) => selected !== map)
            : [...selectedMaps, map];

        setSelectedMaps(updatedSelection);
        onMapChange(updatedSelection);
    };

    return (
        <fieldset className="w-full">
            <legend className="text-white text-lg font-semibold mb-3">{title}</legend>
            <div className="flex flex-row gap-3 flex-wrap">
                {availableMaps.map((map, index) => (
                    <RadioInput
                        key={index}
                        id={`map-${index}`}
                        name="maps"
                        label={map}
                        value={map}
                        type="checkbox"
                        checked={selectedMaps.includes(map)}
                        onChange={() => handleSelection(map)}
                    />
                ))}
            </div>
        </fieldset>
    );
};

const SliderInput = ({id, name, value, min, max, onChange}) => (
    <>
        <div className="flex flex-col items-center w-full relative">
            <div className="relative w-full">
                <span className="text-white text-lg font-semibold relative select-none">{value}</span>
            </div>

            <input
                id={id}
                name={name}
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb border-none accent-secondary"
            />
        </div>
    </>
);

const SliderRounds = ({title}) => {
    const {maxRounds} = useGameStore();
    const [roundsValue, setRoundsValue] = useState(5);

    const handleSliderChange = (e) => {
        setRoundsValue(e.target.value);
    };

    return (
        <fieldset className="w-full">
            <legend className="text-white text-lg font-bold mb-4">{title}</legend>
            <div className="flex flex-row items-center">
                <SliderInput
                    id="rounds"
                    name="rounds"
                    value={roundsValue}
                    min={2}
                    max={maxRounds}
                    onChange={handleSliderChange}
                />
            </div>
        </fieldset>
    );
};

const NavBar = ({dayChallenge, setDayChallenge}) => {
    useEffect(() => {
        updateIndicator(dayChallenge ? "day-challenge-button" : "custom-game-button");
    }, [dayChallenge]);

    const updateIndicator = (buttonId) => {
        const indicator = document.getElementById("indicator");
        const button = document.getElementById(buttonId);

        if (indicator && button) {
            const buttonWidth = button.offsetWidth;
            const buttonOffset = button.offsetLeft;

            indicator.style.width = `${buttonWidth / 2}px`;
            indicator.style.transform = `translateX(${buttonOffset + buttonWidth / 4}px)`;
        }
    };

    const handleTabChange = (isDayChallenge, buttonId) => {
        setDayChallenge(isDayChallenge);
        updateIndicator(buttonId);
    };

    return (
        <nav className="relative flex flex-row items-center justify-center w-full max-w-lg mb-4">
            <div
                id="indicator"
                className="absolute left-0 bottom-2 h-1 transition-all duration-300 ease-in-out rounded-full bg-primary"
            />
            <button
                id="day-challenge-button"
                onClick={() => handleTabChange(true, "day-challenge-button")}
                className={`relative text-center font-bold transition-colors duration-200 p-4 w-1/3 ${dayChallenge ? 'text-primary' : 'text-gray-400'}`}
            >
                Day Challenge
            </button>
            <button
                id="custom-game-button"
                onClick={() => handleTabChange(false, "custom-game-button")}
                className={`relative text-center font-bold transition-colors duration-200 p-4 w-1/3 ${!dayChallenge ? 'text-primary' : 'text-gray-400'}`}
            >
                Custom Game
            </button>
        </nav>
    );
};

const Leaderboard = ({leaderboard}) => {
    const placeholderCount = Math.max(0, 5 - leaderboard.length);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full shadow-lg rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead
                        className="text-xs uppercase sticky top-0 bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">#</th>
                        <th scope="col" className="px-6 py-3">Top Player</th>
                        <th scope="col" className="px-6 py-3 text-center">Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboard.map((entry, index) => (
                        <tr key={index}
                            className={`bg-gray-800 transition-colors duration-300 ${index % 2 === 0 ? 'bg-opacity-70' : ''}`}>
                            <td className="px-4 py-3 font-bold text-center">{index + 1}</td>
                            <td className="px-6 py-3 font-medium whitespace-nowrap">{entry.pseudo}</td>
                            <td className="px-6 py-3 text-center font-bold">{entry.score}</td>
                        </tr>
                    ))}

                    {Array.from({length: placeholderCount}).map((_, index) => (
                        <tr key={`placeholder-${index}`}
                            className={`bg-gray-800 transition-colors duration-300 ${index % 2 === 0 ? 'bg-opacity-70' : ''}`}>
                            <td className="px-6 py-3 text-center text-gray-500">{leaderboard.length + index + 1}</td>
                            <td className="px-6 py-3 font-medium text-gray-500">-</td>
                            <td className="px-6 py-3 text-gray-500 text-center">-</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Credits = ({setDisplayCredits}) => (
    <div className="fixed bg-gray-700 backdrop-blur-lg bg-opacity-50 w-full h-full inset-0 flex items-center flex-col justify-center z-50">
        <div className="absolute top-10 right-10">
            <Button size="square" onClick={() => setDisplayCredits(false)}>
                <FontAwesomeIcon icon="fa-times"/>
            </Button>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Credits</h2>
            <div>
                <h3 className="text-lg font-medium mb-1">Development</h3>
                <a href="https://aurelej.dev" target="_blank" rel="noopener noreferrer"
                   className="hover:underline">AureleJ</a>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-1">Assets</h3>
                <a href="https://playvalorant.com" target="_blank" rel="noopener noreferrer"
                   className="hover:underline">Valorant</a>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-1">Special Thanks</h3>
                <p className="text-[var(--secondary-color)]">Yoan for map screenshots assistance</p>
            </div>
        </div>
    </div>
);

const Params = ({setDisplayParams, setLanguage, getLanguage}) => (
    <div className="fixed bg-gray-700 backdrop-blur-lg bg-opacity-50 w-full h-full inset-0 flex items-center flex-col justify-center z-50">
        <div className="absolute top-10 right-10">
            <Button size="square" onClick={() => setDisplayParams(false)}>
                <FontAwesomeIcon icon="fa-times"/>
            </Button>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
            <div>
                <h3 className="text-lg font-medium mb-1">Language</h3>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => setLanguage("en-US")}
                        variant={getLanguage === "en-US" ? "primary" : "secondary"}
                    >EN</Button>
                    <Button
                        onClick={() => setLanguage("fr-FR")}
                        variant={getLanguage === "fr-FR" ? "primary" : "secondary"}
                    >FR</Button>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-1">Theme</h3>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => console.log("Light mode")}>Light</Button>
                    <Button onClick={() => console.log("Dark mode")}>Dark</Button>
                </div>
            </div>
        </div>
    </div>
);


const Menu = () => {
    const {
        startGame,
        availableDifficulties,
        availableMaps,
    } = useGameStore();

    const {setLanguage, getLanguage} = useLanguageStore();

    const {getCurrentTranslations} = useLanguageStore();
    const {fetchLeaderboard, leaderboard} = useDatabaseStore();
    const translations = getCurrentTranslations();
    const navigate = useNavigate();

    const [dayChallenge, setDayChallenge] = useState(true);
    const [displayParams, setDisplayParams] = useState(false);
    const [displayCredits, setDisplayCredits] = useState(false);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const selectedMaps = formData.getAll("maps");
        const difficulty = formData.get("difficulty");
        const rounds = formData.get("rounds");

        const notAvailableMaps = ["Abyss", "Fracture", "Split", "Haven", "Icebox", "Pearl", "Lotus", "Bind", "Breeze", "Breach"];
        if (selectedMaps.some(map => notAvailableMaps.includes(map))) {
            window.alert("Some maps are not available yet. Please check back later.");
            return;
        }
        if (selectedMaps.length === 0) {
            window.alert("Please select at least one map.");
            return;
        }

        const notAvailableDifficulties = ["Hard", "Medium"];
        if (notAvailableDifficulties.includes(difficulty)) {
            window.alert("Some difficulties are not available yet. Please check back later.");
            return;
        }

        startGame(selectedMaps, difficulty, rounds, false);
        navigate("/game");
    };

    const startChallenge = () => {
        window.alert("Day Challenge is not implemented yet. Please check back later.");
        // const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
        // const selectedMaps = [randomMap];
        // const difficulty = "hard";

        // startGame(selectedMaps, difficulty, 5, true);
        // navigate("/game");
    };

    return (
        <div
            className="flex flex-col w-screen h-full min-h-screen bg-gray-800 items-center justify-between relative p-6 gap-6 text-primary">
            <div className="absolute top-0 left-0 h-full w-full inset-0 overflow-hidden z-0">
                <div className="absolute -top-1/4 -left-20 h-1/2 aspect-square bg-gray-700 opacity-60 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/4 -right-20 h-1/2 aspect-square bg-gray-700 opacity-60 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full flex justify-between z-10">
                <Button
                    size="square"
                    onClick={() => setDisplayParams(!displayParams)}
                >
                    <FontAwesomeIcon icon="fa-solid fa-gear"/>
                </Button>
            </div>

            <div className="w-full flex flex-col items-center justify-center z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center">
                    <span className="text-secondary">Valorant</span> Guessr
                </h1>
            </div>

            <div className="w-full flex justify-center z-10">
                <NavBar dayChallenge={dayChallenge} setDayChallenge={setDayChallenge}/>
            </div>

            <div className={"w-full flex justify-center z-10"}>
                <div
                    className="bg-gray-700 p-5 md:p-7 rounded-lg shadow-lg border border-gray-600 backdrop-blur-lg bg-opacity-50">
                    {!dayChallenge ? (
                        <form
                            className="flex flex-col w-full items-center justify-center gap-8 max-w-2xl mx-auto"
                            onSubmit={handleSubmit}
                        >
                            <MapSelector
                                title={translations.maps}
                                availableMaps={availableMaps}
                                initialMap="Ascent"
                                onMapChange={(map) => console.log("Selected map:", map)}
                            />

                            <DifficultySelector
                                title={translations.difficulties}
                                availableDifficulties={availableDifficulties}
                                initialDifficulty="Easy"
                                onDifficultyChange={(difficulty) => console.log("Selected difficulty:", difficulty)}
                            />

                            <SliderRounds title={translations.rounds}/>

                            <Button
                                type="submit"
                                variant="primary"
                            >
                                {translations.buttons.startGame}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full gap-8">
                            <div className="flex items-start justify-center w-full gap-8">
                                <div className="p-4 h-full">
                                    <h3 className="text-lg font-bold mb-3 text-secondary text-center">Daily Challenge Rules</h3>
                                    <div className="text-sm flex flex-col gap-2 justify-center">
                                        <li>Guess locations on a randomly selected map</li>
                                        <li>5 rounds to complete</li>
                                        <li>Hard difficulty setting</li>
                                        <li>2 minute time limit per round</li>
                                        <li>Leaderboard resets daily</li>
                                    </div>
                                </div>

                                <Leaderboard leaderboard={leaderboard}/>
                            </div>

                            <Button
                                variant="primary"
                                onClick={startChallenge}>
                                Start Today's Challenge
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-between items-center z-10 mt-auto">
                <div className="text-sm">
                    <p>Alpha v0.1</p>
                    <p>Made with ❤️ by AureleJ</p>
                </div>
                <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setDisplayCredits(true)}
                >
                    Credits
                </Button>
            </div>

            {displayParams && <Params setDisplayParams={setDisplayParams} setLanguage={setLanguage} getLanguage={getLanguage()}/>}

            {displayCredits && <Credits setDisplayCredits={setDisplayCredits}/>}
        </div>
    );
};

export default Menu;