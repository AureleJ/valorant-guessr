import React from "react";
import Button from "./Button.jsx";
import {useGameSettings} from "../context/GameContext.jsx";

const RadioInput = ({id, name, label, defaultChecked, type}) => (
    <div className="flex items-center gap-x-3">
        <input
            id={id}
            name={name}
            type={type}
            defaultChecked={defaultChecked}
            value={label}
            className="relative size-4 appearance-none rounded-full border bg-white checked:bg-[var(--secondary-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-[var(--secondary-color)] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
        />
        <label htmlFor={id} className="block text-sm/6 font-medium text-white">
            {label}
        </label>
    </div>
);

const CheckboxDifficulty = () => (
    <fieldset className="mb-4">
        <legend className="text-white text-lg font-medium mb-2">Difficulty</legend>
        <div className="flex gap-x-6">
            <RadioInput id="easy-difficulty" name="difficulty" label="Easy" defaultChecked type="radio"/>
            <RadioInput id="medium-difficulty" name="difficulty" label="Medium" type="radio"/>
            <RadioInput id="hard-difficulty" name="difficulty" label="Hard" type="radio"/>
        </div>
    </fieldset>
);

const CheckboxMaps = () => (
    <fieldset className="mb-6">
        <legend className="text-white text-lg font-medium mb-2">Maps</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
            <RadioInput id="bind-map" name="maps" label="Bind" type="checkbox" defaultChecked/>
            <RadioInput id="haven-map" name="maps" label="Haven" type="checkbox" defaultChecked/>
            <RadioInput id="split-map" name="maps" label="Split" type="checkbox" defaultChecked/>
            <RadioInput id="ascent-map" name="maps" label="Ascent" type="checkbox" defaultChecked/>
            <RadioInput id="icebox-map" name="maps" label="Icebox" type="checkbox" defaultChecked/>
            <RadioInput id="breeze-map" name="maps" label="Breeze" type="checkbox" defaultChecked/>
        </div>
    </fieldset>
);

export default function Menu({onStartGame}) {
    const {setGameSettings} = useGameSettings();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const selectedMaps = formData.getAll("maps");
        const difficulty = formData.get("difficulty");

        setGameSettings({difficulty, selectedMaps});

        console.log("Données du formulaire:", {difficulty, selectedMaps});

        onStartGame(); // Lancer le jeu
    }

    return (
        <div className="flex flex-col h-screen bg-[var(--background)]">
            <h1 className="text-white text-4xl text-center pt-8 pb-6">Map Selection</h1>
            <form className="flex flex-col items-center justify-center flex-grow" onSubmit={handleSubmit}>
                <div className="bg-opacity-10 p-8 rounded-lg">
                    <CheckboxDifficulty/>
                    <CheckboxMaps/>
                    <div className="flex justify-center">
                        <Button type="submit">Start Game</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
