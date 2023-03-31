/* eslint-disable */
import {all} from "redux-saga/effects";
import {combineReducers} from "redux";
import * as auth from "../../../src/modules/Auth/_redux/authRedux";
import * as person from './reducers/personInfo';
import * as lang from './reducers/locale';
import schoolList from "./reducers/schoolList";
import * as selectedSchool from './reducers/selectedSchool';
import loader from "./reducers/loader";
import languages from "./reducers/languages";
import userMenus from "./reducers/userMenus";
import menuPositions from "./reducers/menuPositions";
import settingsReducer from "../../settings/settingsSlice";
import layoutReducer from "../../layout/layoutSlice";
import langReducer from "../../lang/langSlice";
import authReducer from "../../auth/authSlice";
import menuReducer from "../../layout/nav/main-menu/menuSlice";
import notificationReducer from "../../layout/nav/notifications/notificationSlice";
import scrollspyReducer from "../../components/scrollspy/scrollspySlice";

export const rootReducer = combineReducers({
    auth: auth.reducer,
    person: person.personInfo,
    locale: lang.locale,
    school: schoolList,
    selectedSchool: selectedSchool.selectedSchool,
    loading: loader,
    settings: settingsReducer,
    layout: layoutReducer,
    lang: langReducer,
    menu: menuReducer,
    notification: notificationReducer,
    scrollspy: scrollspyReducer,
    // languages,
    // userMenus,
    // menuPositions
});

export function* rootSaga() {
    yield all([auth.saga()]);
}
