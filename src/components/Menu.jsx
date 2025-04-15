import React from "react";
import Button from "./Button.jsx";
import {useGameStore} from '../stores/gameStore';
import {useNavigate} from "react-router-dom";

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

const CheckboxDifficulty = () => {
    const {availableDifficulties} = useGameStore();

    return (
        <fieldset className="mb-4">
            <legend className="text-white text-lg font-medium mb-2">Difficulty</legend>
            <div className="flex gap-x-2">
                {availableDifficulties.map((difficulty, index) => (
                    <RadioInput
                        key={index}
                        id={`difficulty-${index}`}
                        name="difficulty"
                        label={difficulty}
                        type="radio"
                        defaultChecked={index === 0}
                    />
                ))}
            </div>
        </fieldset>
    );
}

const CheckboxMaps = () => {
    const {availableMaps} = useGameStore();

    return (
        <fieldset className="mb-4">
            <legend className="text-white text-lg font-medium mb-2">Maps</legend>
            <div className="flex gap-x-2">
                {availableMaps.map((map, index) => (
                    <RadioInput
                        key={index}
                        id={`map-${index}`}
                        name="maps"
                        label={map}
                        type="checkbox"
                        defaultChecked
                    />
                ))}
            </div>
        </fieldset>
    );
}

export default function Menu() {
    const {setGameSettings} = useGameStore();

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const selectedMaps = formData.getAll("maps");
        const difficulty = formData.get("difficulty");

        console.log("Selected Maps:", selectedMaps);
        console.log("Selected Difficulty:", difficulty);

        setGameSettings({
            mapSelected: selectedMaps,
            difficulty: difficulty,
            numRounds: 5,
        });

        console.log("Game settings updated:", {
            mapSelected: selectedMaps,
            difficulty: difficulty,
            numRounds: 5,
        });

        navigate("/game");
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
