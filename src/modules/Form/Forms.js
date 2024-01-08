/* eslint-disable */
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import Checkbox from "./Checkbox";
// import { isEqual } from 'lodash';
import Select from './Select';
import DatePicker from "./DatePicker";
import DateTimePickerComp from "./DateTimePicker";
import TimePicker from "./TimePicker";
import DatePickerRange from "./DatePickerRange";
import TimePickerRange from "./TimePickerRange";
import { useTranslation } from "react-i18next";
import { HelpOutline } from '@mui/icons-material';
import { Button, Popover, OverlayTrigger, Col } from "react-bootstrap";
import './form.scss';

const Forms = (({
    fields: paramFields = [],
    onSubmit,
    fileData
}, ref) => {
    const { t } = useTranslation();
    const fileUploaderRef = useRef([]);
    useImperativeHandle(ref, () => ({
        validate() {
            return validateFields();
        },
        hideMessages,
        updateFields,
        updateChildField,
        getValues,
        getCurrentState() {
            return fields;
        }
    }));

    const [fields, setFields] = useState([]);
    console.log('fields: ', fileData)
    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    useEffect(() => {
        setFields(paramFields)
        // if (paramFields?.length && !isEqual(paramFields, fields)) {
        //     setFields(paramFields);
        // }
    }, []);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const onInputChange = (e, index, upperCase, isNoMinus) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        const re = /^[0-9]*$/;
        if (isNoMinus) {
            if (re.test(e.target.value)) {
                field.value = upperCase ? e.target.value.toUpperCase() : e.target.value;
                clone[index] = field;
                setFields(clone);
            }
        } else {
            field.value = upperCase ? e.target.value.toUpperCase() : e.target.value;
            clone[index] = field;
            setFields(clone);
        }
    };

    const onFileInputChange = (e, index) => {
        const clone = [...fields];
        if (e.target.files && e.target.files) {
            let files = e.target.files;
            const verified = verifyFile(files, index);

            if (verified) {
                let fileNames = '';
                for (let i = 0; i < files.length; i++) {
                    if (files.length == 1) {
                        fileNames = files[i].name;
                    } else if (files.length == i + 1) {
                        fileNames = fileNames + files[i].name;
                    } else if (files.length > 1) {
                        fileNames = fileNames + files[i].name + ', ';
                    }
                }
                clone[index].fileNames = fileNames;
                clone[index].showErrorMessage = false;
                clone[index].errorMessage = '';
                clone[index].files = files;
                clone[index].fileData = files[0];
                clone[index].onChange?.(files, e, 'add');
                setFields(clone);
            }
        }
    };

    const onFileUploadButtonHandler = (index) => {
        if (fileUploaderRef && fileUploaderRef.current[index]) {
            fileUploaderRef.current[index].click();
        }
    };

    const onFileUploadClearButtonHandler = (index) => {
        const clone = [...fields];
        clone[index].files = null;
        clone[index].fileNames = '';
        clone[index].onChange?.(null, null, 'clear');
        setFields(clone);
    };

    const verifyFile = (files, index) => {
        const clone = [...fields];
        const acceptedType = [
            // 'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
            // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            // 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            // 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            // 'video/x-ms-wmv',
            // 'application/pdf',
            // 'audio/mpeg',
            // 'video/mpeg',
            // 'video/mp4',
            // 'video/quicktime',
            // 'video/x-ms-wmv',
        ];
        const acceptedSize = 52428800;

        if (files && files.length > 0) {
            let isFalse = true;
            for (let i = 0; i < files.length; i++) {
                let imageSize = files[i].size;
                let imageType = files[i].type;
                if (imageSize > acceptedSize) {
                    clone[index].showErrorMessage = true;
                    clone[index].errorMessage = t('newsfeed.fileSizeWarning');
                    setFields(clone);
                    isFalse = false;
                }

                if (!acceptedType.includes(imageType)) {
                    clone[index].showErrorMessage = true;
                    clone[index].errorMessage = t('newsfeed.imageTypeError');
                    setFields(clone);
                    isFalse = false;
                }
            }
            return isFalse;
        }
    };

    const validateFields = () => {
        let allValid = true;
        const clone = [...fields];
        for (let i = 0; i < fields.length; i++) {
            const field = { ...clone[i] };
            if (field.required) {
                if (field?.type == 'email' && (field?.value != null && field?.value != '')) {
                    if (!validateEmail(field?.value)) {
                        allValid = false;
                    }
                }
                if (field.validation && typeof field.validation === 'function') {
                    const { valid, message } = field.validation(field.value, clone, getValues());
                    if (valid) {
                        if (message) {
                            field.showSuccessMessage = true;
                            field.successMessage = message;
                        }
                    } else {
                        allValid = false;
                        field.showErrorMessage = true;

                        if (message) {
                            field.customErrorMessage = message;
                        }
                    }
                } else if (!field.value || (field.value.constructor === Array && field.value.length === 0)) {
                    allValid = false;
                    field.showErrorMessage = true;
                } else if (field.validValue && field.validValue.constructor === Array && field.validValue.length > 0) {
                    let keys = Object.keys(field.validValue[0]);
                    if (keys && keys.length > 0) {
                        let maxVal = 0;
                        let minVal = 0;
                        for (let i = 0; i < keys.length; i++) {
                            if (keys[i] == 'min') {
                                minVal = field.validValue[0][keys[i]];
                            } else if (keys[i] == 'max') {
                                maxVal = field.validValue[0][keys[i]];
                            }
                        }

                        if (minVal >= parseInt(field.value) || maxVal < parseInt(field.value)) {
                            allValid = false;
                            field.showErrorMessage = true;
                        } else {
                            field.showErrorMessage = false;
                        }
                    }
                } else if (parseInt(field.validValue) == parseInt(field.value)) {
                    allValid = false;
                    field.showErrorMessage = true;
                } else if (field.value) {
                    field.showErrorMessage = false;
                }
                if (field?.type == 'carNumber' && field?.value?.length == 7) {
                    field.showErrorMessage = false;
                } else if (field?.type == 'carNumber' && field?.value?.length < 7) {
                    allValid = false;
                    field.showErrorMessage = true;
                }
            }
            clone[i] = field;
        }
        setFields(clone);
        return [allValid, clone, getValues()];
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit?.();
        // validateFields();
    };

    const handleDropdownChange = (value, evt, index, fieldOption) => {
        let option = [];
        let options = fieldOption.options;
        if (options && options.length > 0) {
            for (let i = 0; i < options.length; i++) {
                if (value == options[i].value) {
                    option = options[i]
                }
            }
        }
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = value;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(value, option);
    };

    const handleExtendedButtonChange = (index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field?.onExtendedButtonChange?.('click');
    };

    const isVisible = (index, clone, field) => {
        clone[index + 1].invisible = !field.value;
        if (field.value) {
            clone[index + 1].value = ""
            clone[index + 1].required = true
        } else {
            clone[index + 1].value = ""
            clone[index + 1].required = false
        }
        return clone;
    }

    const isVisibleRadio = (index, clone, value) => {
        clone[index + 1].invisible = !value;
        if (value) {
            clone[index + 1].value = ""
            clone[index + 1].required = true
        } else {
            clone[index + 1].value = ""
            clone[index + 1].required = false
        }
        return clone;
    }

    const handleCheckboxClick = (checked, index) => {
        let clone = [...fields];
        const field = { ...clone[index] };
        field.value = !checked;
        clone[index] = field;
        if (field.controlVisible) {
            clone = isVisible(index, clone, field);
        }
        setFields(clone);
        field?.onChange?.(!checked);
    };

    const handleRadioClick = (checked, index) => {
        let clone = [...fields];
        const field = { ...clone[index] };
        field.value = checked;
        clone[index] = field;
        if (checked == 'Байгууллага') {
            clone = isVisibleRadio(index, clone, true);
        } else {
            clone = isVisibleRadio(index, clone, false);
        }
        setFields(clone);
        field?.onChange?.(checked);
    };

    const getValues = () => {
        const object = {};
        for (const field of fields) {
            if (field.key && !object.hasOwnProperty(field.key)) {
                object[field.key] = field.value;
            }
        }
        return object;
    };

    const hideMessages = () => {

    };

    const updateFields = newFields => {
        setFields(newFields);
    };

    const updateChildField = (options, parentFieldName, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };

        if (options && options.length > 0) {
            for (let i = 0; i < options.length; i++) {
                if (parentFieldName === options[i].name) {
                    clone[index] = options[i];
                    setFields(clone);
                }
            }
        }
    };

    const handleDateChange = (value, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = value;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(value);
    };

    const handleDateTimeChange = (value, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = value;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(value);
    };

    const handleTimeChange = (value, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = value;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(value);
    };

    const handerRangePicker = (dates, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = dates;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(dates);
    };

    return (
        <div>
            <form ref={ref} onSubmit={handleSubmit}>
                {
                    fields?.map((field, index) => {
                        let className = field.type === 'dropdown' ? '' : 'form-control';
                        if (field.inputClassName) {
                            className += ' ' + field.inputClassName
                        }
                        let message = '';
                        let feedbackClassName = '';
                        if (field.showSuccessMessage && field.successMessage) {
                            className = `${className} is-valid`;
                            message = field.successMessage;
                            feedbackClassName = 'valid-feedback';
                        } else if (field.showErrorMessage) {
                            feedbackClassName = 'invalid-feedback';
                            if (field.customErrorMessage) {
                                message = field.customErrorMessage
                            } else if (field.errorMessage) {
                                message = field.errorMessage;
                            }/* else {
                                message = 'Алдаа гарлаа';
                            }*/
                            className = `${className} is-invalid`;
                        }
                        if (field?.type == 'email' && (field?.value != null && field?.value != '')) {
                            if (!validateEmail(field?.value)) {
                                className = `${className} is-invalid`;
                            }
                        }
                        if (field.type === 'jsx') {
                            if (field.value) {
                                if (React.isValidElement(field.value)) {
                                    if (!field.value.key) {
                                        console.error('Please provide key to Value React element.')
                                    }
                                    return field.value;
                                } else {
                                    console.error('Value must be valid React element.');
                                    return null;
                                }
                            } else {
                                console.error('Make sure you provide value.');
                                return null;
                            }
                        }
                        if (field.type === 'text') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={
                                                field.align == 'left'
                                                    ?
                                                    {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        justifyContent: 'flex-end',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                                    :
                                                    {
                                                        display: 'flex',
                                                        flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                            }
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='text'
                                                placeholder={field?.placeHolder || 'Empty placeholder'}
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                                style={field.inputStyle}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'carNumber') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={
                                                field.align == 'left'
                                                    ?
                                                    {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        justifyContent: 'flex-end',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                                    :
                                                    {
                                                        display: 'flex',
                                                        flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                            }
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='text'
                                                placeholder={field?.placeHolder || 'Empty placeholder'}
                                                onChange={(e) => {
                                                    const re = /^([0-9]{0,4})[А-ЯЁӨҮ]{0,3}$/;
                                                    const re2 = /^[0-9]{0,4}$/;
                                                    if (e.target.value === '' || re2.test(e.target.value?.slice(0, 4))) {
                                                        if (e.target.value === '' || re.test(e.target.value?.toUpperCase())) {
                                                            onInputChange(e, index, field.upperCase);
                                                            field?.onChange?.(e, field);
                                                        }
                                                    }
                                                }}
                                                value={field.value}
                                                style={field.inputStyle}
                                            />
                                            <div className='font-mulish fs-14'>
                                                {field?.hintMessage}
                                            </div>
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'email') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={
                                                field.align == 'left'
                                                    ?
                                                    {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        justifyContent: 'flex-end',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                                    :
                                                    {
                                                        display: 'flex',
                                                        flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                            }
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='email'
                                                placeholder={field?.placeHolder || 'Empty placeholder'}
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                                style={field.inputStyle}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'password') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={
                                                field.align == 'left'
                                                    ?
                                                    {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        justifyContent: 'flex-end',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                                    :
                                                    {
                                                        display: 'flex',
                                                        flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }
                                            }
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='password'
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                                style={field.inputStyle}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'inputGroup') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div className="form-input-group input-group" key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            className='input-group'
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <span className="input-group-text">{field.groupLeftText}</span>
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='text'
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                            />
                                            <span className="input-group-text">{field.groupRightText}</span>
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'number') {
                            return (
                                <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                    <label
                                        style={{
                                            display: 'flex',
                                            flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            marginBottom: 0,
                                            width: field?.labelWidth || 'auto',
                                            fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                        }}
                                    >
                                        {field.label}
                                    </label>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                            flexDirection: 'column',
                                            marginLeft: 10,
                                            width: field?.inputWidth || 'auto',
                                        }}
                                    >
                                        <input
                                            disabled={!!field.disabled}
                                            className={className}
                                            min={field?.min}
                                            type='number'
                                            onChange={(e) => {
                                                field?.onChange?.(e, field);
                                                onInputChange(e, index, null, field?.isNoMinus ? field?.isNoMinus : false);
                                            }}
                                            onWheel={(e) => e.target.blur()}
                                            value={field.value}
                                            placeholder={field?.placeHolder || 'Empty placeholder'}
                                        />
                                        <div className={feedbackClassName}>
                                            {message}
                                        </div>
                                    </div>
                                    {
                                        field.inputWidth
                                            ?
                                            null
                                            :
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                    flexDirection: 'column',
                                                    marginLeft: 10,
                                                    width: field?.inputWidth || 'auto',
                                                }}
                                            />
                                    }
                                </div>
                            )
                        }
                        if (field.type === 'numberOnly') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='number'
                                                onChange={(e) => {
                                                    const re = /^[0-9\b]+$/;
                                                    if (e.target.value === '' || re.test(e.target.value)) {
                                                        field?.onChange?.(e, field);
                                                        onInputChange(e, index);
                                                    }
                                                }}
                                                value={field.value}
                                                inputMode='numeric'
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'nonCryllic') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='text'
                                                placeholder={field?.placeHolder || 'Empty placeholder'}
                                                onChange={(e) => {
                                                    const re = /[А-Яа-яЁёӨөҮү№₮]/;
                                                    if (e.target.value === '' || !re.test(e.target.value)) {
                                                        onInputChange(e, index, field.upperCase);
                                                        field?.onChange?.(e, field);
                                                    }
                                                }}
                                                value={field.value}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        // flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                >
                                                    {
                                                        field.isCustomBtn &&
                                                        <Button
                                                            style={{ height: 38 }}
                                                            variant="outline-alternate"
                                                            className='text-uppercase fs-12 br-8 ps-4 pe-4'
                                                            size='sm'
                                                            onClick={field.customBtnEvent}
                                                        >
                                                            {field.customBtnText}
                                                        </Button>
                                                    }
                                                </div>
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'onlyNumber') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='text'
                                                placeholder={field?.placeHolder || 'Empty placeholder'}
                                                onChange={(e) => {
                                                    const re = /^[0-9]*$/;
                                                    if (e.target.value === '' || re.test(e.target.value)) {
                                                        onInputChange(e, index, field.upperCase);
                                                        field?.onChange?.(e, field);
                                                    }
                                                }}
                                                value={field.value}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'fileUpload') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        {/* <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                textOverflow: 'ellipsis', textAlign: 'end'
                                            }}
                                        >
                                            {field.label}
                                        </label> */}
                                        <div
                                            style={{
                                                flexDirection: 'row',
                                                // marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                ref={el => fileUploaderRef.current[index] = el}
                                                style={{ display: 'none' }}
                                                type='file'
                                                accept={field.accept}
                                                multiple={field.multiple}
                                                placeholder={'test'}
                                                onChange={(e) => {
                                                    onFileInputChange(e, index, field.upperCase);
                                                }}
                                                value={field.value}
                                            />
                                            <div className="row">
                                                <div className="col">
                                                    <div className="d-flex flex-row position-relative">
                                                        {fileData && fileData.map((item) => (
                                                            <div key={item.id} xs="auto" className="d-flex align-items-start" style={{ marginLeft: 10 }}>
                                                                <div className="text-center">
                                                                    {item.type === 'image/png' ? (
                                                                        <img
                                                                            src={item.path}
                                                                            alt={`Image ${item.name}`}
                                                                            width="100"
                                                                            height="60"
                                                                            onClick={() => openImageInNewWindow(item.path)}
                                                                        />
                                                                    ) : (
                                                                        <p>{item.name}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {field?.fileType === 'image' ? (
                                                            <img
                                                                style={{ marginLeft: 10 }}
                                                                src={
                                                                    field?.files && field?.fileData
                                                                        ? field?.fileData
                                                                            ? URL?.createObjectURL(field?.fileData)
                                                                            : field?.altImage
                                                                        : field?.altImage
                                                                }
                                                                width="100"
                                                                className={field?.files && field?.fileData ? '' : field?.altImageClass}
                                                                alt={field?.fileNames || 'empty'}
                                                            />
                                                        ) : (
                                                            field.fileNames
                                                        )}
                                                    </div>

                                                </div>
                                            </div>

                                            <br />
                                            <br />
                                            {/* <div className="row">
                                                <div className="col"> */}

                                            <div className="">
                                                {
                                                    field.isExtendedButton
                                                        ?
                                                        <button className={field.isExtendedButtonClass} onClick={() => onFileUploadButtonHandler(index)}>{field?.isExtendedButtonText || ''}</button>
                                                        : null
                                                }
                                                {
                                                    field.clearButton
                                                        ?
                                                        field.fileNames &&
                                                        <Button
                                                            onClick={() => { onFileUploadClearButtonHandler(index) }}
                                                            className={
                                                                field?.isClearButtonClass
                                                                    ?
                                                                    field?.isClearButtonClass
                                                                    :
                                                                    "btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28"
                                                            }
                                                        >
                                                            {field?.isClearButtonText || <i className="flaticon2-cross"> </i>}
                                                        </Button>
                                                        : null
                                                }
                                                {
                                                    field.showErrorMessage
                                                        ?
                                                        <div style={{ color: '#F64E60' }}>
                                                            {field.errorMessage}
                                                        </div>
                                                        : null
                                                }
                                                {/* </div>
                                                </div> */}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'dropdown') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                // marginTop: '1rem',
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <Select
                                                className={className}
                                                onChange={(value, evt) => handleDropdownChange(value, evt, index, field)}
                                                value={field.value}
                                                multiple={!!field.multiple}
                                                searchable={!!field.searchable}
                                                disabled={!!field.disabled}
                                                clearable={!!field.clearable}
                                                options={field.options}
                                            />
                                            <div style={{ display: 'block' }} className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.isExtendedButton
                                                ?
                                                <button className={field.isExtendedButtonClass} onClick={() => handleExtendedButtonChange(index)}>Цэвэрлэх</button>
                                                : null
                                        }
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'checkbox') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: field?.marginTop ? field?.marginTop : '1rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                width: field?.labelWidth || 'auto',
                                                // marginTop: '1rem',
                                                // marginBottom: 0,
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            {
                                                field?.isTooltip ?
                                                    <span className='d-flex flex-row'>
                                                        <Checkbox
                                                            disabled={field.disabled}
                                                            className='custom-cbox'
                                                            checked={!!field.value}
                                                            onChange={() => handleCheckboxClick(!!field.value, index)}
                                                            label={field.label}
                                                        />
                                                        <OverlayTrigger
                                                            // trigger="click"
                                                            placement="right"
                                                            overlay={
                                                                <Popover id="popover-basic">
                                                                    <Popover.Body>
                                                                        {field?.toolTipMessage}
                                                                    </Popover.Body>
                                                                </Popover>
                                                            }
                                                        >
                                                            <HelpOutline className='ms-2 w-18' />
                                                        </OverlayTrigger>
                                                    </span>
                                                    :
                                                    <Checkbox
                                                        disabled={field.disabled}
                                                        className='custom-cbox'
                                                        checked={!!field.value}
                                                        onChange={() => handleCheckboxClick(!!field.value, index)}
                                                        label={field.label}
                                                    />
                                            }
                                            <div style={{ display: 'block' }} className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'radio') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '1rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                width: field?.labelWidth || 'auto',
                                                // marginTop: '1rem',
                                                // marginBottom: 0,
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            {
                                                field.options?.map((option, i) => {
                                                    return <Checkbox
                                                        type='radio'
                                                        className='custom-rbox'
                                                        key={i}
                                                        name={field.key}
                                                        checked={field.value === option}
                                                        onChange={() => handleRadioClick(option, index)}
                                                        label={option}
                                                    />
                                                })
                                            }
                                            <div style={{ display: 'block' }} className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'date') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <DatePicker
                                                className={className}
                                                buttonClassName={`eschool-form-date-picker ${className}`}
                                                value={field.value}
                                                placeholderText={field?.placeholder}
                                                onChange={date => handleDateChange(date, index)}
                                                isCustomButton={field?.dateCustomButton}
                                                includeDates={field.includeDays ? field.includeDays : false}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'datetime') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <DateTimePickerComp
                                                value={field.value}
                                                onChange={date => handleDateTimeChange(date, index)}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'time') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <TimePicker
                                                allowInput={!!field.allowTimeInput}
                                                inputClassName={className}
                                                minStep={5}
                                                value={field.value}
                                                onChange={(val) => handleTimeChange(val, index)}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'daterange') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={field.invisible ? 'd-none' : ''} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            <DatePickerRange
                                                onChange={(val) => handerRangePicker(val, index)}
                                                firstPlaceHolder={field?.firstPlaceHolder}
                                                lastPlaceHolder={field?.lastPlaceHolder}
                                                selectedStartDate={field?.selectedStartDate}
                                                selectedEndDate={field?.selectedEndDate}
                                                isDisabled={field?.disabled}
                                                clearable={field?.clearable}
                                                disableWithFirst={field?.disableWithFirst}
                                                disableWithLast={field?.disableWithLast}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'timerange') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <TimePickerRange
                                                onChange={(val) => handerRangePicker(val, index)}
                                                selectedStartTime={field?.selectedStartTime}
                                                selectedEndTime={field?.selectedEndTime}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'textArea') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '0.8rem' }} className='label-flex-start'>
                                        <label
                                            className='mt-2'
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                            }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <textarea
                                                placeholder={field?.placeholder}
                                                disabled={!!field.disabled}
                                                className={className}
                                                rows={field.rows}
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                                style={field.style}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        return null;
                    })
                }
                <input type='submit' style={{ display: 'none' }} />
            </form>
        </div>
    )
});

export default React.forwardRef(Forms);