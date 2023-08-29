import React, { memo, Suspense } from 'react';
import { Redirect, Switch, Route, useLocation } from 'react-router-dom';
import { DEFAULT_PATHS } from 'config.js';
import { useSelector } from "react-redux";
import RouteItem from './RouteItem';
import Loader from "../../modules/loader";
import Login from "../../views/default/Login";
import SystemAuth from "../../views/default/SystemAuth";
import { LogoutPage } from '../../modules/Auth';

const RouteIdentifier = ({ routes, fallback = <div className="loading" />, notFoundPath = DEFAULT_PATHS.NOTFOUND }) => {
    const { authToken } = useSelector((state) => state.auth);

    const location = useLocation();
    const loading = useSelector(state => {
        return state.loading
    });

    return (
        <Suspense fallback={fallback}>
            {
                loading && (<Loader />)
            }
            <Switch>
                <Route path="/sys-auth" component={SystemAuth} />
                {!authToken && (
                    /*Render auth page when user at `/auth` and not authorized.*/
                    <Route>
                        <Login />
                    </Route>
                )}
                <Route path="/logout" component={LogoutPage} />

                {routes.map((route, rIndex) => (
                    <RouteItem key={`r.${rIndex}`} {...route} />
                ))}

                {
                    authToken && location?.pathname === '/' && <Redirect from="/" to={DEFAULT_PATHS.HOME} />
                }
                <Redirect to={notFoundPath} />
            </Switch>
        </Suspense>
    )
};

export default memo(RouteIdentifier);
