import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import showMessage from "../../../modules/message";

// const MENU_NAME = 'Tickets';
const Tickets = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);
    const { color } = useSelector((state) => state.settings);
    const { tickets, selectedSchool } = useSelector((state) => ({
        tickets: [
            { id: 1, title: 'Ticket 1', description: 'Description for Ticket 1' },
            { id: 2, title: 'Ticket 2', description: 'Description for Ticket 2' },
        ],
        selectedSchool: {
            id: 1,
            name: 'Selected School Name',
        },
    }));
    // const [searchValue, setSearchValue] = useState('');
    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
    }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

    useEffect(() => {
        if (!selectedSchool || Object.keys(selectedSchool).length === 0) {
            showMessage(t('errorMessage.selectSchool'))
        }
    }, [])

    if (tickets && tickets.length > 0) {
        return (
            <>
                <div className="position-relative d-inline-flex flex-column" style={{marginLeft:20}}>
                    <div className='d-flex align-items-center m-2'>
                        <Link to={{
                            pathname: `/ticket/index`,
                        }}
                        >
                            <img src='/img/ticket/icon/send.png' alt='icon147' className='color-info me-1' />
                            <span style={{ color: 'white', fontFamily: 'Mulish', fontSize: 14 }}> Санал хүсэлт</span>
                            <img src='/img/ticket/icon/chevron-right.png' alt='icon148' className='color-info me-1' />
                        </Link>
                    </div>
                </div>
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
                <div className="position-relative d-inline-flex flex-column"style={{marginLeft:10}}>
                    <div className='d-flex align-items-center'>
                        <Link to={{
                            pathname: `/ticket/index`,
                        }}
                        >
                            <img src='/img/ticket/icon/file-question.png' alt='icon151' className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish', fontSize: 14 }}>Түгээмэл асуулт</span>
                            <img src='/img/ticket/icon/chevron-right.png' alt='icon152' className='color-info me-1' />
                        </Link>
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
};
export default React.memo(Tickets);
