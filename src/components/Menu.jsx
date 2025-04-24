import React, {useEffect, useState} from "react";
import Button from "./Button.jsx";
import {useGameStore} from '../stores/gameStore';
import {useNavigate} from "react-router-dom";
import {useLanguageStore} from "../stores/languageStore";
import {useDatabaseStore} from "../stores/databaseStore.jsx";
import Params from "./Params.jsx";

const RadioInput = ({id, name, label, value, defaultChecked, type}) => (<div className="flex items-center gap-x-3">
    <input
        id={id}
        name={name}
        type={type}
        defaultChecked={defaultChecked}
        value={value}
        className="relative size-4  appearance-none rounded-full border bg-white checked:bg-[var(--secondary-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-[var(--secondary-color)] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
    />
    <label htmlFor={id} className="block text-sm/6 font-medium text-white">
        {label}
    </label>
</div>);

const SliderInput = ({id, name, value, min, max, onChange}) => (
    <div className="flex items-center gap-x-3">
        <input
            id={id}
            name={name}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb border-none"
        />
    </div>
);

const CheckboxDifficulty = ({title}) => {
    const {availableDifficulties} = useGameStore();
    const {getCurrentTranslations} = useLanguageStore();
    const translations = getCurrentTranslations();
    const difficultyOptions = translations.difficultyOptions;

    return (<fieldset className="mb-4">
        <legend className="text-white text-lg font-medium mb-5">{title}</legend>
        <div className="flex gap-x-10">
            {availableDifficulties.map((difficulty, index) => (<RadioInput
                key={index}
                id={`difficulty-${index}`}
                name="difficulty"
                label={difficultyOptions[difficulty.toLowerCase()]}
                value={difficulty}
                type="radio"
                defaultChecked={index === 0}
            />))}
        </div>
    </fieldset>);
}

const CheckboxMaps = ({title}) => {
    const {availableMaps} = useGameStore();

    return (<fieldset className="mb-4">
        <legend className="text-white text-lg font-medium mb-5">{title}</legend>
        <div className="flex gap-x-10">
            {availableMaps.map((map, index) => (<RadioInput
                key={index}
                id={`map-${index}`}
                name="maps"
                label={map}
                value={map}
                type="checkbox"
                defaultChecked
            />))}
        </div>
    </fieldset>);
}

const SliderRounds = ({title}) => {
    const {maxRounds} = useGameStore();
    const {getCurrentTranslations} = useLanguageStore();
    const translations = getCurrentTranslations();

    const [roundsValue, setRoundsValue] = React.useState(5);

    const handleSliderChange = (e) => {
        setRoundsValue(e.target.value);
    };

    return (
        <fieldset className="mb-4">
            <legend className="text-white text-lg font-medium mb-5">{title}</legend>
            <div className="flexflex-col items-center">
                <span className="text-white">{roundsValue}</span>
                <SliderInput
                    id="rounds"
                    name="rounds"
                    label={translations.rounds}
                    value={roundsValue}
                    min={2}
                    max={maxRounds}
                    onChange={handleSliderChange}
                />
            </div>
        </fieldset>
    );
};


const NavBar = ({setDayChallenge}) => {

    return (
        <nav className="relative flex flex-row gap-5 items-center justify-center">
            <div id="indicator"
                 className="absolute left-0 bottom-0 w-1/3 bg-white rounded transition-all duration-200 h-1 transform"/>
            <button
                id="day-challenge-button"
                onClick={() => {
                    setDayChallenge(true);
                    const indicator = document.getElementById("indicator");
                    const buttonWidth = document.getElementById("day-challenge-button").offsetWidth;
                    const buttonOffset = document.getElementById("day-challenge-button").offsetLeft;
                    indicator.style.width = `${buttonWidth / 2}px`;
                    indicator.style.transform = `translateX(${buttonOffset + buttonWidth / 4}px)`;
                }}

                className="relative text-center font-bold transition-colors duration-200 text-white py-2"
            >
                Day Challenge
            </button>
            <button
                id="custom-game-button"
                onClick={() => {
                    setDayChallenge(false);
                    const indicator = document.getElementById("indicator");
                    const buttonWidth = document.getElementById("custom-game-button").offsetWidth;
                    const buttonOffset = document.getElementById("custom-game-button").offsetLeft;
                    indicator.style.width = `${buttonWidth / 2}px`;
                    indicator.style.transform = `translateX(${buttonOffset + buttonWidth / 4}px)`;
                }}

                className="relative text-center font-bold transition-colors duration-200 text-white py-2"
            >
                Custom Game
            </button>
        </nav>
    )
}

