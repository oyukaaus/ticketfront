import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initState = {
    userMenus: [],
};

const userMenus = persistReducer(
    { storage, key: 'userMenus', whitelist: ['userMenus'] }, (state = initState, action) => {
        switch (action.type) {
            case 'SET_USER_MENUS': {
                return {
                    ...state,
                    userMenus: action.payload,
                };
            }
            default:
                return state;
        }
    }
);

export default userMenus;