import React from "react";

export default function Error({children}) {
    return (
        <div className="flex flex-col w-full h-full bg-gray-800 items-center justify-center relative text-primary text-2xl">
            <h1 className="text-secondary">Something went wrong!</h1>
            <p className="text-base mt-4">{children}</p>
        </div>
    );
}