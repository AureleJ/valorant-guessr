import React, {useEffect, useRef, useState} from "react";
import * as dat from 'dat.gui';

export default function InteractiveMap({image, name, mapData}) {
    const [position, setPosition] = useState(null);
    const [callouts, setCallouts] = useState([]);
    const mapRef = useRef(null);

    // Debug states
    const [xMultiplier, setXMultiplier] = useState(mapData.xMultiplier);
    const [yMultiplier, setYMultiplier] = useState(mapData.yMultiplier);
    const [xScalarToAdd, setXScalarToAdd] = useState(mapData.xScalarToAdd);
    const [yScalarToAdd, setYScalarToAdd] = useState(mapData.yScalarToAdd);

    useEffect(() => {
        if (!mapRef.current) return;
        if (mapData && mapData.callouts) {
            const transformedCallouts = mapData.callouts.map(callout => {
                const gameX = callout.location.x;
                const gameY = callout.location.y;

                let translatedX = gameY * xMultiplier + xScalarToAdd;
                let translatedY = gameX * yMultiplier + yScalarToAdd;

                translatedX *= 577;
                translatedY *= 577;

                return {
                    ...callout,
                    translatedX,
                    translatedY,
                };
            });

            setCallouts(transformedCallouts);
        }
    }, [mapData, xMultiplier, yMultiplier, xScalarToAdd, yScalarToAdd]);

    useEffect(() => {
        const gui = new dat.GUI();
        gui.add({ xMultiplier }, 'xMultiplier', -0.0001, 0.0001, 0.000000000001).onChange(setXMultiplier);
        gui.add({ yMultiplier }, 'yMultiplier', -0.0001, 0.0001, 0.000000000001).onChange(setYMultiplier);
        gui.add({ xScalarToAdd }, 'xScalarToAdd', -1, 1, 0.01).onChange(setXScalarToAdd);
        gui.add({ yScalarToAdd }, 'yScalarToAdd', -1, 1, 0.01).onChange(setYScalarToAdd);

        return () => {
            gui.destroy();
        };
    }, []);

    const getPosition = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPosition({x, y});
    }

    return (
        <div className="relative">
            <img
                ref={mapRef}
                src={image}
                alt={`${name} Icon`}
                className="h-full w-full object-contain cursor-crosshair"
                onClick={getPosition}
            />

            {callouts.map((callout, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${callout.translatedX}px`,
                        top: `${callout.translatedY}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <span
                        className="bg-white text-black px-1 py-1 text-[0.5rem]">
                        {callout.regionName} - {callout.superRegionName}
                    </span>
                </div>
            ))}

            {position && (
                <div
                    className="absolute"
                    style={{top: `${position.y - 6}px`, left: `${position.x - 6}px`}}
                >
                    <div className="w-3 h-3 bg-blue-500 rounded-full"/>
                </div>
            )}
        </div>
    )
}