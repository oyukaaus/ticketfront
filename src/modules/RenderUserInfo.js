import React from 'react';
import {toAbsoluteUrl} from "../../_metronic/_helpers";

const RenderUserInfo = ({
    labels = [],
    isImage = false,
    image = null,
    lineHeight = null,
    imageWidth = null,
    imageHeight = null,
    gender = 'female'
}) => {
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
                                                style={{width: imageWidth ? imageWidth : 110, height: imageHeight ? imageHeight : 120, borderRadius: 8}}
                                                alt=''
                                            />
                                        :
                                            gender == 'male'
                                            ?
                                                <img
                                                    src={toAbsoluteUrl("/media/users/avatar_male.png")}
                                                    className="img-responsive"
                                                    style={{width: imageWidth ? imageWidth : 110, height: imageHeight ? imageHeight : 120, borderRadius: 8}}
                                                    alt=''
                                                />
                                            :
                                                <img
                                                    src={toAbsoluteUrl("/media/users/avatar_female.png")}
                                                    className="img-responsive"
                                                    style={{width: imageWidth ? imageWidth : 110, height: imageHeight ? imageHeight : 120, borderRadius: 8}}
                                                    alt=''
                                                />
                                    : null
                                }
                            </div>
                            <div className='col-9'>
                                <table>
                                    <thead
                                        style={{lineHeight: lineHeight ? lineHeight : 1 }}
                                    >
                                    {
                                        labels && labels.length > 0
                                            ?
                                            labels.map((label, index) => {
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
                    <div className='row'>
                        <div className='col-1'>
                        </div>
                        <div className='col-11'>
                            <table>
                                <thead
                                    style={{lineHeight: lineHeight ? lineHeight : 1 }}
                                >
                                    {
                                        labels && labels.length > 0
                                        ?
                                            labels.map((label, index) => {
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
            }
        </div>
    );
};

export default RenderUserInfo;