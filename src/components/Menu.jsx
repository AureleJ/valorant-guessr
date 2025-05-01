import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faGear, faTimes, faTrophy} from '@fortawesome/free-solid-svg-icons';

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
                    ? 'bg-secondary border-secondary text-white shadow-md'
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
            <span className="text-sm font-medium">{label}</span>
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

const MapSelector = ({title, availableMaps, initialMap, onMapChange}) => {
    const [selected, setSelected] = useState(initialMap || availableMaps[0]);

    useEffect(() => {
        if (initialMap) {
            setSelected(initialMap);
        }
    }, [initialMap]);

    const handleSelection = (map) => {
        setSelected(map);
        onMapChange(map);
    };

    return (
        <fieldset className="w-full">
            <legend className="text-white text-lg font-semibold mb-3">{title}</legend>
            <div className="flex flex-row gap-3">
                {availableMaps.map((map, index) => (
                    <RadioInput
                        key={index}
                        id={`map-${index}`}
                        name="maps"
                        label={map}
                        value={map}
                        type="radio"
                        checked={map === selected}
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
                <span
                    className="text-white text-lg font-semibold relative"
                >
                    {value}</span>
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

/*const CheckboxDifficulty = ({title}) => {
    const {availableDifficulties} = useGameStore();
    const {getCurrentTranslations} = useLanguageStore();
    const translations = getCurrentTranslations();
    const difficultyOptions = translations.difficultyOptions;

    return (
        <fieldset className="mb-6">
            <legend
                className="text-white text-lg font-bold mb-4 border-b border-[var(--secondary-color)] pb-2">{title}</legend>
            <div className="flex gap-x-10 justify-center">
                {availableDifficulties.map((difficulty, index) => (
                    <RadioInput
                        key={index}
                        id={`difficulty-${index}`}
                        name="difficulty"
                        label={difficultyOptions[difficulty.toLowerCase()]}
                        value={difficulty}
                        type="radio"
                        defaultChecked={index === 0}
                    />
                ))}
            </div>
        </fieldset>
    );
};*/

/*const CheckboxMaps = ({title}) => {
    const {availableMaps} = useGameStore();

    return (
        <fieldset className="mb-6">
            <legend
                className="text-white text-lg font-bold mb-4 border-b border-[var(--secondary-color)] pb-2">{title}</legend>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableMaps.map((map, index) => (
                    <RadioInput
                        key={index}
                        id={`map-${index}`}
                        name="maps"
                        label={map}
                        value={map}
                        type="checkbox"
                        defaultChecked
                    />
                ))}
            </div>
        </fieldset>
    );
};*/

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
        <nav className="relative flex flex-row items-center justify-center mb-3 w-full max-w-lg">
            <div
                id="indicator"
                className="absolute left-0 bottom-2 h-1 bg-secondary transition-all duration-300 ease-in-out rounded-full"
            />
            <button
                id="day-challenge-button"
                onClick={() => handleTabChange(true, "day-challenge-button")}
                className={`relative text-center font-bold transition-colors duration-200 py-4 px-6 w-1/3 ${dayChallenge ? 'text-secondary ' : 'text-white'}`}
            >
                Day Challenge
            </button>
            <button
                id="custom-game-button"
                onClick={() => handleTabChange(false, "custom-game-button")}
                className={`relative text-center font-bold transition-colors duration-200 py-4 px-6 w-1/3 ${!dayChallenge ? 'text-secondary ' : 'text-white'}`}
            >
                Custom Game
            </button>
        </nav>
    );
};

const Leaderboard = ({leaderboard}) => {
    const placeholderCount = Math.max(0, 5 - leaderboard.length);

    return (
        <div className="flex flex-col items-center justify-center max-w-2xl w-full">
            <div className="w-full shadow-lg rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead
                        className="text-xs uppercase bg-secondary-background sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">#</th>
                        <th scope="col" className="px-6 py-3">Top Player</th>
                        <th scope="col" className="px-6 py-3 text-center">Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboard.map((entry, index) => (
                        <tr key={index}
                            className={`bg-secondary-background transition-colors duration-300 ${index % 2 === 0 ? 'bg-opacity-70' : ''}`}>
                            <td className="px-4 py-3 font-bold text-center">{index + 1}</td>
                            <td className="px-6 py-3 font-medium whitespace-nowrap">{entry.pseudo}</td>
                            <td className="px-6 py-3 text-center font-bold">{entry.score}</td>
                        </tr>
                    ))}

                    {Array.from({length: placeholderCount}).map((_, index) => (
                        <tr key={`placeholder-${index}`}
                            className={`bg-secondary-background transition-colors duration-300 ${index % 2 === 0 ? 'bg-opacity-70' : ''}`}>
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
    <div
        className="fixed inset-0 flex items-center justify-center flex-col gap-6 bg-black bg-opacity-70 backdrop-blur-sm z-50 p-4">
        <div
            className="bg-[var(--second-background)] p-8 rounded-lg max-w-md w-full relative border border-[var(--secondary-color)] shadow-lg">
            <Button
                size="square"
                className="absolute top-4 right-4"
                onClick={() => setDisplayCredits(false)}
            >
                <FontAwesomeIcon icon="fa-times"/>
            </Button>

            <h2 className="text-[var(--secondary-color)] text-2xl font-bold mb-6 text-center">Credits</h2>

            <div className="space-y-4 text-center">
                <div>
                    <h3 className="text-[var(--primary-color)] text-lg font-medium mb-1">Development</h3>
                    <a href="https://aurelej.dev" target="_blank" rel="noopener noreferrer"
                       className="text-[var(--secondary-color)] hover:underline">AureleJ</a>
                </div>

                <div>
                    <h3 className="text-[var(--primary-color)] text-lg font-medium mb-1">Assets</h3>
                    <a href="https://playvalorant.com" target="_blank" rel="noopener noreferrer"
                       className="text-[var(--secondary-color)] hover:underline">Valorant</a>
                </div>

                <div>
                    <h3 className="text-[var(--primary-color)] text-lg font-medium mb-1">Special Thanks</h3>
                    <p className="text-[var(--secondary-color)]">Yoan for map screenshots assistance</p>
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

    const {getCurrentTranslations} = useLanguageStore();
    const {fetchLeaderboard, leaderboard} = useDatabaseStore();
    const translations = getCurrentTranslations();
    const navigate = useNavigate();

    const [dayChallenge, setDayChallenge] = useState(true);
    const [activeParams, setActiveParams] = useState(false);
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
            className="flex flex-col w-screen h-full min-h-screen bg-gray-800 items-center justify-center relative p-20 px-10 text-primary">
            {/* Background stylistic elements */}
            <div className="absolute top-0 left-0 h-full w-full  inset-0 overflow-hidden">
                <div
                    className="absolute -top-1/4 -left-20 h-1/2 aspect-square bg-gray-700 opacity-60 rounded-full blur-3xl"></div>
                <div
                    className="absolute -bottom-1/4 -right-20 h-1/2 aspect-square bg-gray-700 opacity-60 rounded-full blur-3xl"></div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center mb-11 z-10">
                Valorant Guessr
            </h1>

            <div className="flex flex-col items-center justify-center w-full h-full z-10">
                <NavBar dayChallenge={dayChallenge} setDayChallenge={setDayChallenge}/>

                <div className="bg-gray-700 p-7 rounded-lg shadow-lg border-2 border-gray-700 backdrop-blur-lg bg-opacity-50">
                    <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                        {!dayChallenge ? (
                            <form
                                className="flex flex-col w-full items-center justify-center gap-10"
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
                            <div className="flex flex-col items-center justify-center h-full w-full gap-10">
                                <div
                                    className="flex md:flex-row flex-col items-center justify-center h-full w-full gap-5">

                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                        <h3 className="text-lg font-bold mb-3">Daily Challenge Rules</h3>
                                        <ol className="text-sm space-y-2">
                                            <li>Guess locations on a randomly selected map</li>
                                            <li>5 rounds to complete</li>
                                            <li>Hard difficulty setting</li>
                                            <li>2 minute time limit per round</li>
                                            <li>Leaderboard resets daily</li>
                                        </ol>
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
            </div>

            <Button
                variant="ghost"
                size="small"
                className="absolute bottom-4 right-4 text-secondary"
                onClick={() => setDisplayCredits(true)}
            >
                Credits
            </Button>

            <Button
                size="square"
                className="absolute top-4 left-4 bg-secondary hover:bg-secondary-hover transition-colors"
                onClick={() => setActiveParams(!activeParams)}
            >
                <FontAwesomeIcon icon="fa-solid fa-gear"/>
            </Button>

            {activeParams && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
                         onClick={() => setActiveParams(false)}></div>
                    <div
                        className="fixed z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
                        <Button
                            size="square"
                            className="absolute -top-12 right-0 z-50"
                            onClick={() => setActiveParams(false)}
                        >
                            <FontAwesomeIcon icon="fa-times"/>
                        </Button>
                        <Params/>
                    </div>
                </>
            )}

            {displayCredits && <Credits setDisplayCredits={setDisplayCredits}/>}

            <div className="absolute bottom-4 left-4 text-[var(--primary-color)] text-sm">
                <p>Alpha v0.1</p>
                <p>Made with ❤️ by AureleJ</p>
            </div>
        </div>
    );
};

export default Menu;