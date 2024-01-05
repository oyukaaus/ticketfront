import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Col, Dropdown, NavLink, Row } from 'react-bootstrap';
import { MENU_PLACEMENT } from 'constants.js';
import { LogoutOutlined } from '@mui/icons-material';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
// import styled from 'styled-components';
import { setLoading, setPersonInfo } from '../../utils/redux/action';
import showMessage from "../../modules/message";
import { fetchRequest, fetchRequestAdmin } from '../../utils/fetchRequest';
import { userChangePassword, userChangeAvatar } from '../../utils/fetchRequest/Urls';
import ChangePasswordModal from './changePasswordModal';
import ChangeProfilePic from './changeProfilePicModal';

const NavUserMenuContent = ({ userObj }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showChangeProfilePic, setShowChangeProfilePic] = useState(false);

    const { person } = useSelector((state) => state.auth);

    const onChangePasswordSubmit = (param) => {
        dispatch(setLoading(true));
        const postData = {
            ...param
        }
        fetchRequest(userChangePassword, 'POST', postData)
            .then(response => {
                const { message = null, success = false } = response
                if (response.success) {
                    setShowChangePassword(false)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'), success)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }

    const onChangeProfilePicSubmit = (fileData = null) => {
        const bodyParams = {
            file: fileData
        }
        dispatch(setLoading(true));
        fetchRequestAdmin(userChangeAvatar, 'POST', bodyParams)
            .then(response => {
                const { message = null, success = false } = response
                if (success) {
                    person.avatar = response?.path;
                    dispatch(setPersonInfo(person));
                    showMessage(message, success)
                    window.location.reload();
                } else {
                    showMessage(message || t('errorMessage.title'), success)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }
    return (
        <div>
            <Row className="m-0">
                <Col xs="12" className="ps-1 mb-2">
                    <img className="profile d-inline me-3" width={70} alt='avatar'
                        src={person?.avatar ? person?.avatar : '../img/system/default-profile.png'} ></img>
                    <div className="fs-14 font-weight-bold text-dark d-inline">{userObj?.firstName}</div>
                </Col>
                <Col xs="12" className="ps-1 pe-1">
                    <ul className="list-unstyled">
                        <li>
                            <LogoutOutlined className='w-17 me-2' />
                            <a href="/logout">{t('user.logout')}</a>
                        </li>
                    </ul>
                </Col>
            </Row>
            {
                showChangePassword &&
                <ChangePasswordModal
                    show={showChangePassword}
                    setShow={setShowChangePassword}
                    onSubmit={onChangePasswordSubmit}
                />
            }
            {
                showChangeProfilePic &&
                <ChangeProfilePic
                    show={showChangeProfilePic}
                    setShow={setShowChangeProfilePic}
                    onSubmit={onChangeProfilePicSubmit}
                />
            }
        </div>
    )
};
const NotificationItem = ({ img = '', link = '', detail = '' }) => (
    <li className="mb-3 pb-3 border-bottom border-separator-light d-flex">
        {/* <img src={img} className="me-3 sw-4 sh-4 rounded-xl align-self-center" alt="notification" /> */}
        <div className="align-self-center">
            {/* <NavLink to={link} activeClassName="">
                {detail}
            </NavLink> */}
            Notification
        </div>
    </li>
);

const NotificationsDropdownMenu = React.memo(
    React.forwardRef(({ style, className, labeledBy, items }, ref) => {
        return (
            <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
                <NotificationItem />
            </div>
        );
    })
);

const NavNotifDropdownToggle = React.memo(
    React.forwardRef(({ onClick, expanded = false, user = {} }, ref) =>
    (
        <>   <a
            href='#!'
            style={{ color: '#fff' }}
            ref={ref}
            className="d-flex user position-relative"
            data-toggle="dropdown"
            aria-expanded={expanded}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
        >
            <img alt='notif' src='/img/ticket/icon/bell.png' style={{ marginRight: 20 }} width="100%" />
        </a>
        </>
    ))
);
const NavUserMenuDropdownToggle = React.memo(
    React.forwardRef(({ onClick, expanded = false, user = {} }, ref) =>
    (
        <>
            {/* <Col xl={10} lg={7}> */}
            {/* </Col>
            <Col xl={2} lg={3}> */}
            <a
                href='#!'
                style={{ color: '#fff' }}
                ref={ref}
                className="d-flex user position-relative"
                data-toggle="dropdown"
                aria-expanded={expanded}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }}
            >

                <img className="profile" alt={user.firstName} src={user?.avatar ? `${user?.avatar}` : '../img/system/default-profile.png'} />
            </a>
            {/* </Col> */}
            {/* <Col xl={2} lg={2}></Col> */}
        </>
    ))
);

// Dropdown needs access to the DOM of the Menu to measure it
const NavUserMenuDropdownMenu = React.memo(
    React.forwardRef(({ style, className, user = {} }, ref) => {
        return (
            <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
                <NavUserMenuContent userObj={user} />
            </div>
        );
    })
);

NavUserMenuDropdownMenu.displayName = 'NavUserMenuDropdownMenu';

const MENU_NAME = 'NavUserMenu';

const NavUserMenu = () => {
    const dispatch = useDispatch();
    const {
        placementStatus: { view: placement },
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);

    const { isLogin, person } = useSelector((state) => state.auth);
    const [updateView, setUpdateView] = useState(false)

    const { color } = useSelector((state) => state.settings);
    const { showingNavMenu } = useSelector((state) => state.layout);

    const [isPhoneScreen, setIsPhoneScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsPhoneScreen(window.innerWidth <= 767);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        setUpdateView(!updateView);
    }, [person])

    const onToggle = (status, event) => {
        if (event && event.stopPropagation) event.stopPropagation();
        else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
        dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
    };

    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
        // eslint-disable-next-line
    }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

    if (!isLogin) {
        return <></>;
    }
    return (
        <Row>
            <Col xl={4} lg={1} sm={1} ></Col>
            {isPhoneScreen === false && (
                <>
                    <Col xl={1} lg={1} md={1} sm={1}>
                        <Dropdown as="div" bsPrefix="user-container d-flex" onToggle={onToggle} drop="down">
                            <Dropdown.Toggle as={NavNotifDropdownToggle} />
                            <Dropdown.Menu
                                as={NotificationsDropdownMenu}
                                className="dropdown-menu dropdown-menu-end user-menu wide"
                                popperConfig={{
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: () => {
                                                    if (placement === MENU_PLACEMENT.Horizontal) {
                                                        return [0, 7];
                                                    }
                                                    if (window.innerWidth < 768) {
                                                        return [-84, 7];
                                                    }

                                                    return [-78, 7];
                                                },
                                            },
                                        },
                                    ],
                                }}
                            />
                        </Dropdown>
                    </Col>
                    <Col xl={3} lg={4} md={5} sm={4} className="d-flex align-items-center justify-content-center ">
                        <span style={{ fontFamily: 'Mulish', fontWeight: 'bold', fontSize: 14, color: 'white', marginRight: 20 }}>  {person.lastName}{' '}  {person.firstName.toUpperCase()} </span>
                    </Col>
                </>)}
            <Col xl={1} lg={1} md={1} sm={1}>
                <Dropdown as="div" bsPrefix="user-container d-flex" onToggle={onToggle} drop="down">
                    <Dropdown.Toggle as={NavUserMenuDropdownToggle} user={person} />
                    <Dropdown.Menu
                        as={NavUserMenuDropdownMenu}
                        user={person}
                        className="dropdown-menu dropdown-menu-end user-menu wide"
                        popperConfig={{
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: () => {
                                            if (placement === MENU_PLACEMENT.Horizontal) {
                                                return [0, 7];
                                            }
                                            if (window.innerWidth < 768) {
                                                return [-84, 7];
                                            }

                                            return [-78, 7];
                                        },
                                    },
                                },
                            ],
                        }}
                    />
                </Dropdown>
            </Col>
            <Col xl={3} lg={2} sm={2}></Col>
        </Row>
    );
};
export default React.memo(NavUserMenu);
