import Button from "./Button.jsx";
import React from "react";
import {useLanguageStore} from "../stores/languageStore.jsx";

export default function Params() {
    const { setLanguage } = useLanguageStore();

    return (
        <div
            className="absolute w-full h-full flex items-center justify-center flex-col gap-4 bg-black bg-opacity-50 backdrop-blur-sm z-20">

            <h1 className="text-3xl font-bold text-white">Paramètres</h1>

            <p className="text-lg text-white">Choisissez votre langue</p>
            <div className="flex justify-center gap-4">
                <Button onClick={() => setLanguage("en-US")}>EN</Button>
                <Button onClick={() => setLanguage("fr-FR")}>FR</Button>
            </div>

        </div>
    )
}
