import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
    gameSettings: {
        difficulty: null,
        maps: [],
    },
    setGameSettings: (settings) => {
        set((state) => ({
            gameSettings: {
                ...state.gameSettings,
                ...settings,
            },
        }));
    },

    gameState: {
        score: 0,
        round: 0,
    },
    setGameState: (state) => {
        set((prevState) => ({
            gameState: {
                ...prevState.gameState,
                ...state,
            },
        }));
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