const Leaderboard = ({title, leaderboard}) => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full">
            <h2 className="text-[var(--primary-color)] text-lg font-bold mb-5">{title}</h2>
            <table
                className="w-full max-w-lg text-sm text-left text-[var(--primary-color)] rounded-lg overflow-hidden empty:show">
                <thead
                    className="text-xs text-[var(--primary-color)] uppercase bg-[var(--second-background)]">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Rank
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Pseudo
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Score
                    </th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((entry, index) => (
                    <tr key={index}
                        className="bg-[var(--second-background)] transition-colors duration-300 hover:bg-[var(--background)]">
                        <td className="px-6 py-3 whitespace-nowrap">
                            {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-[var(--primary-color)] whitespace-nowrap">
                            {entry.pseudo}
                        </td>
                        <td className="px-6 py-4">
                            {entry.score}
                        </td>
                    </tr>
                ))}

                {Array.from({length: Math.max(0, 5 - leaderboard.length)}).map((_, index) => (
                    <tr key={`placeholder-${index}`}
                        className="bg-[var(--second-background)]">
                        <td className="px-6 py-3 whitespace-nowrap">
                            {leaderboard.length + index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap">
                            -
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                            -
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

const Inner = ({dayChallenge, handleSubmit, translations, leaderboard}) => {
    const {startGame, availableMaps} = useGameStore();

    const navigate = useNavigate();

    const startChallenge = () => {
        const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
        const selectedMaps = [randomMap];

        const difficulty = "easy";

        startGame(selectedMaps, difficulty, 5, true);

        navigate("/game");
    }

    return (
        <div className="relative flex flex-row items-center justify-center w-full h-4/5">
            {!dayChallenge &&
                <form className="flex flex-col items-center justify-center flex-grow relative w-full"
                      onSubmit={handleSubmit}>
                    <div
                        className="p-10 flex flex-col gap-5 max-w-lg w-full bg-[var(--second-background)] rounded-lg shadow-lg">
                        <CheckboxDifficulty title={translations.difficulties}/>
                        <CheckboxMaps title={translations.maps}/>
                        <SliderRounds title={translations.rounds}/>
                        <div className="flex justify-center">
                            <Button type="submit">{translations.buttons.startGame}</Button>
                        </div>
                    </div>
                </form>
            }

            {dayChallenge &&
                <div className="flex flex-col items-center justify-center flex-grow relative w-full gap-5">
                    <Button onClick={startChallenge}>
                        Start Day Challenge
                    </Button>
                    <Leaderboard title={"leaderboard"} leaderboard={leaderboard}/>
                </div>
            }
        </div>
    )
}

export default function Menu() {
    const {startGame} = useGameStore();
    const {getCurrentTranslations} = useLanguageStore();
    const translations = getCurrentTranslations();

    const {fetchLeaderboard, leaderboard} = useDatabaseStore();

    const [dayChallenge, setDayChallenge] = useState(true);
    const [activeParams, setActiveParams] = useState(false);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const [displayCredits, setDisplayCredits] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const selectedMaps = formData.getAll("maps");
        const difficulty = formData.get("difficulty");

        startGame(selectedMaps, difficulty, formData.get("rounds"), false);

        navigate("/game");
    }

    return (
        <div className="flex flex-col h-screen bg-[var(--background)] items-center justify-center relative">

            <NavBar setDayChallenge={setDayChallenge}/>

            <Inner dayChallenge={dayChallenge} handleSubmit={handleSubmit} translations={translations}
                   leaderboard={leaderboard}/>

            <Button variant="ghost" size="small" className="absolute bottom-4 right-4 p-4"
                    onClick={() => setDisplayCredits(true)}>
                Credits
            </Button>

            <Button className="absolute top-4 left-4" onClick={() => setActiveParams(!activeParams)}>
                Paramètres
            </Button>

            {activeParams &&
                <>
                    <Button size="small" className="absolute top-4 right-4 z-30"
                            onClick={() => setActiveParams(false)}>X</Button>
                    <Params/>
                </>
            }

            {displayCredits && <div
                className="absolute w-full h-full flex items-center justify-center flex-col gap-4 bg-black bg-opacity-50 backdrop-blur-sm z-20">
                <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setDisplayCredits(false)}>
                    <Button size="small">X</Button>
                </div>

                <h2 className="text-[var(--primary-color)] text-xl font-bold">Credits</h2>
                <p className="text-[var(--primary-color)]">
                    Game developed by <a href={"https://aurelej.dev"} target="_blank" rel="noopener noreferrer"
                                         className="text-[var(--secondary-color)]">AureleJ</a>
                </p>
                <p className="text-[var(--primary-color)]">Images from <a href={"https://playvalorant.com"}
                                                                          target="_blank" rel="noopener noreferrer"
                                                                          className="text-[var(--secondary-color)]">Valorant</a>
                </p>
                <p className="text-[var(--primary-color)]">Special thanks to <span
                    className="text-[var(--secondary-color)]">Yoan</span> for the help to take screenshots of the maps
                </p>
            </div>
            }

            <div className="absolute bottom-4 left-4 text-[var(--primary-color)] text-sm">
                <p>Alpha version</p>
                <p>Made with ❤️ by AureleJ</p>
            </div>
        </div>);
}