import React, { useMemo, useState, useEffect } from 'react';

// import redux for auth guard
import { useSelector, useDispatch } from 'react-redux';

// import layout
import Layout from 'layout/Layout';

// import routing modules
import RouteIdentifier from 'routing/components/RouteIdentifier';
import { getRoutes } from 'routing/helper';
import routesAndMenuItems from 'routes.js';
import Loading from 'components/loading/Loading';
import { fetchRequest } from 'utils/fetchRequest';
import { systemMain } from 'utils/fetchRequest/Urls';
import { setLoading, setSelectedSchool } from 'utils/redux/action';

const App = () => {
    const { currentUser, isLogin, person } = useSelector((state) => state.auth);
    const isEschoolUser = person.isEschoolUser || false;
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [isFirstCycle, setIsFirstCycle] = useState(false);
    // ene state iig menu data hadgalhad uldeev
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isFirstCycle) {
            dispatch(setLoading(true));
            const postData = {
                school: selectedSchool?.id
            }
            fetchRequest(systemMain, 'POST', postData)
                .then(res => {
                    if (res.success) {
                        selectedSchool.isShared = res?.isShared;
                        dispatch(setSelectedSchool(selectedSchool))
                        dispatch(setLoading(false));
                    }
                    dispatch(setLoading(false));
                })
                .catch(() => {
                    dispatch(setLoading(false));
                });
            setIsFirstCycle(true)
        }
    }, [isFirstCycle])

    const routes = useMemo(() => getRoutes({ data: routesAndMenuItems, isLogin, userRole: currentUser?.role, user: isEschoolUser }), [isLogin, currentUser]);
    if (routes) {
        return (
            <Layout>
                <RouteIdentifier routes={routes} fallback={<Loading />} />
            </Layout>
        );
    }
    return <></>;
};

export default App;
