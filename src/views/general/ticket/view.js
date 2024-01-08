import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketInfo } from 'utils/fetchRequest/Urls';
import ReplyRequest from './modal/reply';
import CloseTicket from './modal/close'
import classNames from '../../../../node_modules/classnames';

const view = (outerProps) => {
    const { match } = outerProps;
    const { id } = match.params;
    const [data, setData] = useState([]);
    const [systems, setSystems] = useState([]);
    const [replyData, setReplyData] = useState([]);
    const [users, setUsers] = useState([]);
    // const [files, setFiles] = useState([]);
    const [showReplyTicket, setShowReplyTicket] = useState(false);
    const [showCloseTicket, setShowCloseTicket] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { placementStatus: { view: placement } } = useSelector((state) => state.menu);
    const MENU_PLACEMENT = {
        Vertical: 'vertical',
        Horizontal: 'horizontal',
    };
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

    const ticketReply = () => {
        setShowReplyTicket(true);
    };

    const ticketClose = () => {
        setShowCloseTicket(true);
    };

    const openImageInNewWindow = (path) => {
        window.open(path, '_blank');
    };

    const getSystemName = (systemId) => {
        const system = systems.find((sys) => sys.value === systemId);
        return system ? system.text : 'Unknown System';
    };
    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketInfo, 'POST', {
            ticketId: id
        })
            .then((res) => {
                console.log('res: ', res)
                const { success = false, message = null } = res;
                if (success) {
                    setData(res?.ticket);
                    // setFiles(res?.ticket?.files);
                    setSystems(res?.systems)
                    setReplyData(res?.ticketDtlList);
                    const userOption = [];
                    res?.users.map((param) =>
                        userOption.push({
                            id: param?.userId,
                            avatar: param?.avatar,
                            name: param?.username
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


    const getUserAvatar = (userId) => {
        const user = users.find((sys) => sys.id === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };

    const getUsername = (userId) => {
        const user = users.find((sys) => sys.id === userId);
        return user ? user.name : 'Unknown user';
    };
    const truncatedDescription = (description) => {
        return description.length > 122 ? `${description.slice(0, 122)}...` : description;
    };
    const NavUserMenuDropdownMenu = React.memo(
        React.forwardRef(({ style, className, item }, ref) => {
            return (
                <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
                    {(item.status === 'Шинэ' || item.status === "eSchool хүлээж авсан") && (
                        <Dropdown.Item onClick={() => ticketReply()}>
                            <img src="/img/ticket/icon/file-input.png" alt="dot-icon" className="color-info me-1" />Хариу бичих
                        </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={() => ticketClose()}> <img src="/img/ticket/icon/file-check-2.png" alt="dot-icon" className="color-info me-1" />Хүсэлтийг хаах
                    </Dropdown.Item>
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
                <img src="/img/ticket/icon/dot.png" alt="dot-icon" />
            </a>
        ))
    );
    useEffect(() => {
        fetchInfo()
    }, []);
    return (
        <>
            <>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-3">
                            <Card.Body>
                                <div className="d-flex " style={{ marginTop: 10 }} >
                                    <Col lg={1}>
                                        <img className="profile d-inline me-3  rounded-circle" width='50' alt={item.createdUser}
                                            src={getUserAvatar(item.createdUser) ? `${getUserAvatar(item.createdUser)}` : '../img/system/default-profile.png'} />
                                    </Col>
                                    <Col lg={11}>
                                    <Row className="d-flex flex-row align-content-center align-items-center position-relative ">
                                    <Col className="d-flex align-items-start justify-content-start ">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={getButtonColor(item.status)}
                                                >
                                                    {item.status}
                                                </Button>
                                            </Col>
                                            <Col className="d-flex align-items-end justify-content-end ">
                                                <Link to={{ pathname: `/ticket/index` }} style={{ textAlign: 'center', color: '#FD7845', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}>
                                                    Жагсаалт руу буцах
                                                </Link>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div style={{ color: 'black', fontSize: 14 }}>
                                                <div>
                                                    {getUsername(item.createdUser)} <span style={{ color: 'orange', fontWeight: 'bold' }}> | </span>{' '}
                                                    {(item.createdDate?.date).replace(/\.\d+$/, '')} <span style={{ color: 'orange', fontWeight: 'bold' }}> | </span>{item.type} <span style={{ color: 'orange', fontWeight: 'bold' }}> | </span>{' '}
                                                    {getSystemName(item.systemId)}
                                                </div>

                                            </div>
                                        </Row>
                                    </Col>
                                </div>
                                <div style={{ marginTop: 10 }} >
                                    <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold' }}>
                                        #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}> {item.description}</span>
                                    </div>
                                </div>
                                <div className="d-flex " style={{ marginTop: 10 }} >
                                    <Col lg={11}>
                                        <Row>
                                            {item.files && item.files.map((dtem, index) => (
                                                <Col key={index} xs="auto" className="d-flex align-items-start">
                                                    <div className="text-center">
                                                        <img
                                                            src={dtem.path}
                                                            alt={`Image ${index}`}
                                                            width='100' height='70'
                                                            onClick={() => openImageInNewWindow(dtem.path)}
                                                        />
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>

                                </div>
                                <Row className="d-flex align-items-end justify-content-end " >
                                <Col lg={1} className="d-flex align-items-end justify-content-end ">
                                        <Dropdown as="div" bsPrefix="user-container d-flex" drop="down">
                                            <Dropdown.Toggle as={NavUserMenuDropdownToggle} />
                                            <Dropdown.Menu
                                                as={(props) => (
                                                    <NavUserMenuDropdownMenu {...props} item={item} />
                                                )}
                                                // user={person}
                                                className="dropdown-menu dropdown-menu-start wide"
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
                            </Card.Body>
                        </Card>
                    </Row>

                ))}
            </>

            {replyData.map((item, i) => (
                <div key={i} style={{ marginLeft: '5%', width: '95.6%' }}>
                     <Card className="mb-3">
                            <Card.Body>
                                <div className="d-flex " style={{ marginTop: 10 }} >
                                    <Col lg={1}>
                                        <img className="profile d-inline me-3  rounded-circle" width='50' alt={item.createdUser}
                                            src={getUserAvatar(item.createdUser) ? `${getUserAvatar(item.createdUser)}` : '../img/system/default-profile.png'} />
                                    </Col>
                                    <Col lg={11}>
                                        <Row>
                                            <Col lg={1}>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={getButtonColor(item.status)}
                                                >
                                                    {item.status}
                                                </Button>
                                            </Col>
                                            <Col lg={11} className="d-flex align-items-center justify-content-end ">
                                                {/* <Link to={{ pathname: `/ticket/index` }} style={{ textAlign: 'center', color: '#FD7845', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}>
                                                    Жагсаалт руу буцах
                                                </Link> */}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div style={{ color: 'black', fontSize: 14 }}>
                                                <div>
                                                    {getUsername(item.createdUser)} <span style={{ color: 'orange', fontWeight: 'bold' }}> | </span>{' '}
                                                    {(item.createdDate?.date).replace(/\.\d+$/, '')} 
                                                </div>

                                            </div>
                                        </Row>
                                    </Col>
                                </div>
                                <div style={{ marginTop: 10 }} >
                                    <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold' }}>
                                        #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}> {item.description}</span>
                                    </div>
                                </div>
                                <div className="d-flex " style={{ marginTop: 10 }} >
                                    <Col lg={11}>
                                        <Row>
                                            {item.file && item.file.map((dtem, index) => (
                                                <Col key={index} xs="auto" className="d-flex align-items-start">
                                                    <div className="text-center">
                                                        <img
                                                            src={dtem.path}
                                                            alt={`Image ${index}`}
                                                            width='100' height='70'
                                                            onClick={() => openImageInNewWindow(dtem.path)}
                                                        />
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>

                                   
                                </div>
                            </Card.Body>
                        </Card>
                </div>

            ))}
            <Row>
                {
                    showReplyTicket &&
                    <ReplyRequest
                        selectedId={id}
                        show={showReplyTicket}
                        setShow={setShowReplyTicket}
                    />
                }
            </Row>
            <Row>
                {
                    showCloseTicket &&
                    <CloseTicket
                        selectedId={id}
                        show={showCloseTicket}
                        setShow={setShowCloseTicket}
                    />
                }
            </Row>
        </>
    );
};

export default view;
