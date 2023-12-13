import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, QuestionMark, FilePresent } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import showMessage from "../../../modules/message";
import { setLoading, setSelectedSchool } from '../../../utils/redux/action';

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
    // const { tickets, selectedSchool } = useSelector((state) => state.schoolData);
    const { tickets, selectedSchool } = useSelector((state) => ({
        tickets: [
            // Sample ticket data
            { id: 1, title: 'Ticket 1', description: 'Description for Ticket 1' },
            { id: 2, title: 'Ticket 2', description: 'Description for Ticket 2' },
        ],
        selectedSchool: {
            id: 1,
            name: 'Selected School Name',
        },
    }));
    const [searchValue, setSearchValue] = useState('');
    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
    }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

    useEffect(() => {
        if (!selectedSchool || Object.keys(selectedSchool).length === 0) {
            showMessage(t('errorMessage.selectSchool'))
        }
    }, [])

    const onSearch = (nameKey) => {
        setSearchValue(nameKey)
    }

    const renderData = (obj) => {
        return (
            <li key={`schoolItem.${obj.id}`}
                className="py-2 border-bottom border-separator-light d-flex school-option" onClick={() => {
                    dispatch(setSelectedSchool(obj))
                    dispatch(setLoading(true));

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 100)
                    // 
                }}>
                <span className="label">{obj?.name}</span>
            </li>
        )
    }


    if (tickets && tickets.length > 0) {
        return (
            <Col>
                {/* <a
                ref={ref}
                href="#/"
                className="notification-button ms-5"
                data-toggle="dropdown"
                aria-expanded={expanded}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }}
            > */}
                <div className="position-relative d-inline-flex" >
                    <div className='d-flex align-items-center m-2'>
                        <Link to={{
                            pathname: `/ticket/index`,
                        }}
                        >
                            <img src='../img/ticket/icon/send.png' alt='school-icon' className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish' }}> Санал хүсэлт</span>
                            <img src='../img/ticket/icon/chevron-right.png' alt='school-icon'  className='color-info me-1' />
                        </Link>
                    </div>
                </div>
                <div className="position-relative d-inline-flex m-1">
                    <div className='d-flex align-items-center'>
                        <Link to={{
                            pathname: `/ticket/view/1`,
                        }}
                        >
                            <img src='../img/ticket/icon/book.png' alt='school-icon'  className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish' }}> Гарын авлага</span>
                            <img src='../img/ticket/icon/chevron-right.png' alt='school-icon'  className='color-info me-1' />
                        </Link>
                    </div>
                </div>
                <div className="position-relative d-inline-flex m-1">
                    <div className='d-flex align-items-center'>
                        <Link to={{
                            pathname: `/ticket/index`,
                        }}
                        >
                          <img src='../img/ticket/icon/file-question.png' alt='school-icon'  className='color-info me-1' /><span style={{ color: 'white', fontFamily: 'Mulish' }}>Түгээмэл асуулт</span>
                          <img src='../img/ticket/icon/chevron-right.png' alt='school-icon'  className='color-info me-1' />
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
