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
    const [systems, setSystems] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [itemId, setItemId] = useState();
    const [searchInput, setSearchInput] = useState('');
    const types = [{ value: 1, text: 'Алдаа' }, { value: 2, text: 'Санал хүсэлт' }];
    const { placementStatus: { view: placement } } = useSelector((state) => state.menu);
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
                return { backgroundColor: '#FF003D', color: '#FFFFFF', fontFamily: 'Mulish', opacity: 1 };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: '#EDB414', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
            case 'Хаагдсан':
                return { backgroundColor: '#D9D9D9', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
            case 'Цуцласан':
                return { backgroundColor: '#D9D9D9', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
        }
    };
    // const [dropdownStates, setDropdownStates] = useState(Array(data.length).fill(false));

    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketIndex, 'POST', {
            createdBy: createdBy
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
                        <>
                            <Dropdown.Item onClick={() => editTicket(item.id)}>
                                <img src="/img/ticket/icon/edit.png" alt="dot-icon" className="color-info me-1" />Хүсэлтээ засах
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => cancelTicket(item.id)} >
                                <img src="/img/ticket/icon/x-square.png" alt="dot-icon" className="color-info me-1" />Хүсэлтээ цуцлах
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
                                    <Row className='justify-content-center'>
                                        <Col lg={2}></Col>
                                        <Col lg={1}>
                                            <img src='../img/ticket/Group.png' alt='school-icon' className='color-info me-1' /></Col>
                                        <Col lg={8} xs={8} className='d-flex align-items-center justify-content-center'>
                                            <Row className='d-flex align-items-center'>
                                                <div style={{ textAlign: 'center', color: '#000000', fontFamily: 'Mulish', fontSize: 12 }}>
                                                    Системтэй холбоотой санал хүсэлт, алдааны мэдээллээ бидэнд илгээнэ үү.
                                                </div>
                                                <div className='ml-auto' style={{ marginTop: 20, textAlign: 'center', fontFamily: 'Mulish' }}>
                                                    <Button style={{ backgroundColor: '#FD7845', fontWeight: 'normal', fontFamily: 'Mulish' }} onClick={createRequest}>Санал хүсэлт илгээх</Button>
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col lg={1}></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}  >
                    <Col style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}>Миний илгээсэн санал хүсэлтүүд</Col>
                    <Col lg={2} className=" ">
                        <input
                            className="form-control datatable-search "
                            value={searchInput}
                            onChange={handleSearch}
                            placeholder="Хайх..."
                            style={{
                                fontFamily: 'Mulish', width: '104%', color: 'black',
                                opacity: 1,
                            }}
                        />
                    </Col>
                </Row>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-2">
                            <Card.Body className="d-flex flex-row align-content-center align-items-center position-relative mb-3">
                                <Col>
                                    <Row>
                                        <Col xs={1} className="text-center">
                                            <Row style={{ display: 'flex' }}>
                                                <div className="d-flex justify-content-center">
                                                    <img className="profile rounded-circle" width='45' alt={item.createdUserId} src={getUserAvatar(item.createdUserId) ? `${getUserAvatar(item.createdUserId)}` : '../img/system/default-profile.png'} />
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

                                            <div style={{ color: 'black', fontSize: 14, fontFamily: 'Mulish' }}>
                                                {(item.createdDate?.date).replace(/\.\d+$/, '')} <span style={{ color: 'orange', fontWeight: 'bold' }}> | </span> {getTypeName(item.typeId)} <span style={{ color: 'orange', fontWeight: 'bold' }}> | </span> {getSystemName(item.systemId)}
                                            </div>
                                        </Col>
                                        <Col xs="1" className="d-flex align-items-start justify-content-end ">
                                            <Dropdown as="div" bsPrefix="user-container d-flex" drop="down">
                                                <Dropdown.Toggle as={NavUserMenuDropdownToggle} />
                                                <Dropdown.Menu
                                                    as={(props) => (
                                                        <NavUserMenuDropdownMenu {...props} item={item} />
                                                    )}
                                                    className="dropdown-menu dropdown-menu-end user-menu wide"
                                                    style={{
                                                        position: 'absolute',
                                                        transform: 'translate(-130px, 40px)'
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
                                    </Row>
                                    <Row>
                                        <div style={{ textAlign: 'left', color: '#FD7845', fontSize: 14, fontWeight: 'bold' }}>
                                            #{item?.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item?.description}</span>
                                        </div>
                                    </Row>
                                </Col>
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
