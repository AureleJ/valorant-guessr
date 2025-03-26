import React, {useEffect, useState} from 'react'
import InteractiveMap from './InteractiveMap'

export default function Content() {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mapUUID, setMapUUID] = useState(null)

    useEffect(() => {
        if (!mapUUID) return

        fetch(`https://valorant-api.com/v1/maps/${mapUUID}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data.data)
                setData(data.data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
                setError(error)
                setIsLoading(false)
            })
    }, [mapUUID])

    const [image, setImage] = useState(null)
    const [mapName, setMapName] = useState(null)

    useEffect(() => {
        const maps = ["fracture", "pearl", "breeze", "haven", "bind", "split"];
        const randomMap = maps[Math.floor(Math.random() * maps.length)];
        const images = {
            fracture: ["B_Main.png"],
            pearl: ["Top_Mid.png"],
            breeze: ["A_Main.png"],
            haven: ["A_Main.png"],
            bind: ["A_Main.png"],
            split: ["A_Main.png"],
        };
        const randomImage = images[randomMap][Math.floor(Math.random() * images[randomMap].length)];

        setImage(randomImage);
        setMapName(randomMap);
    }, []);

    useEffect(() => {
        fetch("https://valorant-api.com/v1/maps/")
            .then(response => response.json())
            .then(data => {
                console.log(data.data)
                data.data.forEach(map => {
                    if (map.displayName.toLowerCase() === mapName) {
                        setMapUUID(map.uuid)
                    }
                })
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, [mapName])

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)]">
                <div className="animate-pulse text-[var(--primary-color)] text-2xl">
                    Loading map details...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)] text-center">
                <div className="text-[var(--secondary-color)] text-2xl">
                    Failed to load map information
                    <p className="text-[var(--primary-color)] text-base mt-4">Please try again later</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-screen bg-[var(--background)] items-center justify-center p-8">
            <div className="flex space-x-8 w-full max-w-7xl">
                <div className="w-1/2 flex items-center justify-center flex-col">
                    <h2 className="text-[var(--primary-color)] text-2xl font-bold mb-4">
                        Find the spot
                    </h2>

                    <img
                        src={`/maps/${mapName}/${image}`}
                        alt={`${mapName} - ${image}`}
                        className="rounded-lg object-cover"
                    />
                </div>

                <div className="w-1/2 flex flex-col items-center justify-between p-6">
                    <InteractiveMap
                        image={data.displayIcon}
                        name={data.displayName}
                        mapData={data}
                    />

                    <button
                        className="bg-[var(--secondary-color)] hover:bg-[var(--hover-color)] text-white font-bold py-2 px-4 rounded w-1/6">
                        Spot
                    </button>
                </div>
            </div>
        </div>
    )
}