import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

import { TRANSLATIONS_MN } from "./mn/translations";
import { TRANSLATIONS_EN } from "./en/translations";
import { TRANSLATIONS_CN } from "./cn/translations";

i18n
    // .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            mn: {
                translation: TRANSLATIONS_MN
            },
            en: {
                translation: TRANSLATIONS_EN
            },
            cn: {
                translation: TRANSLATIONS_CN
            }
        },
        // lng: 'mn',
        fallbackLng: 'mn',
    });

export default i18n;

// i18n.changeLanguage("mn");