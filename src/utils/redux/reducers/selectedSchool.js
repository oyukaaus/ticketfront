import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setSelectedSchool: "SET_SELECTED_SCHOOL",
};

const initState = {
    id: null,
    longName: null,
    shortName: null,
    logoImg: null,
    parentId: null,
    website: null
};

export const selectedSchool = persistReducer(
    { storage, key: 'selected-school', whitelist: ['id', 'longName', 'shortName', 'logoImg', 'website', 'parentId'] }, (state = initState, action) => {
        switch (action.type) {
            case actionTypes.setSelectedSchool: {
                return {
                    id: action.payload.id,
                    longName: action.payload.longName,
                    shortName: action.payload.shortName,
                    logoImg: action.payload.logoImg,
                    parentId: action.payload.parentId,
                    website: action.payload.website,
                };
            }
            default:
                return state;
        }
    }
);

