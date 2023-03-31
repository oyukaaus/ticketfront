export const setAuth = (params) => {
    return {
        type: 'SET_AUTHENTICATION',
        payload: params,
    }
};
export const setPersonInfo = (params) => {
    return {
        type: 'SET_PERSON_INFO',
        payload: params,
    }
};
export const setLocale = (params) => {
    return {
        type: 'SET_LOCALE',
        payload: params,
    }
};
export const setSchools = (params) => {
    return {
        type: 'SET_SCHOOLS',
        payload: params
    }
};

export const setSelectedSchool = (params) => {
    return {
        type: 'SET_SELECTED_SCHOOL',
        payload: params
    }
}
export const setLoading = (loading = false) => {
    return {
        type: 'LOADING',
        payload: loading
    }
};


