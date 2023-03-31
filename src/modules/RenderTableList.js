import React, {useState} from 'react';
import {toAbsoluteUrl} from './_helpers';
import Select from './Form/Select';

const RenderTableList = ({
    stringArray = [],
    lineHeight = null,
    gender = null,
    isImage = false,
    image = null,
    imageWidth = null,
    imageHeight = null,
    firstColNumber = null,
    onInputChange,
    onInputButtonClick,
    onSelectChange,
    reverse = 'right',
    isEdit = false,
    leftStyle = {},
    rightStyle = {},
    className = '',
}) => {
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState(null);

    const handleInputChange = (e, code, index) => {
        onInputChange?.(e.target.value, code, index);
        setInputValue(e.target.value);
    };

    const handlerInputButtonClick = (code) => {
        onInputButtonClick?.(inputValue, code);
    };

    const handlerSelectChange = (value, code) => {
        setSelectValue(value);
        onSelectChange?.(value, code)
    };

    return (
        <div>
            {
                isImage
                ?
                    <div className='row'>
                        <div className='col-12' style={{display: 'flex'}}>
                            <div className='col-3' style={{textAlign: "center"}}>
                                {
                                    isImage
                                    ?
                                        image
                                        ?
                                            <img
                                                src={image}
                                                style={{width: imageWidth || 110, height: imageHeight || 120, borderRadius: 8}}
                                                alt=''
                                            />
                                        :
                                            gender == 'female'
                                            ?
                                                <img
                                                    src={toAbsoluteUrl("/media/users/avatar_female.png")}
                                                    className="img-responsive"
                                                    style={{width: imageWidth || 110, height: imageHeight || 120, borderRadius: 8}}
                                                    alt=''
                                                />
                                            :
                                                <img
                                                    src={toAbsoluteUrl("/media/users/avatar_male.png")}
                                                    className="img-responsive"
                                                    style={{width: imageWidth || 110, height: imageHeight || 120, borderRadius: 8}}
                                                    alt=''
                                                />
                                    : null
                                }
                            </div>
                            <div className='col-9'>
                                <table>
                                    <thead
                                        style={{lineHeight: lineHeight || 1 }}
                                    >
                                    {
                                        stringArray && stringArray.length > 0
                                            ?
                                            stringArray.map((label, index) => {
                                                return(
                                                    <tr key={'key_' + index}>
                                                        <td className='text-right'>{label.name}</td>
                                                        <th className='pl-3'>{label.value}</th>
                                                    </tr>
                                                )
                                            })
                                            : null
                                    }
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                :
                    firstColNumber
                    ?
                        <div className='row'>
                            <div className={'col-' + firstColNumber}>
                            </div>
                            <div className={'col-' + (12 - firstColNumber)}>
                                <table>
                                    <thead
                                        style={{lineHeight: lineHeight || 1 }}
                                    >
                                    {
                                        stringArray && stringArray.length > 0
                                            ?
                                            stringArray.map((label, index) => {
                                                return(
                                                    <tr key={'key_' + index}>
                                                        <td className='text-right aa' style={leftStyle}>{label.name}</td>
                                                        <th className='pl-3' style={rightStyle}>{label.value}</th>
                                                    </tr>
                                                )
                                            })
                                            : null
                                    }
                                    </thead>
                                </table>
                            </div>
                        </div>
                        :
                        <div className='row justify-content-center'>
                            <div className='col-auto'>
                                <table>
                                    <thead
                                        style={{lineHeight: lineHeight || 1 }}
                                    >
                                    {
                                        stringArray && stringArray.length > 0
                                            ?
                                            stringArray.map((label, index) => {
                                                if(label.type == 'input'){
                                                    return(
                                                        <tr key={'key_' + index} className='pt-3'>
                                                            <td className='text-right' style={leftStyle}>{label?.name || ''}</td>
                                                            <th className='pl-3 pt-3 pb-3' style={{display: "flex"}}>
                                                                <input
                                                                    className='form-control'
                                                                    type='text'
                                                                    placeholder={label.placeholder ? label.placeholder : ''}
                                                                    onChange={(e) => {handleInputChange(e, label.code, index)}}
                                                                    value={inputValue}
                                                                />
                                                                {
                                                                    label.isButton ?
                                                                        <div>
                                                                        <button
                                                                            style={{marginTop: '3px'}}
                                                                            type="button"
                                                                            onClick={() => handlerInputButtonClick(label.code)}
                                                                            className="btn btn-info m-btn m-btn--icon m-btn--icon-only m-btn--circle-28 mr-1 btn btn-primary ml-3"
                                                                        >
                                                                            <i className="flaticon-search"/>
                                                                        </button>
                                                                        </div>
                                                                    : null
                                                                }
                                                            </th>
                                                        </tr>
                                                    )
                                                } else if(label.type == 'select'){
                                                    return(
                                                        <tr key={'key_' + index} className='pt-3'>
                                                            <td className='text-right' style={leftStyle}>{label?.name || ''}</td>
                                                            <td className='pl-3 pt-3 pb-3' style={rightStyle}>
                                                                <Select
                                                                    options={label?.options || []}
                                                                    value={selectValue}
                                                                    onChange={(e) => handlerSelectChange(e, label.code)}
                                                                    searchable
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                else {
                                                    return(
                                                        reverse == 'all'
                                                        ?
                                                            label.hidden
                                                            ?
                                                                null
                                                            :
                                                                <tr key={'key_' + index} style={label.style}>
                                                                    <th className='text-right test' style={leftStyle}>{label.name}</th>
                                                                    <th className='pl-3' style={rightStyle}>{label.value}</th>
                                                                </tr>
                                                        : reverse == 'left'
                                                        ?
                                                            label.hidden
                                                            ?
                                                                null
                                                            :
                                                                <tr key={'key_' + index} style={label.style}>
                                                                    <th className='text-right' style={leftStyle}>{label.name}</th>
                                                                    {
                                                                        label.editable
                                                                        ?
                                                                            isEdit
                                                                            ?
                                                                                label.type == 'textarea'
                                                                                ?
                                                                                    <td className='pl-3'>
                                                                                        <textarea
                                                                                            style={label.typeStyle}
                                                                                            className='form-control'
                                                                                            type='text'
                                                                                            placeholder={label.placeholder ? label.placeholder : ''}
                                                                                            onChange={(e) => {handleInputChange(e, label.code, index)}}
                                                                                            value={label.value}
                                                                                        />
                                                                                    </td>
                                                                                :
                                                                                    <td className='pl-3'>
                                                                                        <input
                                                                                            className='form-control'
                                                                                            type='text'
                                                                                            placeholder={label.placeholder ? label.placeholder : ''}
                                                                                            onChange={(e) => {handleInputChange(e, label.code, index)}}
                                                                                            value={label.value}
                                                                                        />
                                                                                    </td>
                                                                            :
                                                                                <td className='pl-3' style={rightStyle}>{label.value}</td>
                                                                        :
                                                                            <td className='pl-3' style={rightStyle}>{label.value}</td>
                                                                    }
                                                                </tr>
                                                        :
                                                            label.hidden
                                                            ?
                                                                null
                                                            :
                                                                <tr key={'key_' + index} style={label.style}>
                                                                    <td 
                                                                        className={className 
                                                                            ? 
                                                                                'text-right ' + className 
                                                                            : 
                                                                                'text-right fs-16'
                                                                        }  
                                                                        style={leftStyle}
                                                                    >
                                                                        {label.name}
                                                                    </td>
                                                                    <th 
                                                                        className={className 
                                                                            ? 
                                                                                'ps-2 font-weight-bold ' + className 
                                                                            : 
                                                                                'ps-2 fs-16 font-weight-bold'
                                                                        } 
                                                                        style={rightStyle}
                                                                    >
                                                                        {label.value}
                                                                    </th>
                                                                </tr>
                                                    )
                                                }
                                            })
                                            : null
                                    }
                                    </thead>
                                </table>
                            </div>
                        </div>
            }
        </div>
    );
};

export default RenderTableList;