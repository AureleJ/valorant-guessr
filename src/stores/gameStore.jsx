import {create} from 'zustand';

export const useGameStore = create((set, get) => ({
    // Game settings
    gameSettings: {
        difficulty: "Easy",
        numRounds: 5,
        mapSelected: ["Ascent"],
    },

    availableMaps: ["Ascent"],
    availableDifficulties: ["Easy", "Spells"],
    maxRoundsChoice: 5,
    maxRounds: 10,
    maxDistance: 50,
    maxScore: 5000,

    // Game state
    gameState: {
        score: 0,
        round: 1,
        totalScore: 0,
    },

    // Player interaction
    guessPosition: {x: null, y: null},
    image: null,
    imageCoords: null,
    currentDistance: null,

    // UI flags
    validGuess: false,
    haveGuessed: false,
    drawPing: false,
    isFullscreen: false,

    // Image collection
    images: [],
    usedImageIds: [],

    // Actions
    setGameSettings: (settings) => set({
        gameSettings: {...get().gameSettings, ...settings}
    }),

    setGamePosition: (position) => set({guessPosition: position}),

    setDrawPing: (draw) => set({drawPing: draw}),

    addImage: (image) => set((state) => ({
        images: [...state.images, image]
    })),

    getImages: () => get().images,

    getUnusedImages: () => {
        const {images, usedImageIds} = get();
        return images.filter(img => !usedImageIds.includes(img.id || img.imageName));
    },

    markImageAsUsed: (imageId) => set((state) => ({
        usedImageIds: [...state.usedImageIds, imageId]
    })),

    setImage: (image) => set({image}),

    setImageCoords: (coords) => set({imageCoords: coords}),

    setMapName: (name) => set((state) => ({
        mapName: name,
        gameSettings: {
            ...state.gameSettings,
            mapName: name
        }
    })),

    setCurrentDistance: (distance) => set({currentDistance: distance}),

    setHaveGuessed: (hasGuessed) => set({haveGuessed: hasGuessed}),

    setValidGuess: (isValid) => set({validGuess: isValid}),

    updateTotalScore: (roundScore) => set((state) => ({
        gameState: {
            ...state.gameState,
            totalScore: state.gameState.totalScore + roundScore,
        }
    })),

    nextRound: () => set((state) => ({
        gameState: {
            ...state.gameState,
            round: state.gameState.round + 1,
        },
        currentDistance: null,
        validGuess: false,
        haveGuessed: false,
        drawPing: false,
        isFullscreen: false,
    })),

    toggleIsFullscreen: () => set((state) => ({
        isFullscreen: !state.isFullscreen,
    })),

    // Game logic
    validateGuess: (guessPoint) => {
        const {imageCoords, setCurrentDistance} = get();
        if (!imageCoords) return;

        set({validGuess: true});
        set({isFullscreen: false});

        const distance = Math.sqrt(
            Math.pow(guessPoint.x - imageCoords.x, 2) +
            Math.pow(guessPoint.y - imageCoords.y, 2)
        );

        const distanceInMeters = distance * 100;
        setCurrentDistance(distanceInMeters);

        const maxDistance = get().maxDistance;
        const maxScore = get().maxScore;
        const score = Math.max(0, Math.round(maxScore * (1 - distanceInMeters / maxDistance)));

        set({gameState: {...get().gameState, score: score}});

        get().updateTotalScore(score);
    },

    resetGame: () => set({
        gameState: {
            score: 0,
            round: 1,
            totalScore: 0,
        },
        currentDistance: null,
        validGuess: false,
        usedImageIds: [],
        haveGuessed: false,
        drawPing: false,
        isFullscreen: false,
    }),
}));