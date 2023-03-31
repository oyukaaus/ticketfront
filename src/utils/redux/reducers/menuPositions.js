import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initState = {
    menuPositions: [],
};

const menuPositions = persistReducer(
    { storage, key: 'menuPositions', whitelist: ['menuPositions'] }, (state = initState, action) => {
        switch (action.type) {
            case 'SET_MENU_POSITIONS': {
                return {
                    ...state,
                    menuPositions: action.payload,
                };
            }
            default:
                return state;
        }
    }
);

export default menuPositions;