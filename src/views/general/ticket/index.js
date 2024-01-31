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
    const { person } = useSelector((state) => state.auth);
    const createdBy = person.id;
    const [data, setData] = useState([]);
    const [consistData, setConsistData] = useState([]);
    const [systems, setSystems] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [itemId, setItemId] = useState();
    const [searchInput, setSearchInput] = useState('');

    const types = [{ value: 1, text: 'Алдаа' }, { value: 2, text: 'Санал хүсэлт' }];

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/ticket/index', text: 'Санал хүсэлт' },

    ];
    const [openDropdown, setOpenDropdown] = useState(null);
    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    const toggleDropdown = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };
    useEffect(() => {
        dispatch(setLoading(true));

    }, []);

    const getButtonColor = (type) => {
        switch (type) {
            case 'Шинэ':
                return { backgroundColor: '#FF003D', color: '#FFFFFF', fontFamily: 'Mulish', opacity: 1, marginLeft: 10 };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: '#EDB414', color: '#000000', fontFamily: 'Mulish', opacity: 1, marginLeft: 10 };
            case 'Хаагдсан':
                return { backgroundColor: '#D9D9D9', color: '#000000', fontFamily: 'Mulish', opacity: 1, marginLeft: 10 };
            case 'Цуцалсан':
                return { backgroundColor: '#D9D9D9', color: '#000000', fontFamily: 'Mulish', opacity: 1, marginLeft: 10 };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'Mulish', opacity: 1, marginLeft: 10 };
        }
    };

    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketIndex, 'POST', {
            createdBy: createdBy
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setData(res?.tickets);
                    setConsistData(res?.tickets)
                    setSystems(res?.systems);
                    const userOption = [];
                    res?.users.map((param) =>
                        userOption.push({
                            id: param?.userId,
                            avatar: param?.avatar,
                        })
                    )
                    setUsers(userOption)
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
        const inputValue = e.target.value.trim(); 
        setSearchInput(inputValue);

        if (inputValue) {
            const filtered = consistData.filter((item) => {
                const idMatch = item.id.toString().includes(inputValue);
                const descriptionMatch = item.description.toLowerCase().includes(inputValue.toLowerCase());
                const usernameMatch = item.createdUser.toLowerCase().includes(inputValue.toLowerCase());
                const phoneMatch = item.phone.toLowerCase().includes(inputValue.toLowerCase());
                return idMatch || descriptionMatch || usernameMatch || phoneMatch;
            });

            setData(filtered);
        } else {
            fetchInfo();
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

    const truncatedDescription = (description) => {
        return description.length > 122 ? `${description.slice(0, 122)}...` : description;
    };

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
                <img src="../img/ticket/icon/dot.png" alt="dot-icon" />
            </a>
        ))
    );

    const NavUserMenuDropdownMenu = React.memo(
        React.forwardRef(({ style, className, item }, ref) => {
            return (
                <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
                    <Dropdown.Item onClick={() => history.push(`/ticket/view/${item.id}`)}>
                        <img src="/img/ticket/icon/view.png" alt="dot-icon" className="color-info me-1" /><span style={{ color: '#000000', fontSize: 14 }}>Дэлгэрэнгүй харах</span>
                    </Dropdown.Item>
                    {item.status === 'Шинэ' && (
                        <>
                            <Dropdown.Item onClick={() => editTicket(item.id)}>
                                <img src="/img/ticket/icon/edit.png" alt="dot-icon" className="color-info me-1" /><span style={{ color: '#000000', fontSize: 14 }}>Хүсэлтээ засах</span>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => cancelTicket(item.id)} >
                                <img src="/img/ticket/icon/x-square.png" alt="dot-icon" className="color-info me-1" /><span style={{ color: '#000000', fontSize: 14 }}>Хүсэлтээ цуцлах</span>
                            </Dropdown.Item>
                        </>
                    )}
                </div>
            );
        })
    );

    useEffect(() => {
        fetchInfo()
    }, []);
    return (
        <>
            <>
                <Col lg={12} className="mb-3">
                    <h2 className='mb-0' style={{ fontSize: 20, color: "#000000" }}>
                        {t('ticket.ticket')}
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
                                    <Row className="new-container">
                                        <div className='new-image d-flex  align-items-end justify-content-end '>
                                            <img src='../img/ticket/Group.png' alt='school-icon' className='color-info me-1' />
                                        </div>
                                        <div className='new-desc d-flex flex-column justify-content-center'>
                                            <div className='new-content' style={{ textAlign: 'center', color: '#000000', fontFamily: 'Mulish', fontSize: 14 }}>
                                                Системтэй холбоотой санал хүсэлт, алдааны мэдээллээ бидэнд илгээнэ үү.
                                            </div>
                                            <div className='new-content' style={{ color: 'black', fontSize: 14, fontWeight: 'semibold', opacity: 1, textAlign: 'center', marginTop: 20 }} >
                                                <Button style={{ backgroundColor: '#FD7845', fontWeight: 'normal', fontFamily: 'Mulish' }} onClick={createRequest}>Санал хүсэлт илгээх</Button>
                                            </div>
                                        </div>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col lg={4} style={{ color: '#FD7845', fontSize: 16, fontWeight: 'bold', fontFamily: 'Mulish' }}>Миний илгээсэн санал хүсэлтүүд</Col>
                    <Col lg={5}></Col>
                    <Col lg={3} className="d-flex align-items-end justify-content-end ">
                        <input
                            className="form-control datatable-search align-items-end justify-content-end "
                            value={searchInput}
                            onChange={handleSearch}
                            // onKeyUp={handleKeyUp}
                            placeholder="Хайх..."
                            style={{ fontFamily: 'Mulish', borderRadius: 10 }}
                        />
                    </Col>
                </Row>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-2">
                            <Card.Body >
                                <Row className='d-flex'>
                                    <div className='ticket-row'>
                                        <img className="profile rounded-circle" width='50' alt={item.createdUserId} src={getUserAvatar(item.createdUserId) ? `${getUserAvatar(item.createdUserId)}` : '../img/system/default-profile.png'} />
                                    </div>
                                    <div className='ticket-button'>
                                        <Button
                                            type="button"
                                            size="sm"
                                            disabled
                                            style={getButtonColor(item.status)}
                                        >
                                            {item.status}
                                        </Button>

                                        <div style={{ color: 'black', fontSize: 14, fontFamily: 'Mulish', marginLeft: 10 }}>
                                            {(item.createdDate?.date).replace(/\.\d+$/, '')} <span style={{ color: '#FD7845', fontWeight: 'bold' }}> | </span> {getTypeName(item.typeId)} <span style={{ color: '#FD7845', fontWeight: 'bold' }}> | </span> {getSystemName(item.systemId)}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start justify-content-end ticket-drop">
                                        <Dropdown as="div" bsPrefix="user-container d-flex" drop="down" show={openDropdown === item.id}
                                            onSelect={closeDropdown}>
                                            <Dropdown.Toggle as={NavUserMenuDropdownToggle} onClick={() => toggleDropdown(item.id)} />
                                            <Dropdown.Menu
                                                as={(props) => (
                                                    <NavUserMenuDropdownMenu {...props} item={item} />
                                                )}
                                                className="dropdown-menu dropdown-menu-end user-menu wide"
                                                style={{
                                                    position: 'absolute',
                                                    transform: 'translate(-140px, 40px)'
                                                }}
                                            />
                                        </Dropdown>
                                    </div>
                                </Row>
                                <div style={{ textAlign: 'left', color: '#FF5B1D', fontSize: 14, fontWeight: 'bold' }}>
                                    #{item?.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {truncatedDescription(item?.description)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Row>
                ))}
            </>
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
