import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

/**
 * Use Select.js instead;
 * */

const Dropdown = ({
                      label,
                      options,
                      value = null,
                      onChange,
                      placeholder,
                      multiple,
                      textFieldStyle = {},
                      textFieldClassName = '',
                      ...rest
                  }) => {

    const [ selected, setSelected ] = useState(null);

    useEffect(() => {
        if (multiple) {
            setSelected([]);
        } else {
            setSelected(null);
        }
    }, [multiple]);

    // useEffect(() => {
    //     if (multiple) {
    //         const existingValue = [];
    //         if (selected && selected.constructor === Array && selected.length) {
    //             for (const option of selected) {
    //                 if (option.value) {
    //                     existingValue.push(option.value);
    //                 }
    //             }
    //         }
    //         if (existingValue !== value) {
    //             setSelected(value);
    //         }
    //     } else {
    //         const existingValue = selected?.value || null;
    //         if (existingValue !== value) {
    //             setSelected(value)
    //         }
    //     }
    // }, [value]);

    useEffect(() => {
        let updatedValue;
        if (multiple) {
            updatedValue = [];
            if (selected?.length) {
                const clone = [...selected];
                for (let i = 0; i < selected.length; i++) {
                    const option = { ...clone[i] };
                    if (option.value) {
                        updatedValue.push(option.value);
                    }
                }
            }
        } else {
            updatedValue = selected && selected.value ? selected.value : null;
        }
        onChange?.(updatedValue);
    }, [selected]);

    const handleOnChange = (event, value) => {
        if (multiple) {
            const newValues = value.map(val => {
                return val.value;
            });
            onChange?.(newValues);
        } else {
            onChange?.(value);
        }
        // setSelected(value);
    };

    const getOptionSelected = (option) => {
        if (!value) {
            return false;
        }
        if (value && value.constructor === Array) {
            return value.includes(option.value);
        } else {
            return value === option.value;
        }
    }

    const getValue = () => {
        if (multiple) {
            const array = [];
            if (value?.length) {
                for (const option of options) {
                    if (value.includes(option.value)) {
                        array.push(option)
                    }
                }
                return array;
            } else {
                return [];
            }
        } else {
            if (!value) {
                return null;
            }
            const selectedOption = options.find(option => option.value === value);
            if (selectedOption) {
                return selectedOption
            } else {
                return null;
            }
        }
    }

    return (
        <div style={{ marginTop: label ? '1rem' : 0 }}>
            <Autocomplete
                multiple={multiple}
                size="small"
                style={{ backgroundColor: '#fff' }}
                getOptionSelected={getOptionSelected}
                options={options}
                // value={selected || []}
                // freeSolo
                clearOnBlur={false}
                value={getValue()}
                onChange={handleOnChange}
                popupIcon={<KeyboardArrowDownRoundedIcon style={{ marginTop: 3 }}/>}
                getOptionLabel={(option) => {
                    if (typeof option === 'string' || typeof option === 'number') {
                        return option.toString();
                    }
                    if (option.text) {
                        return option.text;
                    }
                    return '';
                }}
                renderInput={(params) => (
                    <TextField className={textFieldClassName} style={textFieldStyle} {...params} variant="outlined" label={label} placeholder={placeholder} />
                )}
                {...rest}
            />
        </div>
    )
}

export default Dropdown;