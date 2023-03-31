/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { useTranslation } from "react-i18next";

const Checkbox = ({ children, ...props }) => (
    <label style={{ marginRight: '1em' }}>
        <input type="checkbox" {...props} />
        {children}
    </label>
);

const Select = ({
    className = '',
    disabled = false,
    clearable = true,
    searchable = false,
    multiple = false,
    value = null,
    onChange,
    onInputChange,
    options = [],
    ...rest
}) => {
    const { t } = useTranslation();

    const [inputQuery, setInputQuery] = useState('');

    const handleChange = (value, evt) => {
        if (evt?.action === 'select-option' || evt?.action === 'remove-value') {
            if (value?.constructor === Array) {
                const values = value.map(option => option.value);
                onChange?.(values, evt, value);
            } else {
                if (value) {
                    const id = value.value;
                    onChange?.(id, evt, value)
                } else {
                    onChange?.(multiple ? [] :null, evt, value)
                }
            }
        } else if(evt?.action === 'clear')
        {
            onChange?.(null, evt, null)
        }
    };

    const handleInputChange = (inputValue, actionMeta) => {
        setInputQuery(inputValue);
        onInputChange?.(inputValue);
    };

    const getIsSelected = option => {
        if (value) {
            if (value.constructor === Array) {
                return value.includes(option.value);
            } else if (typeof value === 'number') {
                return value === option.value;
            } else if (typeof value === 'string') {
                return value === option.value;
            } else {
                return false;
            }
        }
        return false;
    };

    const getValue = () => {
        if (!value) {
            return null;
        }
        if (multiple) {
            const array = [];
            for (const option of options) {
                if (value.includes(option.value)) {
                    array.push(option);
                }
            }
            return array;
        } else {
            const array = [];
            for (const option of options) {
                if (value == option.value) {
                    array.push(option);
                }
            }
            if (array) {
                return array;
            }
            return null;
        }
    };

    const filterOptions = (options = []) => {
        let filterOptions = [];
        if (inputQuery && inputQuery.length > 0) {
            for (let o = 0; o < options.length; o++) {
                if (options[o].text?.toLowerCase().includes(inputQuery.toLowerCase())) {
                    filterOptions.push(options[o]);
                }
            }
        } else {
            filterOptions = options;
        }
        return filterOptions;
    }

    return (
        <>
            <ReactSelect
                className={`eschool-select ${className}`}
                closeMenuOnSelect={!multiple}
                isDisabled={disabled}
                isClearable={clearable}
                isSearchable={searchable}
                isMulti={multiple}
                value={getValue()}
                onChange={handleChange}
                onInputChange={handleInputChange}
                inputValue={inputQuery}
                options={filterOptions(options)}
                getOptionLabel={option => option?.text || '-'}
                isOptionSelected={getIsSelected}
                placeholder={rest?.placeholder || `${t('common.select')}...`}
                {...rest}
            />
        </>
    )
};

export default Select;