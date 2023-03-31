import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setSchoolList: "SET_SCHOOL_LIST",
};

const initState = {
    schoolList: [],
};

const schoolList = persistReducer(
    { storage, key: 'school-list', whitelist: ['schoolList'] }, (state = initState, action) => {
        switch (action.type) {
            case actionTypes.setSchoolList: {
                return {
                    ...state,
                    schoolList: action?.payload?.schools || []
                }
            }
            default:
                return state;
        }
    }
);

export default schoolList;
