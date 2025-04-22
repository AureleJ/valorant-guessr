import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APP_URL;
const supabaseKey = import.meta.env.VITE_APP_KEY;
console.log(supabaseUrl, supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);


export const useDatabaseStore = create((set, get) => ({
    leaderboard: [],
    error: null,

    fetchLeaderboard: async () => {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('score', { ascending: false })
            .limit(10);

        console.log("Fetched leaderboard data:", data);

        if (error) {
            console.error("Error fetching leaderboard:", error);
            set({ error });
        } else {
            set({ leaderboard: data });
        }
    },

    addLeaderboardEntry: async (pseudo, score) => {
        const { error } = await supabase
            .from('leaderboard')
            .insert([{ pseudo, score }])
            .select();

        if (error) {
            console.error("Error adding leaderboard entry:", error);
            set({ error });
        } else {
            await get().fetchLeaderboard();
        }
    },
}));
