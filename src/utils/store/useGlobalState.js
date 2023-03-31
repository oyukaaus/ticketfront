import {useState} from 'react'

const useGlobalState = () => {
    const [school, setSchool] = useState({selectedSchoolId: null, schoolList: []})

    const action = (action) => {
        const {type, payload} = action;

        switch (type){
            case 'setSchool':
                return setSchool(payload);
            default:
                return school;
        }
    }

    return {school, action}
}

export default useGlobalState