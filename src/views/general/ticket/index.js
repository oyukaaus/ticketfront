import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketIndex } from 'utils/fetchRequest/Urls';
import CreateTicket from './modal/create';
import CancelRequest from './modal/cancel';
import EditTicket from './modal/edit'
import classNames from '../../../../node_modules/classnames';


const TicketPage = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [systems, setSystems] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [itemId, setItemId] = useState();
    const [searchInput, setSearchInput] = useState('');
    const types = [{ value: 1, text: 'Алдаа' }, { value: 2, text: 'Санал хүсэлт' }];
    const {placementStatus: { view: placement }} = useSelector((state) => state.menu);
    const MENU_PLACEMENT = {
        Vertical: 'vertical',
        Horizontal: 'horizontal',
    };
    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/ticket/index', text: 'Санал хүсэлт' },

    ];
    useEffect(() => {
        dispatch(setLoading(true));

    }, []);

    const getButtonColor = (type) => {
        switch (type) {
            case 'Шинэ':
                return { backgroundColor: 'green', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: 'blue', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'Хаагдсан':
                return { backgroundColor: 'grey', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'Цуцласан':
                return { backgroundColor: 'red', color: '#FFFFFF', fontFamily: 'Mulish' };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'Mulish' };
        }
    };
    // const [dropdownStates, setDropdownStates] = useState(Array(data.length).fill(false));

    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketIndex, 'POST', {
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setData(res?.tickets);
                    setSystems(res?.systems);
                    const userOption = [];
                    res?.users.map((param) =>
                        userOption.push({
                            id: param?.userId,
                            avatar: param?.avatar,
                        })
                    )
                    setUsers(userOption)
                    console.log('res: ', res)
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                console.log(e);
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    const createRequest = () => {
        setShowCreateTicket(true);
    };

    const cancelTicket = (id) => {
        setItemId(id);
        setShowCancel(true);
    };

    const editTicket = (id) => {
        const filteredData = data.filter(item => item.id === id);
        setSelectedData(filteredData);
        setShowEdit(true);
    };

    const handleSearch = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setSearchInput(inputValue);
        if (inputValue) {
            const filtered = data.filter((item) => {
                return item.description.toLowerCase().indexOf(inputValue) !== -1;
            });
            setData(filtered)
        } else {
            fetchInfo()
        }
    };

    const getSystemName = (systemId) => {
        const system = systems.find((sys) => sys.value === systemId);
        return system ? system.text : 'Unknown System';
    };

    const getUserAvatar = (userId) => {
        const user = users.find((sys) => sys.id === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };

    const getTypeName = (typeId) => {
        const system = types.find((sys) => sys.value === typeId);
        return system ? system.text : 'Unknown Type';
    };

    const cancelFetch = () => {
        console.log(itemId, 'cancelled')
    }

    const NavUserMenuDropdownToggle = React.memo(
        React.forwardRef(({ onClick, expanded = false, user = {} }, ref) =>
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
                <img src="../img/ticket/icon/dot.png" alt="dot-icon" />
            </a>
        ))
    );

    const NavUserMenuDropdownMenu = React.memo(
        React.forwardRef(({ style, className, item }, ref) => {
            return (
                <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
                    <Dropdown.Item onClick={() => history.push(`/ticket/view/${item.id}`)}>
                        <img src="/img/ticket/icon/view.png" alt="dot-icon" className="color-info me-1" />Дэлгэрэнгүй харах
                    </Dropdown.Item>
                    {item.status === 'Шинэ' && (
                        <Dropdown.Item onClick={() => editTicket(item.id)}>
                            <img src="/img/ticket/icon/edit.png" alt="dot-icon" className="color-info me-1" />Хүсэлтээ засах
                        </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={() => cancelTicket(item.id)} >
                        <img src="/img/ticket/icon/x-square.png" alt="dot-icon" className="color-info me-1" />Хүсэлтээ цуцлах
                    </Dropdown.Item>
                </div>
            );
        })
    );
    
    useEffect(() => {
        fetchInfo()
    }, []);
    return (
        <>
            <Row>
                <Col lg={12} className="mb-3">
                    <h2 className='font-standard mb-0'>
                        {t('ticket.idea')}
                        {/* Санал хүсэлт */}
                    </h2>
                    <BreadcrumbList
                        basePath='/'
                        key={1}
                        items={breadcrumbs}
                    />
                </Col>
                <Row>
                    <Col>
                        <Row>
                            <Card>
                                <Card.Body>
                                    <Row className='center'>
                                        <Col lg={3}></Col>
                                        <Col lg={2}>
                                            <img src='../img/ticket/request.png' alt='school-icon' className='color-info me-1' /></Col>
                                        <Col lg={4} className='d-flex align-items-center justify-content-center' style={{ color: '#000000', display: 'flex' }}>
                                            <Row className='d-flex align-items-center'>
                                                <div style={{ textAlign: 'center', color: '#000000', fontFamily: 'Mulish' }}>
                                                    Системтэй холбоотой санал хүсэлт, алдааны мэдээллээ бидэнд илгээнэ үү.
                                                </div>
                                                <div className='ml-auto' style={{ marginTop: 20, textAlign: 'center', fontFamily: 'Mulish' }}>
                                                    <Button style={{ backgroundColor: '#FD7845', fontWeight: 'normal', fontFamily: 'Mulish' }} onClick={createRequest}>Санал хүсэлт илгээх</Button>
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col lg={3}></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}  >
                    <Col style={{ color: '#FD7845', fontSize: 16, fontWeight: 'bolder', fontFamily: 'Mulish' }}>Миний илгээсэн санал хүсэлтүүд</Col>
                    <Col lg={2} className=" ">
                        <input
                            className="form-control datatable-search "
                            value={searchInput}
                            onChange={handleSearch}
                            placeholder="Хайх..."
                            style={{ fontFamily: 'Mulish', width: '104%' }}
                        />
                    </Col>
                </Row>
                {data.map((item, i) => (

                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-3">
                            <Card.Body className="d-flex flex-row align-content-center align-items-center position-relative mb-3">
                                <Col>
                                    <Row>
                                        <Col xs={1} className="text-center">
                                            <Row style={{ display: 'flex' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img className="profile d-inline me-3  rounded-circle" width={70} alt={item.createdUserId} src={getUserAvatar(item.createdUserId) ? `${getUserAvatar(item.createdUserId)}` : '../img/system/default-profile.png'} />
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled
                                                style={getButtonColor(item.status)}
                                            >
                                                {item.status}
                                            </Button>

                                            <div style={{ color: 'black', fontSize: 15, fontWeight: 'semibold', fontFamily: 'Mulish' }}>
                                                {(item.createdDate?.date).replace(/\.\d+$/, '')} | {getTypeName(item.typeId)} | {getSystemName(item.systemId)}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col>
                                            <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold', marginLeft: 40 }}>
                                                #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}> {item.description}</span>
                                            </div>
                                        </Col>

                                    </Row>

                                </Col>
                                <Col xs="1" className="d-flex align-items-start justify-content-end ">
                                    <Dropdown as="div" bsPrefix="user-container d-flex" drop="down">
                                        <Dropdown.Toggle as={NavUserMenuDropdownToggle} />
                                        <Dropdown.Menu
                                            as={(props) => (
                                                <NavUserMenuDropdownMenu {...props} item={item} />
                                            )}
                                            // user={person}
                                            className="dropdown-menu dropdown-menu-end user-menu wide"
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
                            </Card.Body>
                        </Card>
                    </Row>
                ))}
            </Row>
            <Row>
                {
                    showCreateTicket &&
                    <CreateTicket
                        show={showCreateTicket}
                        setShow={setShowCreateTicket}
                        systemList={systems}
                    />
                }
            </Row>
            <Row>
                {
                    showEdit &&
                    <EditTicket
                        selectedData={selectedData}
                        show={showEdit}
                        setShow={setShowEdit}
                        systemList={systems}
                    />
                }
            </Row>
            <Row>
                {
                    showCancel &&
                    <CancelRequest
                        show={showCancel}
                        id={itemId}
                        setShow={setShowCancel}
                        onSubmit={cancelFetch}
                    />
                }
            </Row>
        </>
    );
};

export default TicketPage;
