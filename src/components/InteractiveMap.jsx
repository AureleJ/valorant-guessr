import React, {useEffect, useRef, useState} from "react";
import {useGameSettings} from "../context/GameContext.jsx";
import {distanceTwoPoints} from "../utils/math.jsx";

export default function InteractiveMap({image, name, mapData, imageCoords, validateGuess, onPositionSelect}) {
    const [position, setPosition] = useState(null);
    const [callouts, setCallouts] = useState([]);
    const [activeCallout, setActiveCallout] = useState(false);
    const [distance, setDistance] = useState(null);
    const {gameSettings} = useGameSettings();
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({x: 0, y: 0});
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const [hideGuess, setHideGuess] = useState(false);

    useEffect(() => {
        if (!validateGuess)
            setHideGuess(false);
    }, [validateGuess]);

    useEffect(() => {
        mapData.map_data.forEach(map => {
            if (map.difficulty === gameSettings.difficulty.toLowerCase()) {
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
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width / zoom;
        const y = (e.clientY - rect.top) / rect.height / zoom;

        console.log("e.clientX:", (e.clientX - rect.left) / rect.width, "e.clientY:", (e.clientY - rect.top) / rect.height);

        const positionObj = {x, y};
        const calculatedDistance = distanceTwoPoints(e.clientX, e.clientY, imageCoords.x, imageCoords.y) / 10;

        setDistance(calculatedDistance);
        setPosition(positionObj);

        if (onPositionSelect) {
            onPositionSelect(positionObj, calculatedDistance);
            setHideGuess(true);
        }
    };

    const updatePositionOnResize = () => {
        const container = containerRef.current.getBoundingClientRect();
        const x = position.x;
        const y = position.y;
        console.log("X:", x, "Y:", y);
        setPosition({x, y});
    };

    const handleWheel = (e) => {
        const delta = -Math.sign(e.deltaY) * 0.1;
        const newZoom = Math.max(1, Math.min(5, zoom + delta));

        if (newZoom !== zoom) {
            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const newOffsetX = mouseX - (mouseX - offset.x) * (newZoom / zoom);
            const newOffsetY = mouseY - (mouseY - offset.y) * (newZoom / zoom);

            setZoom(newZoom);
            setOffset({x: newOffsetX, y: newOffsetY});
        }
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) {
            // e.preventDefault();
            setIsDragging(true);
            setDragStart({x: e.clientX, y: e.clientY});
        }
    };

    const getBoundaries = () => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        const minX = Math.min(0, containerRect.width - imageRect.width / zoom * zoom);
        const maxX = 0;
        const minY = Math.min(0, containerRect.height - imageRect.height / zoom * zoom);
        const maxY = 0;

        return {minX, maxX, minY, maxY};
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;
            let newX = offset.x + deltaX;
            let newY = offset.y + deltaY;

            const {minX, maxX, minY, maxY} = getBoundaries();

            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));

            setOffset({x: newX, y: newY});
            setDragStart({x: e.clientX, y: e.clientY});
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    const handleClick = (e) => {
        if (e.detail === 2 && !validateGuess) {
            getPosition(e);
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, dragStart, offset, zoom]);

    // On page resize
    useEffect(() => {
        const handleResize = () => {
            updatePositionOnResize();
            console.log("Resizing");
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        if (containerRef.current && imageRef.current) {
            const {minX, maxX, minY, maxY} = getBoundaries();

            let newX = Math.max(minX, Math.min(maxX, offset.x));
            let newY = Math.max(minY, Math.min(maxY, offset.y));

            if (newX !== offset.x || newY !== offset.y) {
                setOffset({x: newX, y: newY});
            }
        }
    }, [zoom]);

    return (<div
            ref={containerRef}
            className="relative h-full border-2 border-red-800 overflow-hidden aspect-square"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <div
                ref={imageRef}
                className="absolute h-full w-full origin-top-left transition-transform duration-50 select-none border-2 border-blue-800"
                style={{
                    transform: `scale(${zoom})`, left: `${offset.x}px`, top: `${offset.y}px`
                }}
            >
                <img
                    src={image}
                    alt={`${name} Icon`}
                    className="h-full w-full select-none"
                    draggable="false"
                />

                {activeCallout && callouts.map((callout, index) => (<div
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
                        className="bg-black bg-opacity-70 p-1 rounded shadow absolute -top-8 -left-1/2 transform -translate-x-1/2 text-white text-xs">
                        {callout.regionName}
                    </div>
                </div>))}

                {validateGuess && position && (<div className="h-full w-full">
                    <div className="absolute pointer-events-none"
                         style={{
                             left: `${imageCoords.x * 100}%`,
                             top: `${imageCoords.y * 100}%`,
                             transform: 'translate(-50%, -50%)'
                         }}>
                        <div className="w-2 h-2 bg-red-500 rounded-full"/>
                        <div
                            className="bg-black bg-opacity-70 p-1 rounded shadow absolute -top-8 -left-1/2 transform -translate-x-1/2 text-white text-xs">
                            {distance !== null ? distance.toFixed(2) + "m" : ""}
                        </div>
                    </div>

                    <svg className="absolute h-full w-full top-0 left-0 pointer-events-none" width="100%" height="100%">
                        <line x1={`${imageCoords.x * 100}%`} y1={`${imageCoords.y * 100}%`} x2={`${position.x * 100}%`} y2={`${position.y * 100}%`} stroke="red" strokeWidth="1"/>
                    </svg>
                </div>)}

                {hideGuess && position && (<div className="absolute pointer-events-none" style={{
                    left: `${position.x * 100}%`, top: `${position.y * 100}%`, transform: 'translate(-50%, -50%)'
                }}>
                    <div className="bg-blue-400 rounded-full" style={{width: `${5}px`, height: `${5}px`}}/>
                </div>)}
            </div>

            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                Zoom: {zoom.toFixed(1)}x
            </div>
        </div>
    );
}