import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    withStyles,
    OutlinedInput,
    MenuItem
} from "@material-ui/core";
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

const ArrowDown = withStyles({}) (
    (props) => {
        return (
            <KeyboardArrowDownRoundedIcon
                style={{ marginTop: 4 }}
                {...props}
            />
        );
    }
);

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(1),
        },
        display: 'flex',
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#fff',
        border: '1px solid #e5eaee',
        fontSize: '1rem',
        padding: '0.65rem 1rem',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#69b3ff',
            backgroundColor: '#fff',
        },
    },
}))(OutlinedInput);

const DropdownTest = ({
    onChange = () => {},
    label = '',
    options = [],
    value,
    multiple,
    ...rest
                  }) => {
    return (
        <div style={{ marginTop: '1rem' }}>
            <div className={"input"}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel>{options?.length ? label : 'Мэдээлэл олдсонгүй'}</InputLabel>
                    <Select
                        IconComponent={ArrowDown}
                        value={value ? value : multiple ? [] : ''}
                        onChange={(event, child) => {
                            onChange?.(event.target.value, options, event, child);
                        }}
                        input={<BootstrapInput/>}
                        multiple={multiple}
                        {...rest}
                        MenuProps={{
                            getContentAnchorEl: null,
                        }}
                        disabled={!options.length}
                    >
                        {
                            options.map(option => {
                                return (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.text}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}

export default DropdownTest;