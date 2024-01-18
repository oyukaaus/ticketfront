/* eslint-disable */
import React, { forwardRef, useState } from 'react';
import { IconButton } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import format from 'date-fns/format';
import DatePicker from 'react-datepicker';
import mn from '../DatePicker/mn';
import { useEffect } from 'react';

const CustomIcon = forwardRef(({ onClick, className = '' }, ref) => {
    return (
        // eslint-disable-next-line react/button-has-type
        <button
            type='button'
            ref={ref}
            className={className}
            onClick={onClick}
            style={{ border: '1px solid #919bc0' }}
        >
            <i className="text-dark-50 flaticon2-calendar-9" />
        </button>
    )
});

const DatePickerRange = ({
    onChange,
    firstPlaceHolder,
    lastPlaceHolder,
    selectedStartDate,
    selectedEndDate,
    placeHolderFontSize,
    isDisabled = false,
    disableWithFirst = false,
    disableWithLast = false,
    clearable = false,
    ...rest
}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // const [mainStartDate, setMainStartDate] = useState(null);
    // const [mainEndDate, setMainEndDate] = useState(null);
    // const [selectionComplete, toggleSelectionComplete] = useState(false);
    const [isMain, setIsMain] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [array] = useState([{
        startDate: null,
        endDate: null,
    }]);

    // const handleDateChange = (date) => {
    //     if (!selectionComplete && !mainStartDate) {
    //         setMainStartDate(date);
    //         toggleSelectionComplete(false)
    //         return;
    //     }

    //     if (!selectionComplete && mainStartDate && !mainEndDate) {
    //         setMainEndDate(date);
    //         toggleSelectionComplete(true);
    //         return;
    //     }

    //     if (selectionComplete && mainStartDate && mainEndDate) {
    //         setMainStartDate(date);
    //         setMainEndDate(undefined);
    //         toggleSelectionComplete(false);
    //     }
    // };

    // const handleSelect = (date) => {
    //     handleDateChange(date);
    //     setIsMain(true);
    // };

    // const handleStartDateChange = (date, e) => {
    //     if (date) {
    //         setIsStart(true);
    //         setStartDate(date);
    //         setMainStartDate(date);
    //         array[0].startDate = format(date, 'yyyy-MM-dd');
    //         onChange(array);
    //     }
    // };
    useEffect(() => {
        if (startDate) {
            // setIsStart(true);
            // setStartDate(startDate);
            // setMainStartDate(startDate);
            array[0].startDate = format(startDate, 'yyyy-MM-dd');
            onChange(array);
        }
    }, [startDate])

    useEffect(() => {
        if (endDate) {
            // setIsEnd(true);
            // setEndDate(endDate);
            // setMainEndDate(endDate);
            array[0].endDate = format(endDate, 'yyyy-MM-dd');
            onChange(array);
        }
    }, [endDate])

    // const handleEndDateChange = (date, e) => {
    //     if (date) {
    //         setIsEnd(true);
    //         setEndDate(date);
    //         setMainEndDate(date);
    //         array[0].endDate = format(date, 'yyyy-MM-dd');
    //         onChange(array);
    //     }
    // };
    const clearDate = () => {
        setStartDate(undefined);
        setEndDate(undefined);
    }
    // const handleMainCalendarClose = () => {
    //     setIsMain(false);
    //     if (mainStartDate) {
    //         setStartDate(mainStartDate);
    //         array[0].startDate = format(mainStartDate, 'yyyy-MM-dd');
    //     }

    //     if (mainEndDate) {
    //         setEndDate(mainEndDate);
    //         array[0].endDate = format(mainEndDate, 'yyyy-MM-dd');
    //     }

    //     onChange(array);
    // };

    const handleFirstCalendarClose = () => {
        setIsStart(false);
    };

    const handleLastCalendarClose = () => {
        setIsEnd(false);
    };

    // const handleCalendarOpen = () => {
    //     setStartDate(undefined);
    //     setEndDate(undefined);
    //     setMainStartDate(undefined);
    //     setMainEndDate(undefined);
    //     toggleSelectionComplete(false);
    //     array[0].startDate = null;
    //     array[0].endDate = null;
    //     onChange(array);
    // };

    const disableOtherDatesWithFirst = (thisDay, howManyMonth = 1) => {
        const thisDayConvert = new Date(thisDay).getTime()
        if (startDate && startDate != null) {
            const startDateConverted = new Date(startDate)
            const startDateTime = new Date(startDate).getTime()
            const oneMonthAfter = startDateConverted.setMonth(startDateConverted.getMonth() + howManyMonth)
            if (startDateTime <= thisDayConvert && thisDayConvert < oneMonthAfter) {
                return ''
            } else {
                return 'disabled-date'
            }
        }
        return ''
    }

    const disableOtherDatesWithLast = (thisDay, howManyMonth = 1) => {
        const thisDayConvert = new Date(thisDay).getTime()
        if (endDate && endDate != null) {
            const endDateConverted = new Date(endDate)
            const endDateTime = new Date(endDate).getTime()
            const oneMonthBefore = endDateConverted.setMonth(endDateConverted.getMonth() - howManyMonth)
            if (endDateTime >= thisDayConvert && thisDayConvert > oneMonthBefore) {
                return ''
            } else {
                return 'disabled-date'
            }
        }
        return ''
    }

    return (
        <div className='date-picker-range-container'>
            <DatePicker
                locale={mn}
                selected={startDate ? new Date(startDate) : startDate ? new Date(startDate) : null}
                onChange={(date) => setStartDate(date)}
                startDate={startDate}
                maxDate={endDate}
                dateFormat='yyyy-MM-dd'
                disabled={isDisabled}
                className='first-datepicker'
                onCalendarClose={handleFirstCalendarClose}
                placeholderText={firstPlaceHolder ? firstPlaceHolder : ''}
                dayClassName={(thisDay) => disableWithLast ? disableOtherDatesWithLast(thisDay, disableWithLast) : ''}
                {...rest}
            />
            <div
                className='d-flex align-items-end justify-content-center'
                style={{
                    width: 80, border: '0.5px solid hsl(0, 0%, 70%)', borderLeft: 'none',
                    borderRight: 'none', backgroundColor: '#EBEDF2', opacity: 0.5, cursor: 'pointer'
                }}
                onClick={clearDate}
            >
                ...
            </div>
            <DatePicker
                locale={mn}
                selected={endDate ? new Date(endDate) : endDate ? new Date(endDate) : null}
                minDate={startDate}
                onChange={(date) => setEndDate(date)}
                endDate={endDate}
                dateFormat='yyyy-MM-dd'
                disabled={isDisabled}
                className='last-datepicker'
                onCalendarClose={handleLastCalendarClose}
                shouldCloseOnSelect={false}
                placeholderText={lastPlaceHolder ? lastPlaceHolder : ''}
                dayClassName={(thisDay) => disableWithFirst ? disableOtherDatesWithFirst(thisDay, disableWithFirst) : ''}
                {...rest}
            />
            {
                clearable ?
                    (startDate && endDate)
                        ? <IconButton
                            style={{
                                padding: '0 8px',
                                marginLeft: 5
                            }}
                            aria-label="Clear"
                            onClick={() => {
                                setStartDate(null);
                                setEndDate(null);
                            }}
                        >
                            <ClearIcon />
                        </IconButton>
                        :
                        <div style={{ marginLeft: 45 }} />
                    :
                    null
            }

        </div>
    );
};

export default DatePickerRange;