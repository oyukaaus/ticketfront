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
            <Col style={{marginLeft: 40}}>
                <div className="position-relative d-inline-flex" >
                    <div className='d-flex align-items-center m-2'>
                        <Link to={{
                            pathname: `/ticket/index`,
                        }}
                        >
                            <img src='/img/ticket/icon/send.png' alt='icon147' className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish' }}> Санал хүсэлт</span>
                            <img src='/img/ticket/icon/chevron-right.png' alt='icon148'  className='color-info me-1' />
                        </Link>
                    </div>
                </div>
                <div className="position-relative d-inline-flex m-1">
                    <div className='d-flex align-items-center'>
                        <Link to={{
                            pathname: `/admin/index`,
                        }}
                        >
                            <img src='/img/ticket/icon/book.png' alt='icon149'  className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish' }}> Admin</span>
                            <img src='/img/ticket/icon/chevron-right.png' alt='icon150'  className='color-info me-1' />
                        </Link>
                    </div>
                </div>
                <div className="position-relative d-inline-flex m-1">
                    <div className='d-flex align-items-center'>
                        <Link to={{
                            pathname: `/ticket/index`,
                        }}
                        >
                          <img src='/img/ticket/icon/file-question.png' alt='icon151'  className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish' }}>Түгээмэл асуулт</span>
                          <img src='/img/ticket/icon/chevron-right.png' alt='icon152'  className='color-info me-1' />
                        </Link>
                    </div>
                </div>
                {/* </a> */}
            </Col>


            // <Dropdown
            //     as="li"
            //     bsPrefix="list-inline-item"
            //     style={{ transform: 'translate(0px, 0px)' }}
            // >
            //     <Dropdown.Toggle as={TicketsDropdownToggle} />
            //     {/* <Dropdown.Menu
            //         className={window.innerWidth < 768 ? 'school-nav-phone mt-5' : 'mt-5'}
            //         style={{ maxHeight: 300, transform: 'translate(209px, 54px) !important' }}
            //         as={TicketsDropdownMenu}
            //     /> */}
            // </Dropdown>
        );
    } else {
        return <></>;
    }
};
export default React.memo(Tickets);
