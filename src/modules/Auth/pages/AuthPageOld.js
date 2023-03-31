/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { makeStyles } from '@material-ui/core';
import { loadCSS } from 'fg-loadcss';
import {
    Button,
    Hidden, List, ListItem, ListItemText,
    TextField, Tooltip, Typography
} from '@material-ui/core';
import {
    Modal
} from "react-bootstrap";
import { useTranslation } from 'react-i18next'
import { useDispatch } from "react-redux";
import {fetchRequest, fetchRequestLogin} from '../../../../utils/fetchRequest'
import qs from 'qs';

import { setAuth } from "../../../../redux/action";
import {useHistory} from "react-router-dom";
import message from "../../../modules/message";


import { useMsal } from "@azure/msal-react";
import {} from '@azure/msal-browser'

const useStyles = makeStyles(theme => ({
    input: {
        backgroundColor: theme.palette.common.white,
    },
    textField: {
        backgroundColor: 'transparent'
    },
    button: {
        padding: '8px 60px'
    },
    icon: {
        margin: theme.spacing(2),
    },
    iconHover: {
        margin: theme.spacing(2),
        '&:hover': {
            color: '#f00',
        },
    },
}));


export function AuthPage() {
    const classes = useStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const [loginName, setLoginName] = useState('');
    const [loginNameError, setLoginNameError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [showForgotModal, setShowForgotModal] = useState(false);

    const { instance, accounts, inProgress } = useMsal();

    const dispatch = useDispatch();

    useEffect(() => {
        loadCSS(
            'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
            document.querySelector('#font-awesome-css'),
        );

        let notiList = [];
        for (let i = 0; i < 3; i++) {
            notiList.push({
                text: 'Сургалтын төлбөрийн үлдэгдэлтэй суралцагчид хөтөлбөрийн албанд хандаж эрхээ нээлгэнэ үү ...',
                date: '2021-06-10'
            })
        }
        setNotifications(notiList)
    }, [])

    const submitLogin = () => {
        setLoginNameError(false);
        setPasswordError(false);
        if (!loginName || loginName.length === 0) {
            setLoginNameError(true)
        }
        if (!password || password.length === 0) {
            setPasswordError(true)
        }
        if(!loginNameError && !passwordError){
            let params = {
                username: loginName,
                password: password,
            };

            fetchRequestLogin('auth/login', 'POST', qs.stringify(params))
                .then(response => {
                    if (response.success) {
                        dispatch(setAuth(response.data.user.token))
                        history.push('/')
                    } else {
                        // message('Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.', false)
                        // sessionStorage.setItem('loginMessage', data.data.message);
                        // dispatch(actions.loader(false))
                    }
                });
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        submitLogin();
    }

    const msAuth = () => {
        if (accounts.length > 0) {
            return <span>There are currently {accounts.length} users signed in!</span>
        } else if (inProgress === "login") {
            return <span>Login is currently in progress!</span>
        } else {
            return (
                <>
                    <span>There are currently no users signed in!</span>
                    <button onClick={() => instance.loginPopup()}>Login</button>
                </>
            );
        }
    }

    const renderLoginForm = () => {
        return (
            <div className="login-content login-content-form pt60">
                <div className="text-center">
                    <div>
                        <img src={toAbsoluteUrl("/media/logos/logo.png")} className="img-responsive" style={{ maxWidth: 120, margin: 'auto' }} alt={''}/>
                    </div>
                    <h4 className="branch-title">{t('system.title')}</h4>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <div className="row">
                            <div className="col-md-2"/>
                            <TextField
                                label={t('auth.loginName')}
                                className={classes.textField + ' col-sm-12 col-md-8'}
                                value={loginName}
                                onChange={(e) => setLoginName(e.target.value)}
                                margin="normal"
                                required
                                error={loginNameError}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-2"/>
                            <TextField
                                label={t('auth.password')}
                                className={classes.textField + ' mt0 col-sm-12 col-md-8'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                type={'password'}
                                error={passwordError}
                            />
                        </div>

                        <div className="text-center mt30">
                            <Button variant="contained" color="primary"
                                    size={'large'} className={classes.button}
                                    onClick={submitLogin}>{t('auth.login')}</Button>
                        </div>

                        <div className="text-center mt30">
                            {msAuth()}
                        </div>

                        <div className="text-center mt30">
                            <Button onClick={() => setShowForgotModal(true)}>{t('auth.forgotPassword')}</Button>
                        </div>

                    </div>
                    <input type='submit' style={{ display: 'none' }}/>
                </form>

                <hr style={{ marginTop: 30, marginBottom: 30 }} />

                {
                    notifications.length > 0
                    &&
                    <>
                        <Typography variant="overline" display="block" gutterBottom style={{ paddingLeft: 20, paddingRight: 20 }}>{t('common.notification')}</Typography>
                        <List className={classes.root}>
                            {
                                notifications.map(function (notification, n) {
                                    return (
                                        <ListItem key={'notification_' + n}>
                                            <ListItemText primary={notification.text} secondary={notification.date} />
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </>
                }

                <div className="social text-center mt30">
                    <Tooltip title={t('social.facebook')} aria-label={t('social.facebook')}>
                        <a href="https://www.facebook.com/msue.education" target="_blank" className="btn btn-facebook">
                            <i className="fab fa-facebook-f"/>
                        </a>
                    </Tooltip>
                    <Tooltip title={t('social.twitter')} aria-label={t('social.twitter')}>
                        <a href="https://twitter.com/msue2012" target="_blank" className="btn btn-twitter">
                            <i className="fab fa-twitter"/>
                        </a>
                    </Tooltip>
                    <Tooltip title={t('social.youtube')} aria-label={t('social.youtube')}>
                        <a href="https://www.youtube.com/channel/UCOhjjoByTlO3ERreW7hRdGg/videos" target="_blank" className="btn btn-youtube">
                            <i className="fab fa-youtube"/>
                        </a>
                    </Tooltip>
                </div>

                <div className={'text-center'}>
                    <Typography variant="body2" display="block" gutterBottom>
                        {'© 2014 - ' + (new Date().getFullYear())}
                    </Typography>
                </div>
            </div>
        )
    };

    const _closeForgotModal = () => {
        setShowForgotModal(false)
    };

    return (
        <React.Fragment>
            <section id="authWrapper">

                <Hidden smDown>
                    <div className="login-content-fixed row">
                        <div className="col-md-5 col-xs-12">
                        </div>
                        <div className="login-content-image col-md-7 text-center pt60">
                            <img src={toAbsoluteUrl("/media/logos/auth_logo_white.png")} className="img-responsive" style={{ margin: 'auto', maxWidth: 150 }} alt=''/>
                        </div>
                    </div>
                </Hidden>

                <div className="login-content-absolute row">
                    <Hidden smDown>
                        <div className="col-md-5">
                            {
                                renderLoginForm()
                            }
                        </div>
                    </Hidden>
                    <Hidden mdUp>
                        <div className="col-md-12 col-xs-12" style={{ backgroundColor: 'white' }}>
                            {
                                renderLoginForm()
                            }
                        </div>
                    </Hidden>

                    <Hidden smDown>
                        <div className="col-md-7">
                        </div>
                    </Hidden>
                </div>
            </section>

            <Modal show={showForgotModal} onHide={_closeForgotModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('auth.recoverPassword')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={_closeForgotModal}>
                        {t('common.close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}
