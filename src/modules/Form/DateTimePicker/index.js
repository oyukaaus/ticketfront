/* eslint-disable */
import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import format from 'date-fns/format';

const DateTimePickerComp = ({
    value,
    onChange,
    ...rest
}) => {
    const handleChange = (date) => {
        const formatted = format(date, 'y-MM-dd HH:mm');
        onChange?.(formatted, date);
    }

    return (
        <DateTimePicker
            value={value ? new Date(value) : null}
            format={'y-MM-dd HH:mm'}
            onChange={handleChange}
            {...rest}
        />
    );
};

export default DateTimePickerComp;