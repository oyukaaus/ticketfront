/* eslint-disable */
import React, { forwardRef } from 'react';
import Picker from 'react-datepicker';
import format from 'date-fns/format';
import { useTranslation } from 'react-i18next';
import mn from './mn';

const CustomInput = forwardRef(({ value, onClick, className = '' }, ref) => {
  const { t } = useTranslation();

    return (
        // eslint-disable-next-line react/button-has-type
        <button onClick={onClick} ref={ref} className={className} style={{ fontSize: value ? undefined : 14 }}>
            {value || t('errorMessage.selectDate')}
        </button>
    )
});

const DatePicker = ({
    buttonClassName = '',
    value,
    onChange,
    isCustomButton,
    ...rest
}) => {
    const handleChange = (date, e) => {
        if(date){
            const formatted = format(date, 'yyyy-MM-dd');
            onChange?.(formatted, date, e);
        }
    };

    return (
        <Picker
            className='me-2'
            locale={mn}
            selected={value ? new Date(value) : null}
            customInput={isCustomButton === false ? false : <CustomInput className={buttonClassName} />}
            dateFormat={'yyyy-MM-dd'}
            onChange={handleChange}
            {...rest}
        />
    );
};

export default DatePicker;