import React from "react";

export default function Error({children}) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)] text-center">
            <div className="text-[var(--secondary-color)] text-2xl">
                <h1>Something went wrong!</h1>
                <p className="text-[var(--primary-color)] text-base mt-4">{children}</p>
            </div>
        </div>
    );
}