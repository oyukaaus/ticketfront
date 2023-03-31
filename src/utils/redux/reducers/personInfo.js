import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setPerson: "SET_PERSON_INFO",
};

const initState = {
    firstName: null,
    lastName: null,
    avatar: null,
    email: null,
    phone: null,
    isStudent: false,
};

export const personInfo = persistReducer(
    { storage, key: 'person', whitelist: ['firstName', 'lastName', 'avatar', 'email', 'phone', 'isStudent'] }, (state = initState, action) => {
        switch (action.type) {
            case actionTypes.setPerson: {
                return {
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    avatar: action.payload.avatar,
                    email: action.payload.email,
                    phone: action.payload.phone,
                    isStudent: action.payload.isStudent,
                };
            }
            default:
                return state;
        }
    }
);

export default personInfo;