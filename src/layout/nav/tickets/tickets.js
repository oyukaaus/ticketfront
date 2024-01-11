import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { layoutShowingNavMenu } from 'layout/layoutSlice';

const Tickets = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);
    const { color } = useSelector((state) => state.settings);
    const { schools } = useSelector(state => state.schoolData);
    const hasAdminRole = schools && schools.some(school => school.roleCodes.includes("ROLE_ADMIN"));

    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
    }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

    return (
        <>
            <div className="position-relative d-inline-flex flex-column" style={{ marginLeft: 20 }}>
                <div className='d-flex align-items-center m-2'>
                    <Link to={{
                        pathname: `/ticket/index`,
                    }}
                    >
                        <img src='/img/ticket/icon/send.png' alt='icon147' className='color-info me-1' />
                        <span style={{ color: 'white', fontFamily: 'Mulish', fontSize: 14 }}> {t('ticket.ticket')}</span>
                        <img src='/img/ticket/icon/chevron-right.png' alt='icon148' className='color-info me-1' />
                    </Link>
                </div>
            </div>
            {hasAdminRole && (
                <div className="position-relative d-inline-flex flex-column">
                    <div className='d-flex align-items-center'>
                        <Link to={{
                            pathname: `/admin/index`,
                        }}
                        >
                            <img src='/img/ticket/icon/book.png' alt='icon149' className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish', fontSize: 14 }}> Admin</span>
                            <img src='/img/ticket/icon/chevron-right.png' alt='icon150' className='color-info me-1' />
                        </Link>
                    </div>
                </div>
            )}
            <div className="position-relative d-inline-flex flex-column" style={{ marginLeft: 10 }}>
                <div className='d-flex align-items-center'>
                    <Link to={{
                        pathname: `/ticket/index`,
                    }}
                    >
                        <img src='/img/ticket/icon/file-question.png' alt='icon151' className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish', fontSize: 14 }}>{t('ticket.question')}</span>
                        <img src='/img/ticket/icon/chevron-right.png' alt='icon152' className='color-info me-1' />
                    </Link>
                </div>
            </div>
        </>
    );
}
export default React.memo(Tickets);
