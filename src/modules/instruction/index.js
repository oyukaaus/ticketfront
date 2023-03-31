import React from 'react';
import { HelpOutline } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const Instruction = () => {
    const { t } = useTranslation();
    return (
        <div
            // style={{ display: 'flex', alignItems: 'center', /*color: '#f64e60', fontWeight: 700*/ }}
            style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
        >
            {/*<HelpOutline
                style={{ fontWeight: 100, marginRight: 10 }}
                fontSize={'large'}
                color={'inherit'}
            />*/}
            <i className="icon-2x text-danger flaticon-questions-circular-button d-inline mr-2"/>
            <span className='text-danger d-inline'>{t('common.helper')}</span>
        </div>
    )
}

export default Instruction;