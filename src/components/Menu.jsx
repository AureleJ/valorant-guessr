import React from "react";
import Button from "./Button.jsx";
import {useGameStore} from '../stores/gameStore';
import {useNavigate} from "react-router-dom";
import {useLanguageStore} from "../stores/languageStore";

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

export default function Menu() {
    const {setGameSettings} = useGameStore();
    const {setLanguage, getCurrentTranslations} = useLanguageStore();
    const translations = getCurrentTranslations();

    const [displayCredits, setDisplayCredits] = React.useState(false);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const selectedMaps = formData.getAll("maps");
        const difficulty = formData.get("difficulty");

        setGameSettings({
            mapSelected: selectedMaps, difficulty: difficulty, numRounds: 5,
        });

        navigate("/game");
    }

    return (
        <div className="flex flex-col h-screen bg-[var(--background)] items-center justify-center relative">

            <form className="flex flex-col items-center justify-center flex-grow" onSubmit={handleSubmit}>
                <h2 className="text-white text-2xl text-center pt-8 pb-6">{translations.optionsSelections}</h2>
                <div className="p-10 flex flex-col gap-5">
                    <CheckboxDifficulty title={translations.difficulties}/>
                    <CheckboxMaps title={translations.maps}/>
                    <div className="flex justify-center">
                        <Button type="submit">{translations.buttons.startGame}</Button>
                    </div>
                </div>
            </form>


            <div className="flex justify-center gap-4 mb-4 absolute bottom-0 left-0 p-4">
                <Button onClick={() => setLanguage("en-US")}>EN</Button>
                <Button onClick={() => setLanguage("fr-FR")}>FR</Button>
            </div>

            <p onClick={() => setDisplayCredits(true)}
               className="text-white cursor-pointer text-center text-sm absolute bottom-0 right-0 p-4">Credits</p>

            {displayCredits && <div onClick={() => setDisplayCredits(false)}
                                    className="absolute w-full h-full flex items-center justify-center flex-col gap-4 bg-black bg-opacity-50 backdrop-blur-sm z-20">
                <h2 className="text-[var(--primary-color)] text-xl font-bold">Credits</h2>
                <p className="text-[var(--primary-color)]">Game developed by AureleJ <a href={"https://aurelej.dev"}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-[var(--primary-color)]">My
                    website</a></p>
                <p className="text-[var(--primary-color)]">Images from Valorant game</p>
                <p className="text-[var(--primary-color)]">Special thanks to Yoan for the help to take screenshots of
                    the maps</p>
            </div>}
        </div>);
}
