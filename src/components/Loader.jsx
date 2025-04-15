import React from "react";

export default function Loader({children}) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--background)]">
            <div className="animate-pulse text-[var(--primary-color)] text-2xl">
                {children}
            </div>
        </div>
    );
}