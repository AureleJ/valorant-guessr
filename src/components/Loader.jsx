import React from "react";

export default function Loader({children}) {
    return (
        <div className="flex w-full h-full bg-gray-800 items-center justify-center relative text-primary">
            <p className="animate-pulse text-3xl text-primary">{children}</p>
        </div>
    );
}