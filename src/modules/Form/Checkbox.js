/* eslint-disable */
import React from 'react';
import { FormCheck } from "react-bootstrap";

const Checkbox = ({
    className = '',
    checked = false,
    label,
    onChange,
    ...rest
}) => {
    const handleClick = () => {
        !rest.disabled && onChange?.(checked);
    };

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
            <FormCheck
                id={'test'}
                checked={checked}
                {...rest}
                onChange={handleClick}
                className={'custom-cbox'}
            />
            {
                label && (
                    <span htmlFor={'test'} onClick={handleClick} className='ms-2' style={{ cursor: 'pointer', userSelect: 'none' }}>{label}</span>
                )
            }
        </div>
    )
};

export default Checkbox;