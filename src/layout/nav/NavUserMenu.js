import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Col, Dropdown, Row } from 'react-bootstrap';
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

    // const onChangePasswordClick = () => {
    //     setShowChangePassword(true);
    // };

    // const onChangeProfilePicClick = () => {
    //     setShowChangeProfilePic(true);
    // };

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

    // const getBase64 = (file = null) => {
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = function () {
    //             const bodyParams = {
    //                 file: reader?.result
    //             }
    //             dispatch(setLoading(true));
    //             fetchRequestAdmin(userChangeAvatar, 'POST', bodyParams)
    //                 .then(response => {
    //                     const { message = null, success = false } = response
    //                     if (success) {
    //                         person.avatar = response?.path;
    //                         dispatch(setPersonInfo(person));
    //                         showMessage(message, success)
    //                     } else {
    //                         showMessage(message || t('errorMessage.title'), success)
    //                     }
    //                     dispatch(setLoading(false));
    //                 })
    //                 .catch(() => {
    //                     dispatch(setLoading(false));
    //                     showMessage(t('errorMessage.title'))
    //                 });
    //         };
    //         reader.onerror = function (error) {
    //             console.log('Error: ', error);
    //         };
    //     }
    // }

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
                        src={userObj?.avatar ? 'https://api.eschool.mn/' + userObj?.avatar : '../img/system/default-profile.png'} />
                    <div className="fs-14 font-weight-bold text-dark d-inline">{userObj?.firstName}</div>
                </Col>
                <Col xs="12" className="ps-1 pe-1">
                    <ul className="list-unstyled">
                        {/* <li>
                            <AccountBoxOutlined className='w-17 me-2' />
                            <a href="#/!" onClick={onChangeProfilePicClick}>{t('user.changeProfilePic')}</a>
                        </li>
                        <li>
                            <LockOutlined className='w-17 me-2' />
                            <a href="#/!" onClick={onChangePasswordClick}>{t('user.changePassword')}</a>
                        </li> */}
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

const NavUserMenuDropdownToggle = React.memo(
    React.forwardRef(({ onClick, expanded = false, user = {} }, ref) => (
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
            <img className="profile" alt={user.firstName} src={user?.avatar ? `https://api.eschool.mn/${user?.avatar}` : '../img/system/default-profile.png'} />
        </a>
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
        <Dropdown as="div" bsPrefix="user-container d-flex" onToggle={onToggle} show={showingNavMenu === MENU_NAME} drop="down">
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
    );
};
export default React.memo(NavUserMenu);
