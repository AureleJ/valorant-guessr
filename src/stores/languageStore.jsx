import { create } from 'zustand';
import frFR from '../locales/fr-FR';
import enUS from '../locales/en-US';

export const useLanguageStore = create((set, get) => {
    const browserLanguage = navigator.language || "en-US";
    const defaultLanguage = ["en-US", "fr-FR"].includes(browserLanguage) ? browserLanguage : "en-US";

    return {
        language: defaultLanguage,

        translations: {
            "en-US": enUS,
            "fr-FR": frFR,
        },

        setLanguage: (lang) => set({ language: lang }),

        getCurrentTranslations: () => {
            const { language, translations } = get();
            return translations[language];
        },
    };
});