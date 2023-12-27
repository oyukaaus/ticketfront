import { React, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import HtmlHead from 'components/html-head/HtmlHead';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import { setAuth, setPersonInfo, setLoading, setSchools } from '../../utils/redux/action';
import showMessage from "../../modules/message";

// import { store } from '../../store';
import RecoverPassword from './RecoverPassword';

import { auth } from '../../utils/fetchRequest/Urls';
import { fetchRequest } from '../../utils/fetchRequest'

// const Img = styled.img`
//     width: 20px;
//     height: 20px;
//     margin-right: 5px;
// }`;

const Relative = styled.div`
    position: relative;
    > svg {
      position: absolute;
      top: 9px;
      left: 12px;
      color: rgba(255, 91, 29, 0.5);
      z-index: 1;
    }
}`;

const Input = styled.input`
    min-height: 44px;
    padding-left: 40px;
    border-radius: 4px;
}`;

const CheckboxDiv = styled.div`
    .form-check-input {
      border-color: var(--separator) !important;
    }
}`;

const Login = () => {

    const handleResize = () => {
        const image = document.getElementById('image')
        const copyright = document.getElementById('copyright')
        image.style.height = document.getElementById('container').clientHeight + 'px'
        copyright.style.top = document.getElementById('container').clientHeight - 40 + 'px'
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        window.removeEventListener('resize', handleResize)
    })

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    // const { selectedSchool } = useSelector(state => state.schoolData);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { currentLang } = useSelector((state) => state.lang);
    console.log('currentLang', currentLang);
    const title = t('auth.login');
    const description = t('auth.loginPage');

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('errorMessage.enterPhoneNumber')),
        password: Yup.string().min(4, t('errorMessage.enterAtLeastFourCharacter')).required(t('errorMessage.enterPassword')),
    });

    const initialValues = {
        username: '',
        password: '',
        remember: false,
        lang: currentLang.code,
    };

    const onSubmit = (values) => {
        dispatch(setLoading(true))
        fetchRequest(auth, 'POST', values)
            .then((res) => {
                if (res.success) {
                    const { token, schools, user } = res;
                    console.log('schools: ', schools)
                    dispatch(setAuth(token));
                    dispatch(setPersonInfo(user))
                    dispatch(setSchools(schools));
                    history.push('/home')
                }
                else {
                    showMessage(res.message, res.success)
                }
                dispatch(setLoading(false))
            }).catch(() => {
                showMessage(t('errorMessage.title'))
                dispatch(setLoading(false))
            })
    };

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    }

    const onForgotPasswordClick = () => {
        //
    }

    const formik = useFormik({ initialValues, validationSchema, onSubmit });
    const { handleSubmit, handleChange, values, touched, errors } = formik;

    const handleSelectChange = e => {
        values.lang = e.target.value
    }

    const leftSide = (
        <img id='image' src="https://lxp-cdn.eschool.mn/main/login.webp" className='w-100 h-100' alt="background image" />
    );

    const rightSide = (
        <div id='container' className="sw-lg-100 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5">
            <div className="sw-lg-60">
                <div className="sh-11 d-flex justify-content-center align-content-center align-items-center">
                    <NavLink to="/">
                        <div>
                            <img style={{ width: '350px' }} src="/img/logo/eschool-dashboard-logo.png" alt="eschool lxp logo" />
                        </div>
                    </NavLink>
                </div>
                <div className='d-flex flex-row-reverse mt-5 mb-2'>
                    <Form.Select style={{ width: '68px' }} className='border-0' onChange={handleSelectChange}>
                        {/* {
              languages.map(language => (
                <option key={language.code} value={language.code}>{language.code}</option>
              ))
            } */}

                        <option value='mn'>MN</option>
                        <option value='en'>EN</option>
                    </Form.Select>
                </div>
                <div>
                    <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
                        <Relative className="mb-3 form-group tooltip-end-bottom font-pinnacle fs-13">
                            <PhoneIphoneIcon />
                            <Input className='form-control font-pinnacle fs-13 text-medium' type="text" name="username" placeholder={t('common.phoneNumber')} value={values.username} onChange={handleChange} />
                            {errors.username && touched.username && <div className="d-block invalid-tooltip">{errors.username}</div>}
                        </Relative>
                        <Relative className="mb-3 form-group tooltip-end-bottom font-pinnacle fs-13">
                            <LockOpenOutlinedIcon />
                            <Input className='form-control font-pinnacle fs-13 text-medium' type="password" name="password" placeholder={t('auth.password')} value={values.password} onChange={handleChange} />
                            {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
                        </Relative>
                        <CheckboxDiv className="form-check mb-3">
                            <input className="form-check-input" id='rememberMe' type="checkbox" value={values.remember} onChange={handleChange} style={{ borderRadius: '4px' }} />
                            <label className="form-check-label font-mulish fs-14" htmlFor="rememberMe" style={{ color: '#575962' }}>
                                {t('auth.rememberMe')}
                            </label>
                        </CheckboxDiv>
                        <button type="submit" className='btn btn-info w-100 fw-bold pinnacle-bold' style={{ borderRadius: '8px', height: '40px' }}>
                            {t('auth.login').toUpperCase()}
                        </button>
                        <div className='d-grid gap-3 mt-3'>
                            {/* <button type="button" className="btn btn-outline-light pinnacle-bold text-black d-flex justify-content-center align-items-center" style={{ borderRadius: '8px', height: '36px', fontSize: '.7em' }}>
                <Img src='/img/auth/googleSSO.png' alt="google logo" />
                {t('auth.loginGoogle')}
              </button>
              <button type="button" className="btn btn-outline-light pinnacle-bold text-black d-flex justify-content-center align-items-center" style={{ borderRadius: '8px', height: '36px', fontSize: '.7em' }}>
                <Img src='/img/auth/microsoftSSO.png' alt="microsoft logo" />
                {t('auth.loginMicrosoft')}
              </button> */}
                        </div>
                        <div className="d-flex align-items-center flex-column justify-content-between mb-5" style={{ marginTop: '150px' }}>
                            <button type="button" className='btn btn-outline-danger font-pinnacle fs-14' style={{ borderRadius: '8px' }} onClick={handleForgotPassword}>
                                {t('auth.clickHereIfYouForgotYourPassword')}
                            </button>
                        </div>
                        <div className='d-flex align-items-center flex-column justify-content-between'>
                            <p id='copyright' className='position-absolute login-copyright'>{t('auth.copyright', { year: new Date().getFullYear() })}</p>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );

    return (
        <>
            <HtmlHead title={title} description={description} />
            <LayoutFullpage left={leftSide} right={rightSide} />
            {showForgotPassword &&
                <RecoverPassword
                    show={showForgotPassword}
                    setShow={setShowForgotPassword}
                    onSubmit={onForgotPasswordClick}
                />
            }
        </>
    );
};

export default Login;