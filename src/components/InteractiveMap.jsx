import React, {useEffect, useState} from "react";
import {GUI} from "dat.gui";

export default function InteractiveMap({image, name, mapData, imageCoords}) {
    const [position, setPosition] = useState(null);
    const [callouts, setCallouts] = useState([]);
    const [activeCallout, setActiveCallout] = useState(false);
    const [drawCallout, setDrawCallout] = useState(false);
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        mapData.map_data.forEach(map => {
            if (map.difficulty === "easy") {
                const transformedCallouts = map.callouts.map(callout => {
                    const translatedPercentX = callout.location.x * 100.0;
                    const translatedPercentY = callout.location.y * 100.0;
                    return {
                        ...callout,
                        translatedPercentX,
                        translatedPercentY,
                    };
                });

                setCallouts(transformedCallouts);
            }
        });
    }, [mapData]);

    const getPosition = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPosition({x, y});
        console.log("Position:", x / rect.width, y / rect.height);

        function distanceTwoPoints(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }

        const distance = distanceTwoPoints(x / rect.width, y / rect.height, imageCoords.x, imageCoords.y) * 100;
        setDistance(distance);
        setDrawCallout(true);

        console.log("Distances:", distance);
    };

    useEffect(() => {
        const gui = new GUI();
        const folder = gui.addFolder('Callouts');
        folder.open();
        folder.add({active: activeCallout}, 'active').onChange((value) => {
            setActiveCallout(value);
        });

        return () => {
            gui.destroy();
        };
    }, []);

    return (
        <div className="relative h-full w-full border-2 border-red-800">
            <img
                src={image}
                alt={`${name} Icon`}
                className="relative h-full w-full object-contain cursor-crosshair"
                onClick={getPosition}
            />

            {activeCallout && callouts.map((callout, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${callout.translatedPercentX}%`,
                        top: `${callout.translatedPercentY}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="w-1 h-1 bg-red-500 rounded-full"/>
                    <div
                        className="bg-black bg-opacity-70 p-1 rounded shadow absolute -top-8 -left-1/2 transform -translate-x-1/2">
                        {callout.regionName}
                    </div>
                </div>
            ))}

            {drawCallout && (
                <>
                    <div className="absolute" style={{
                        left: `${imageCoords.x * 100}%`,
                        top: `${imageCoords.y * 100}%`,
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <div className="w-2 h-2 bg-red-500 rounded-full"/>
                        <div
                            className="bg-black bg-opacity-70 p-1 rounded shadow absolute -top-8 -left-1/2 transform -translate-x-1/2">
                            {distance.toFixed(2) + "m"}
                        </div>
                    </div>

                    <svg className="absolute top-0 left-0 pointer-events-none" width="100%" height="100%">
                        <line x1={`${imageCoords.x * 100}%`} y1={`${imageCoords.y * 100}%`} x2={position.x}
                              y2={position.y} stroke="red"/>
                    </svg>
                </>
            )}

            {position && (
                <div className="absolute" style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)'
                }}>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"/>
                </div>
            )}
        </div>
    );
}