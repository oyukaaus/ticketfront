import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setLocale: "SET_LOCALE",
};

const initLocale = {
    langCode: 'mn',
};

export const locale = persistReducer(
    { storage, key: 'locale', whitelist: ['langCode'] }, (state = initLocale, action) => {
        switch (action.type) {
            case actionTypes.setLocale: {
                return { langCode: action.payload };
            }
            default:
                return state;
        }
    }
)

export default locale;