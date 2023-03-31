import React, {useRef, useState} from "react";
import {Redirect, useHistory} from "react-router-dom";
import Forms from "../../Form/Forms";
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import message from "../../message";
import {setLoading} from "../../../../redux/action";
import {fetchRequestNoToken} from "../../../../utils/fetchRequest";
import {useDispatch} from "react-redux";

export function ForgotPassword() {
    const { t } = useTranslation();
    const history = useHistory();
    const formRef = useRef();
    const dispatch = useDispatch();

    let fields = [
        {
            label: t('auth.loginName'),
            value: '',
            type: 'text',
            inputWidth: 250,
            labelWidth: '42%',
            required: true,
            errorMessage: t('errorMessage.enterVerificationCode'),
            key: 'username',
        },
        {
            label: t('auth.verificationCode'),
            value: '',
            type: 'text',
            inputWidth: 250,
            labelWidth: '42%',
            required: true,
            errorMessage: t('errorMessage.enterVerificationCode'),
            key: 'code',
        },
        {
            label: t('auth.newPassword'),
            value: '',
            type: 'text',
            inputWidth: 250,
            labelWidth: '42%',
            required: true,
            errorMessage: t('errorMessage.enterPhoneNumber'),
            key: 'password',
        },
        {
            label: t('auth.repeatNewPassword'),
            value: '',
            type: 'text',
            inputWidth: 250,
            labelWidth: '42%',
            required: true,
            errorMessage: t('errorMessage.enterPhoneNumber'),
            key: 'repeatPassword',
        },
    ];

    const onClose = () => {
        history.push({
            pathname: '/',
        });
    };

    const onSaveClick = () => {
        const [ formValid, formValue ] = formRef.current.validate();

        if (formValid) {
            let code = null;
            let password = null;
            let repeatPassword = null;
            let username = null;
            for(let i = 0; i < formValue.length; i++){
                if(formValue[i]['key'] === 'code'){
                    code = formValue[i]['value'];
                } else if(formValue[i]['key'] === 'password') {
                    password = formValue[i]['value'];
                } else if(formValue[i]['key'] === 'repeatPassword') {
                    repeatPassword = formValue[i]['value'];
                } else if(formValue[i]['key'] === 'username') {
                    username = formValue[i]['value'];
                }
            }

            if(password === repeatPassword){
                const params = {
                    code: code,
                    newPassword: password,
                    username: username,
                };

                dispatch(setLoading(true));
                fetchRequestNoToken('auth/recover', 'POST', params, false)
                    .then(response => {
                        if (response.success) {
                            onClose()
                        }
                        message(response.data.message, response.success);
                        dispatch(setLoading(false));
                    })
                    .catch(() => {
                        dispatch(setLoading(false));
                    })
            } else {
                message(t('errorMessage.repeatPassword'), false);
            }
        }
    };

    return (
        <>
            <div className="login-form login-forgot" style={{ display: "block" }}>
                <div className="text-center mt-20 mb-10 mb-lg-20">
                    <h3 className="font-size-h2">Нууц үг сэргээх</h3>
                    <div className="text-muted font-weight-bold">
                        {t('auth.verificationCodeDescription')}
                    </div>
                    <div className="text-center mt-10">
                        <Forms
                            ref={formRef}
                            fields={fields}
                        />
                    </div>
                    <div className={'mt-10'}>
                        <button onClick={onClose} className='btn btn-link bolder mr-2'>{t('common.back')}</button>
                        <Button variant='success btn-shadow' onClick={onSaveClick}>{t('action.publish')}</Button>
                    </div>
                </div>
            </div>
        </>
    );
}