import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Dropdown } from 'react-bootstrap';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import showMessage from "../../../modules/message";
import classNames from '../../../../node_modules/classnames';
// const MENU_NAME = 'Tickets';
const TicketMobile = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { placementStatus: { view: placement } } = useSelector((state) => state.menu);
    const MENU_PLACEMENT = {
        Vertical: 'vertical',
        Horizontal: 'horizontal',
    };
    const {
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);
    const { color } = useSelector((state) => state.settings);
    const { tickets, selectedSchool } = useSelector(() => ({
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



    const NavUserMenuDropdownMenu = React.memo(
        React.forwardRef(({ style, className }, ref) => {
            return (
                <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-start user-menu wide', className)}>

                    <Dropdown.Item >
                        <Link to={{ pathname: `/ticket/index`, }}>
                            <img src="../../img/ticket/icon/send.png" alt="view-icon" />  Санал хүсэлт</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Link to={{ pathname: `/admin/index`, }}>
                            <img src="../../img/ticket/icon/book.png" alt="view-icon" /> Admin</Link></Dropdown.Item>
                    <Dropdown.Item>
                        <Link to={{ pathname: `/admin/index`, }}>
                            <img src="../../img/ticket/icon/file-question.png" alt="view-icon" /> Түгээмэл асуулт</Link></Dropdown.Item>

                </div>
            );
        })
    );
    const NavUserMenuDropdownToggle = React.memo(
        React.forwardRef(({ onClick, expanded = false }, ref) =>
        (
            <a
                href='#!'
                style={{ color: '#fff' }}
                ref={ref}
                className="d-flex user position-relative"
                data-toggle="dropdown"
                aria-expanded={expanded}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }}
            >
                <img src="/img/ticket/icon/menu-square.png" alt="dot-icon" />
            </a>
        ))
    );

    if (tickets && tickets.length > 0) {
        return (
            <Col className='d-flex align-items-start justify-content-end'>
                <Dropdown as="div" bsPrefix="user-container d-flex" drop="down">
                    <Dropdown.Toggle as={NavUserMenuDropdownToggle} />
                    <Dropdown.Menu
                        as={(props) => (
                            <NavUserMenuDropdownMenu {...props} />
                        )}
                        className="dropdown-menu dropdown-menu-end user-menu wide"
                        style={{
                            position: 'absolute',
                            transform: 'translate(-200px, 100.6667px)'
                        }}
                        popperConfig={{
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: () => {
                                            if (placement === MENU_PLACEMENT.Horizontal) {
                                                return [0, 7];
                                            }
                                            if (window.innerWidth < 768) {
                                                return [-84, 7];
                                            }

                                            return [-78, 7];
                                        },
                                    },
                                },
                            ],
                        }}
                    />
                </Dropdown>

            </Col>
        );
    } else {
        return <></>;
    }
};
export default React.memo(TicketMobile);
