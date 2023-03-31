import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initState = {
    languages: [],
};

const languages = persistReducer(
    { storage, key: 'languages', whitelist: ['languages'] }, (state = initState, action) => {
        switch (action.type) {
            case 'SET_LANGUAGES': {
                return {
                    ...state,
                    languages: action.payload,
                };
            }
            default:
                return state;
        }
    }
);

export default languages;