import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setSchools: "SET_SCHOOLS",
    setSelectedSchool: "SET_SELECTED_SCHOOL"
};

const initialAuthState = {
    schools: [],
    selectedSchool: {}
};

export const reducer = persistReducer(
    { storage, key: "schools", whitelist: ["schools", "selectedSchool"] },
    (state = initialAuthState, action) => {
        switch (action.type) {
            case actionTypes.setSchools: {
                const schoolList = action.payload;
                let selectedSchoolObj = {};
                if (schoolList && schoolList.length === 1) {
                    selectedSchoolObj = schoolList[0];
                }
                return {
                    schools: schoolList,
                    selectedSchool: selectedSchoolObj
                };
            }
            case actionTypes.setSelectedSchool: {
                return {
                    ...state,
                    selectedSchool: action.payload
                }
            }

            default:
                return state;
        }
    }
);

// export const actions = {
//   login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
// };