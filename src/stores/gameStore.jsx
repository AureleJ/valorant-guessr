import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
    gameSettings: {
        difficulty: null,
        selectedMaps: [],
        rounds: null,
    },
    setGameSettings: (settings) => {
        set((state) => ({
            gameSettings: {
                ...state.gameSettings,
                ...settings,
            },
        }));
    },
    addSelectedMaps: (map) => {
        set((state) => ({
            gameSettings: {
                ...state.gameSettings,
                selectedMaps: [...state.gameSettings.selectedMaps, map],
            },
        }));
    },
    removeSelectedMaps: (map) => {
        set((state) => ({
            gameSettings: {
                ...state.gameSettings,
                selectedMaps: state.gameSettings.selectedMaps.filter((m) => m !== map),
            },
        }));
    },
    setDifficulty: (difficulty) => {
        set((state) => ({
            gameSettings: {
                ...state.gameSettings,
                difficulty,
            },
        }));
    },
    setRounds: (rounds) => {
        set((state) => ({
            gameSettings: {
                ...state.gameSettings,
                rounds,
            },
        }));
    },


    gameState: {
        score: null,
        round: null,
        images: [],
    },
    setScore: (score) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                score,
            },
        }));
    },
    setRound: (round) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                round,
            },
        }));
    },
    addImage: (image) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                images: [...state.gameState.images, image],
            },
        }));
    },
    getImages: () => {
        const { images } = get().gameState;
        return images;
    },
    getScore: () => {
        const { score } = get().gameState;
        return score;
    },
    getRound: () => {
        const { round } = get().gameState;
        return round;
    },

    startGame: () => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                score: 0,
                round: 1,
            },
        }));
    },

    gameStarted: false,
    setGameStarted: (started) => {
        set(() => ({
            gameStarted: started,
        }));
    },

    gameOver: false,
    setGameOver: (over) => {
        set(() => ({
            gameOver: over,
        }));
    },

    resetGame: () => {
        set(() => ({
            gameState: {
                score: 0,
                round: 0,
            },
            gameStarted: false,
            gameOver: false,
        }));
    },
}));
