/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from "react";
import { useDispatch } from "react-redux";
import {Redirect} from "react-router-dom";
import {setAuth, setPersonInfo, setSchools, setSelectedSchool} from "../../../utils/redux/action";
// import {} from '@azure/msal-browser';

export function LogoutPage() {
    // const history = useHistory();
    const dispatch = useDispatch();
    const [ menuIndex ] = useState('menu_list_index');
    dispatch(setAuth(null));
    dispatch(setPersonInfo([]));
    dispatch(setSchools([]));
    dispatch(setSelectedSchool(null));
    localStorage.removeItem(menuIndex);

    return (
        <>
            <Redirect to="/auth/login"/>
        </>
    );
}
