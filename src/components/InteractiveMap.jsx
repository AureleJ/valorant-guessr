import React, { useEffect, useRef, useState, useCallback } from "react";
import { distanceTwoPoints } from "../utils/math.jsx";
import { useGameStore } from "../stores/gameStore.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExpand, faCompress, faRotate } from '@fortawesome/free-solid-svg-icons';

library.add(faExpand, faCompress, faRotate);

export default function InteractiveMap({ imagePath, imgCoords }) {
    const [position, setPosition] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [fullscreen, setFullscreen] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const {
        validGuess,
        setHaveGuessed,
        haveGuessed,
        setCurrentDistance,
        setValidGuess,
        setGamePosition,
        isFullscreen,
        setDrawPing,
        drawPing,
        toggleIsFullscreen,
        currentDistance
    } = useGameStore();

    const resetView = useCallback(() => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    }, []);

    const toggleFullscreen = useCallback(() => {
        setFullscreen(prev => !prev);
        resetView();
    }, [resetView]);

    useEffect(() => {
        console.log("Fullscreen state changed:", isFullscreen);
        if (!isFullscreen) {
            setFullscreen(false);
            resetView();
        }
    }, [isFullscreen, resetView]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (fullscreen && e.key === "Escape") {
                setFullscreen(false);
                toggleIsFullscreen();
                resetView();
            }

            switch (e.key) {
                case "r":
                    resetView();
                    break;
                case "f":
                    toggleFullscreen();
                    break;
                case "ArrowUp":
                    setZoom((prev) => Math.min(prev + 0.1, 5));
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    setZoom((prev) => Math.max(prev - 0.1, 1));
                    e.preventDefault();
                    break;
                case "ArrowLeft":
                    setOffset((prev) => ({ x: prev.x - 10, y: prev.y }));
                    e.preventDefault();
                    break;
                case "ArrowRight":
                    setOffset((prev) => ({ x: prev.x + 10, y: prev.y }));
                    e.preventDefault();
                    break;
                case "Enter":
                    if (haveGuessed) {
                        setValidGuess(true);
                    }
                    break;
                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [fullscreen, resetView, setValidGuess, haveGuessed]);

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        const handleMouseLeave = () => setIsDragging(false);
        const handleTouchEnd = () => setIsDragging(false);
        const handleTouchCancel = () => setIsDragging(false);

        const handleMouseMove = (e) => {
            if (!isDragging || !containerRef.current || !imageRef.current) return;

            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            const container = containerRef.current.getBoundingClientRect();
            const imageWidth = container.width * zoom;
            const imageHeight = container.height * zoom;
            const maxOffsetX = (imageWidth - container.width) / 2;
            const maxOffsetY = (imageHeight - container.height) / 2;

            const newOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, offset.x + deltaX));
            const newOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, offset.y + deltaY));

            setOffset({ x: newOffsetX, y: newOffsetY });
            setDragStart({ x: e.clientX, y: e.clientY });
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - dragStart.x;
                const deltaY = touch.clientY - dragStart.y;
                const container = containerRef.current.getBoundingClientRect();
                const imageWidth = container.width * zoom;
                const imageHeight = container.height * zoom;
                const maxOffsetX = (imageWidth - container.width) / 2;
                const maxOffsetY = (imageHeight - container.height) / 2;
                const newOffsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, offset.x + deltaX));
                const newOffsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, offset.y + deltaY));
                setOffset({ x: newOffsetX, y: newOffsetY });
                setDragStart({ x: touch.clientX, y: touch.clientY });
            } else if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                const newZoom = Math.max(1, Math.min(5, distance / 100));
                const scaleFactor = newZoom / zoom;
                const rect = containerRef.current.getBoundingClientRect();
                const mouseX = ((touch1.clientX - rect.left) - (rect.width / 2));
                const mouseY = ((touch1.clientY - rect.top) - (rect.height / 2));
                const newOffsetX = (offset.x - mouseX) * scaleFactor + mouseX;
                const newOffsetY = (offset.y - mouseY) * scaleFactor + mouseY;
                const imageWidth = rect.width * newZoom;
                const imageHeight = rect.height * newZoom;
                const maxOffsetX = (imageWidth - rect.width) / 2;
                const maxOffsetY = (imageHeight - rect.height) / 2;
                setOffset({
                    x: Math.min(maxOffsetX, Math.max(-maxOffsetX, newOffsetX)),
                    y: Math.min(maxOffsetY, Math.max(-maxOffsetY, newOffsetY))
                });
                setZoom(newZoom);
            }
        };

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

       document.addEventListener("mouseleave", handleMouseLeave);
       document.addEventListener("touchend", handleTouchEnd);
       document.addEventListener("touchcancel", handleTouchCancel);
       document.addEventListener("touchmove", handleTouchMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("touchcancel", handleTouchCancel);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isDragging, dragStart, zoom, offset]);

    const getPosition = useCallback((e) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setPosition({ x, y });
        setDrawPing(true);
        setGamePosition({ x, y });

        console.log("Clicked position:", { x, y });

        if (imgCoords) {
            const dist = distanceTwoPoints(x, y, imgCoords.x, imgCoords.y) * 100.0;
            setCurrentDistance(dist);
        }

        setHaveGuessed(true);
    }, [imageRef, imgCoords, setDrawPing, setCurrentDistance, setGamePosition, setHaveGuessed]);

    const handleWheel = useCallback((e) => {
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

        setOffset({
            x: Math.min(maxOffsetX, Math.max(-maxOffsetX, newOffsetX)),
            y: Math.min(maxOffsetY, Math.max(-maxOffsetY, newOffsetY))
        });
        setZoom(newZoom);
    }, [containerRef, zoom, offset]);

    const handleMouseDown = useCallback((e) => {
        if (e.button === 0) {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    }, []);

    const handleClick = useCallback((e) => {
        if (e.detail === 2 && !validGuess) {
            getPosition(e);
        }
    }, [validGuess, getPosition]);

    const handleTouchStart = useCallback((e) => {
        console.log("Touch start:", e.touches.length);
        if (e.touches.length === 1) {
            setIsDragging(true);
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            console.log("Touch coordinates:", e.touches[0], { x, y });
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    }, []);

    useEffect(() => {
        const updateAspectRatio = () => {
            if (containerRef.current) {
                const container = containerRef.current.getBoundingClientRect();
                setAspectRatio(container.width / container.height);
                console.log("Aspect ratio updated:", container.width, container.height, container.width / container.height);
            }
        };

        updateAspectRatio();

        window.addEventListener("resize", updateAspectRatio);
        return () => {
            window.removeEventListener("resize", updateAspectRatio);
        };
    }, [fullscreen]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={containerRef}
                className={`bg-[--second-background] rounded-lg overflow-hidden aspect-square cursor-crosshair flex justify-center items-center
                ${
                    fullscreen ? "fixed top-0 left-0 transform h-screen w-screen z-10 bg-black backdrop-blur-sm bg-opacity-80" : "relative w-full"
                }`}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onTouchStart ={handleTouchStart}
            >
                <div className="absolute z-20 top-2 left-2 flex gap-2 flex-col">
                    <button onClick={toggleFullscreen} className="bg-[--card-background] text-white px-2 py-1 rounded">
                        <FontAwesomeIcon icon={fullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand"} />
                    </button>
                    <button onClick={resetView} className="bg-[--card-background] text-white px-2 py-1 rounded">
                        <FontAwesomeIcon icon="fa-solid fa-rotate" />
                    </button>
                </div>
                <div
                    ref={imageRef}
                    className="absolute select-none overflow-hidden aspect-square w-full"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        width: aspectRatio > 1 ? "auto" : "100%",
                        height: aspectRatio > 1 ? "100%" : "auto",
                    }}
                >
                    <img
                        src={imagePath}
                        alt="interactive-map"
                        className="h-full select-none"
                        draggable="false"
                    />

                    {validGuess && position && imgCoords && (
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
                                    {currentDistance && `${currentDistance.toFixed(2)}m`}
                                </div>
                            </div>
                        </div>
                    )}

                    {drawPing && position && (
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
