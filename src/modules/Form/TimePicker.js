/* eslint-disable */
import React, { useState } from 'react';
import { ClickAwayListener } from "@material-ui/core";

const TimePicker = ({
    minStep = 1,
    hourStep = 1,
    onChange,
    popoutClassName = '',
    inputClassName = '',
    value = '',
    separator = ':',
    allowInput = false,
}) => {
    const [ open, setOpen ] = useState(false);

    const onButtonClick = action => {
        let hour = 0;
        let minute = 0;
        if (value && typeof value === 'string' &&  value.length === 5) {
            const stringHour = value.substring(0, 2);
            const stringMinute = value.substring(3, 5);
            if (/^\d+$/.test(stringHour)) {
                hour = Number(stringHour);
            }
            if (/^\d+$/.test(stringMinute)) {
                minute = Number(stringMinute);
            }
        }

        switch (action) {
            case 'h-increment': {
                hour = hour + hourStep;
                if (hour > 23) {
                    hour = hour - 24;
                }
                break;
            }
            case 'm-increment': {
                minute = minute + minStep;
                if (minute > 59) {
                    minute = minute - 60;
                }
                break;
            }
            case 'h-decrement': {
                hour = hour - hourStep;
                if (hour < 0) {
                    hour = hour + 24;
                }
                break;
            }
            case 'm-decrement': {
                minute = minute - minStep;
                if (minute < 0) {
                    minute = minute + 60;
                }
                break;
            }
            default: return;
        }
        let newValue = '';
        if (hour < 10) {
            newValue = '0';
        }
        newValue = `${newValue}${hour}${separator}`;
        if (minute < 10) {
            newValue = `${newValue}0`;
        }
        newValue = `${newValue}${minute}`;
        onChange?.(newValue);
    };

    let hour = '00';
    let minute = '00';

    if (value && typeof value === 'string' &&  value.length === 5) {
        const stringHour = value.substring(0, 2);
        const stringMinute = value.substring(3, 5);
        if (/^\d+$/.test(stringHour)) {
            hour = stringHour;
        }
        if (/^\d+$/.test(stringMinute)) {
            minute = stringMinute;
        }
    }

    const handleKeyPress = event => {
        if (allowInput) {
            const { key } = event;
            switch (key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0': {
                    let newValue;
                    if (value) {
                        let newHour = `${value.substring(1, 2)}${value.substring(3, 4)}`;
                        let newMinute = `${value.substring(4, 5)}${key}`;

                        if (Number(newHour) >= 24) {
                            newHour = `1${newHour.substring(1, 2)}`;
                        }

                        if (Number(newMinute) >= 60) {
                            newMinute = `5${newMinute.substring(1, 2)}`;
                        }

                        newValue = `${newHour}${separator}${newMinute}`;
                    } else {
                        newValue = `00${separator}0${key}`;
                    }
                    onChange?.(newValue);
                    break;
                }
                default: {
                    return;
                }
            }
        }
    };

    return (
        <div>
            <input
                className={`eschool-timepicker-input ${open ? 'active' : ''} ${inputClassName}`}
                onClick={(e) => {
                    setOpen(!open)
                    e.target.setSelectionRange(7, 7);
                }}
                onChange={() => {return}}
                value={value ? value : '-- : --'}
                onKeyPress={handleKeyPress}
            />
            {
                open && (
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <div className={`eschool-timepicker-popout ${popoutClassName}`}>
                            <table>
                                <tbody>
                                <tr>
                                    <td><div onClick={() => onButtonClick('h-increment')}><i className="cs-chevron-top"/></div></td>
                                    <td/>
                                    <td><div onClick={() => onButtonClick('m-increment')}><i className="cs-chevron-top"/></div></td>
                                </tr>
                                <tr>
                                    <td>{hour}</td>
                                    <td>{separator}</td>
                                    <td>{minute}</td>
                                </tr>
                                <tr>
                                    <td><div onClick={() => onButtonClick('h-decrement')}><i className="cs-chevron-bottom"/></div></td>
                                    <td/>
                                    <td><div onClick={() =>onButtonClick('m-decrement')}><i className="cs-chevron-bottom"/></div></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </ClickAwayListener>
                )
            }
        </div>
    )
};

export default TimePicker;