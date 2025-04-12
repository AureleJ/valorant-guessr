import React, {useEffect, useRef, useState} from "react";
import {distanceTwoPoints} from "../utils/math.jsx";
import {useGameStore} from "../stores/gameStore.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExpand, faCompress, faRotate } from '@fortawesome/free-solid-svg-icons';

export default function InteractiveMap({imagePath, imgCoords}) {
    library.add(faExpand, faCompress, faRotate);
    const [position, setPosition] = useState(null);
    const [distance, setDistance] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({x: 0, y: 0});
    const [fullscreen, setFullscreen] = useState(false);
    const [drawPing, setDrawPing] = useState(false);

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const {validGuess, setHaveGuessed, setCurrentDistance, updateScore} = useGameStore();

    useEffect(() => {
        if (validGuess) {
            toggleFullscreen();
        }
    }, [validGuess]);

    const getPosition = (e) => {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setPosition({x, y});
        setDrawPing(true);

        const dist = distanceTwoPoints(x, y, imgCoords.x, imgCoords.y) * 100.0;
        setDistance(dist);
        setCurrentDistance(dist);

        const maxDistance = 50;
        const maxScore = 5000;
        const score = Math.max(0, Math.round(maxScore * (1 - dist / maxDistance)));
        updateScore(score);

        setHaveGuessed(true);
    };

    const handleWheel = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) - (rect.width / 2));
        const mouseY = ((e.clientY - rect.top) - (rect.height / 2));

        const newZoom = Math.max(1, Math.min(5, zoom - Math.sign(e.deltaY) * 0.2));
        const scaleFactor = newZoom / zoom;

        const newOffsetX = (offset.x - mouseX) * scaleFactor + mouseX;
        const newOffsetY = (offset.y - mouseY) * scaleFactor + mouseY;

        const imageWidth = rect.width * newZoom;
        const imageHeight = rect.height * newZoom;

        const maxOffsetX = (imageWidth - rect.width) / 2;
        const maxOffsetY = (imageHeight - rect.height) / 2;

        const clampedOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, newOffsetX));
        const clampedOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, newOffsetY));

        setOffset({x: clampedOffsetX, y: clampedOffsetY});
        setZoom(newZoom);
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) {
            setIsDragging(true);
            setDragStart({x: e.clientX, y: e.clientY});
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current || !imageRef.current) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const container = containerRef.current.getBoundingClientRect();
        const image = imageRef.current.getBoundingClientRect();

        const imageWidth = container.width * zoom;
        const imageHeight = container.height * zoom;

        const maxOffsetX = (imageWidth - container.width) / 2;
        const maxOffsetY = (imageHeight - container.height) / 2;

        const newOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, offset.x + deltaX));
        const newOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, offset.y + deltaY));

        setOffset({x: newOffsetX, y: newOffsetY});
        setDragStart({x: e.clientX, y: e.clientY});
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleClick = (e) => {
        if (e.detail === 2 && !validGuess) {
            getPosition(e);
        }
    };

    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
        resetView();
    };

    const handleKeyDown = (e) => {
        if (fullscreen && e.key === "Escape") {
            setFullscreen(false);
            resetView();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [fullscreen]);


    const resetView = () => {
        setZoom(1);
        setOffset({x: 0, y: 0});
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDragging, fullscreen]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={containerRef}
                className={`bg-[--seconde-background] rounded-lg overflow-hidden aspect-square cursor-crosshair flex justify-center ${fullscreen ? "fixed top-0 left-0 transform h-screen w-screen z-10 bg-black backdrop-blur-sm bg-opacity-80" : "relative w-full"}`}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            >
                <div className="absolute z-20 top-2 left-2 flex gap-2 flex-col">
                    <button onClick={toggleFullscreen}
                            className="bg-[--card-background] text-white px-2 py-1 rounded">
                        {fullscreen ? <FontAwesomeIcon icon="fa-solid fa-compress" /> : <FontAwesomeIcon icon="fa-solid fa-expand" />}
                    </button>
                    <button onClick={resetView}
                            className="bg-gray-600 text-white px-2 py-1 rounded">
                        <FontAwesomeIcon icon="fa-solid fa-rotate" />
                    </button>
                </div>
                <div
                    ref={imageRef}
                    className="absolute h-full select-none aspect-square"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    }}
                >
                    <img
                        src={imagePath}
                        alt="interactive-map"
                        className="h-full select-none"
                        draggable="false"
                    />

                    {validGuess && position && (
                        <div>
                            <svg className="absolute h-full w-full top-0 left-0 pointer-events-none">
                                <line
                                    x1={`${imgCoords.x * 100}%`}
                                    y1={`${imgCoords.y * 100}%`}
                                    x2={`${position.x * 100}%`}
                                    y2={`${position.y * 100}%`}
                                    stroke="red"
                                    strokeWidth={Math.max(0, 3 / zoom)}
                                />
                            </svg>

                            <div className="absolute pointer-events-none flex items-center justify-center"
                                 style={{
                                     left: `${imgCoords.x * 100}%`,
                                     top: `${imgCoords.y * 100}%`,
                                     transform: 'translate(-50%, -50%)'
                                 }}>
                                <div
                                    className="bg-red-600 rounded-full"
                                    style={{
                                        width: `${Math.max(3, 10 / zoom)}px`,
                                        height: `${Math.max(3, 10 / zoom)}px`,
                                    }}
                                />
                                <div
                                    className="bg-black bg-opacity-70 p-1 rounded absolute text-white text-xs"
                                    style={{
                                        scale: Math.max(0.3, 1 / zoom),
                                        transform: 'translate(-70%, -70%)',
                                    }}>
                                    {distance.toFixed(2) + "m"}
                                </div>
                            </div>
                        </div>
                    )}

                    {drawPing && (
                        <div className="absolute pointer-events-none"
                             style={{
                                 left: `${position.x * 100}%`,
                                 top: `${position.y * 100}%`,
                                 transform: 'translate(-50%, -50%)'
                             }}>
                            <div
                                className="bg-green-300 rounded-full"
                                style={{
                                    width: `${Math.max(3, 10 / zoom)}px`,
                                    height: `${Math.max(3, 10 / zoom)}px`,
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                    Zoom: {zoom.toFixed(1)}x
                </div>
            </div>
        </div>
    );
}
