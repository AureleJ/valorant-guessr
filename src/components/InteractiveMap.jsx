import React, {useEffect, useRef, useState} from "react";
import {distanceTwoPoints} from "../utils/math.jsx";

export default function InteractiveMap({imagePath, imgCoords}) {
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

    const getPosition = (e) => {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setPosition({x, y});
        setDrawPing(true);

        const dist = distanceTwoPoints(x, y, imgCoords.x, imgCoords.y) * 100.0;
        setDistance(dist);
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

        setOffset({ x: clampedOffsetX, y: clampedOffsetY });
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

        setOffset({ x: newOffsetX, y: newOffsetY });
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleClick = (e) => {
        if (e.detail === 2) {
            getPosition(e);
        }
    };

    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

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

    return (<>
            <div className="absolute z-20 top-2 right-2 space-x-2 flex">
                <button onClick={toggleFullscreen}
                        className="bg-gray-800 text-white px-2 py-1 rounded">
                    {fullscreen ? "Quit" : "Fullscreen"}
                </button>
                <button onClick={resetView}
                        className="bg-gray-600 text-white px-2 py-1 rounded">
                    Reset View
                </button>
            </div>

            <div
                ref={containerRef}
                className={`border-2 border-red-800 overflow-hidden aspect-square cursor-crosshair flex justify-center ${fullscreen ? "fixed top-0 left-0 transform h-screen w-screen z-10 bg-black backdrop-blur-sm bg-opacity-80" : "relative h-full"}`}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            >
                <div
                    ref={imageRef}
                    className="border-2 border-red-800 absolute h-full select-none aspect-square"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`
                    }}
                >
                    <img
                        src={imagePath}
                        alt="interactive-map"
                        className="h-full select-none"
                        draggable="false"
                    />

                    {position && (<>
                            <div className="absolute pointer-events-none"
                                 style={{
                                     left: `${imgCoords.x * 100}%`,
                                     top: `${imgCoords.y * 100}%`,
                                     transform: 'translate(-50%, -50%)'
                                 }}>
                                <div className="w-2 h-2 bg-red-500 rounded-full"/>
                                <div
                                    className="bg-black bg-opacity-70 p-1 rounded absolute -top-8 -left-1/2 text-white text-xs">
                                    {distance.toFixed(2)} m
                                </div>
                            </div>

                            <svg className="absolute h-full w-full top-0 left-0 pointer-events-none">
                                <line
                                    x1={`${imgCoords.x * 100}%`}
                                    y1={`${imgCoords.y * 100}%`}
                                    x2={`${position.x * 100}%`}
                                    y2={`${position.y * 100}%`}
                                    stroke="red"
                                    strokeWidth="1"
                                />
                            </svg>
                        </>)}

                    {drawPing && (<div className="absolute pointer-events-none"
                                       style={{
                                           left: `${position.x * 100}%`,
                                           top: `${position.y * 100}%`,
                                           transform: 'translate(-50%, -50%)'
                                       }}>
                            <div className="bg-blue-400 rounded-full w-2 h-2"/>
                        </div>)}
                </div>

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                    Zoom: {zoom.toFixed(1)}x
                </div>
            </div>
        </>
    );
}
