import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
    // Paramètres du jeu
    gameSettings: {
        difficulty: 'Easy', // Par défaut
        numRounds: 5,
        showSolution: false,
    },

    // État du jeu
    gameState: {
        score: 0,
        round: 1,
        totalScore: 0,
    },

    // Données de l'image actuelle
    image: null,
    imageCoords: null,
    mapName: null,
    currentDistance: null,
    validGuess: false,
    haveGuessed: false,

    // Collection d'images
    images: [],

    // Flag d'initialisation
    initialized: false,

    // Actions
    setGameSettings: (settings) => set({
        gameSettings: { ...get().gameSettings, ...settings }
    }),

    addImage: (image) => set((state) => ({
        images: [...state.images, image]
    })),

    getImages: () => get().images,

    setImage: (image) => set({ image }),

    setImageCoords: (coords) => set({ imageCoords: coords }),

    setMapName: (name) => set({ mapName: name }),

    setCurrentDistance: (distance) => set({ currentDistance: distance }),

    setValidGuess: (isValid) => set({ validGuess: isValid }),

    setHaveGuessed: (hasGuessed) => set({ haveGuessed: hasGuessed }),

    updateScore: (roundScore) => set((state) => ({
        gameState: {
            ...state.gameState,
            score: state.gameState.score + roundScore,
        }
    })),

    nextRound: () => set((state) => ({
        gameState: {
            ...state.gameState,
            round: state.gameState.round + 1,
        },
        currentDistance: null,
    })),

    validateGuess: (guessPoint) => {
        console.log('Validating guess:', guessPoint);
        const { imageCoords } = get();
        if (!imageCoords) return;
    },

    handlePlayAgain: () => {
        // Cette fonction sera définie dans le composant Game
    },

    resetGame: () => set({
        gameState: {
            score: 0,
            round: 1,
            totalScore: 0,
        },
        currentDistance: null,
        validGuess: false,
        gameSettings: {
            ...get().gameSettings,
            showSolution: false,
        }
    }),
}));