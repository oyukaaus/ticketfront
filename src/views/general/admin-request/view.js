import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketInfo } from 'utils/fetchRequest/Urls';
import CloseTicket from '../ticket/modal/close';
import AssignRequest from '../ticket/modal/assign';
import ShowStatusLog from '../ticket/modal/showStatusLog';
import classNames from '../../../../node_modules/classnames';
import ReplyAdmin from '../ticket/modal/adminReply';

const view = (outerProps) => {
    const { match } = outerProps;
    const { id } = match.params;
    const [data, setData] = useState([]);
    const { schools } = useSelector(state => state.schoolData);
    const schoolData = [];
    schools.map((param) =>
        schoolData.push({
            value: param?.id,
            text: param?.name,
            longName: param?.longName,
        })
    )
    const [replyData, setReplyData] = useState([]);
    const [showReplyTicket, setShowReplyTicket] = useState(false);
    const [showCloseTicket, setShowCloseTicket] = useState(false);
    const [showAssignTicket, setShowAssignTicket] = useState(false);
    const [showStatusLog, setShowStatusLog] = useState(false);
    const [users, setUsers] = useState([]);
    const [systems, setSystems] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [userlist, setUserList] = useState([]);
    const [statuses, setStatusList] = useState([]);
    const [statusId, setStatusId] = useState('')
    const [createdUsers, setCreatedUsers] = useState([]);
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

    const ticketAssign = () => {
        setShowAssignTicket(true);
    };

    const ticketReply = () => {
        setShowReplyTicket(true);
    };

    const ticketClose = () => {
        setShowCloseTicket(true);
    };

    // const statusLogShow = () => {
    //     setShowStatusLog(true);
    // };

    const openImageInNewWindow = (path) => {
        window.open(path, '_blank');
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
                    setReplyData(res?.ticketDtlList);
                    setUsers(res?.users);
                    setAssignees(res?.assignees);
                    setSystems(res?.systems);
                    setStatusId(res?.ticket[0].statusId)
                    setStatusList(res?.statuses);
                    setCreatedUsers(res?.users);
                    const userOption = [];
                    res?.assignees.map((param) =>
                        userOption.push({
                            value: param?.userId,
                            text: param?.username,
                        })
                    )
                    setUserList(userOption)
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
        const user = users.find((sys) => sys.userId === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };

    const getAssigneeAvatar = (userId) => {
        const user = assignees.find((sys) => sys.userId === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };

    const getSystemName = (systemId) => {
        const system = systems.find((sys) => sys.value === systemId);
        return system ? system.text : 'Unknown System';
    };

    const getUsername = (userId) => {
        const user = users.find((sys) => sys.userId === userId);
        return user ? user.username : 'Unknown user';
    };

    const truncatedName = (name) => {
        return name.length > 23 ? `${name.slice(0, 23)}.png` : name;
    };
    const getCreatedPhone = (userId) => {
        console.log('userId: ', userId);

        const user = createdUsers.find((sys) => sys.userId === userId);
        console.log('user: ', user)
        return user ? user.phone : 'Unknown Phone';
    };

    const NavUserMenuDropdownMenu = React.memo(
        React.forwardRef(({ style, className, item }, ref) => {
            return (
                <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-start user-menu wide', className)}>
                    {(item.status === 'Шинэ' || item.status === 'eSchool хүлээж авсан') && (

                        <Dropdown.Item onClick={() => ticketAssign()}><img src="../../img/ticket/icon/user-profile-add.png" alt="view-icon" /> <span style={{ color: '#000000', fontSize: 14 }}> Хариуцагчийг солих</span></Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={() => ticketReply()}><img src="../../img/ticket/icon/file-input.png" alt="fileinput-icon" /> <span style={{ color: '#000000', fontSize: 14 }}> Хариу бичих</span></Dropdown.Item>
                    {(item.status === 'Шинэ' || item.status === 'eSchool хүлээж авсан') && (<Dropdown.Item onClick={() => ticketClose()}><img src="../../img/ticket/icon/file-check-2.png" alt="filecheck-icon" /> <span style={{ color: '#000000', fontSize: 14 }}> Хүсэлтийг хаах</span></Dropdown.Item>
                    )}
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
                        <Card className="mb-4">
                            <Card.Body>
                                <Row className='d-flex'>
                                    <div className="d-flex align-items-start justify-content-end admin-view-list">
                                        <Link to={{ pathname: `/admin/index` }} className='list-button-text'>
                                            Жагсаалт руу буцах
                                        </Link>
                                    </div>
                                    <div className='admin-view-img'>
                                        <img className="profile d-inline me-3  rounded-circle" width='50' alt={item.createdUser} src={getUserAvatar(item.createdUser) ? `${getUserAvatar(item.createdUser)}` : '../img/system/default-profile.png'} />
                                    </div>
                                    <div className='admin-view-button'>
                                        <Button className='customButton position-relative d-inline-flex m-1'
                                            type="button"
                                            size="sm"
                                            disabled
                                            style={getButtonColor(item.status)}
                                        >
                                            {item.status}
                                        </Button>
                                        <Button className=' customButton position-relative d-inline-flex m-1'
                                            type="button"
                                            size="sm"
                                            style={{ backgroundColor: 'rgba(253, 120, 69, 0.2)', color: '#000000' }}
                                        >
                                            {item.schoolName}
                                        </Button>
                                        <Button className='customButton position-relative d-inline-flex m-1'
                                            type="button"
                                            size="sm"
                                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#000000' }}
                                        >
                                            {item.userTitle}
                                        </Button>
                                        <Button className=' customButton position-relative d-inline-flex m-1'
                                            type="button"
                                            size="sm"
                                            style={{ backgroundColor: 'rgba(4, 120, 87, 0.2)', color: 'rgba(0, 0, 0, 1)' }}
                                        >
                                            {getCreatedPhone(item.createdUser)}
                                        </Button>
                                        <div className='admin-main-text'>
                                            {item.type} <span style={{ color: '#FD7845', fontWeight: 'bold' }}> | </span> {(item.createdDate?.date).replace(/\.\d+$/, '')} <span style={{ color: '#FD7845', fontWeight: 'bold' }}> | </span>  {getSystemName(item.systemId)}
                                        </div>
                                    </div>

                                </Row>

                                <div className='admin-custom-desc'>
                                    #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item.description}</span>
                                </div>
                                <div className="d-flex align-items-end justify-content-end " >
                                    <Col>
                                        {item?.files && item?.files.map((dtlItem, index) => (
                                            <Button key={index} variant="default" className='image-show' size="sm" onClick={() => openImageInNewWindow(dtlItem.path)} >
                                                <img src='/img/ticket/icon/image.png' alt='school-icon' className='color-info me-1' /> <span style={{ color: 'black', }}>{truncatedName(dtlItem.name)}</span>
                                            </Button>
                                        ))}
                                    </Col>
                                </div>
                                <Row className="d-flex align-items-end justify-content-end " >
                                    <Col className="d-flex align-items-end justify-content-end ">
                                        <img className="profile d-inline me-3  rounded-circle" width='50' alt={item.assigneeId}
                                            src={getAssigneeAvatar(item.assigneeId) ? `${getAssigneeAvatar(item.assigneeId)}` : '../img/system/default-profile.png'} />
                                        <Dropdown as="div" bsPrefix="user-container d-flex" drop="down">
                                            <Dropdown.Toggle as={NavUserMenuDropdownToggle} />
                                            <Dropdown.Menu
                                                as={(props) => (
                                                    <NavUserMenuDropdownMenu {...props} item={item} />
                                                )}
                                                className="dropdown-menu dropdown-menu-end user-menu wide"
                                                style={{
                                                    position: 'absolute',
                                                    transform: 'translate(-164px, 40.6667px)'
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

            <>
                {replyData.map((item1, i) => (
                    <div key={i} style={{ marginLeft: '5%', width: '95.5%' }}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Row className='d-flex'>
                                    <div className='admin-reply-row'>
                                        <img className="profile d-inline me-3  rounded-circle" width='50' alt={item1.createdUser} src={getUserAvatar(item1.createdUser) ? `${getUserAvatar(item1.createdUser)}` : '../img/system/default-profile.png'} />
                                    </div>

                                    <div className='admin-reply-button' >
                                        {item1.statusLog && item1.statusLog[0] && (
                                            <>
                                                <Button className='position-relative d-inline-flex m-1'
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={getButtonColor(item1.statusLog[0].beforeStatus)}
                                                >
                                                    {item1.statusLog[0].beforeStatus}
                                                </Button>
                                                <img src="../../img/ticket/icon/arrow-right.png" alt="view-icon" />
                                                <Button className='position-relative d-inline-flex m-1'
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={getButtonColor(item1.statusLog[0].afterStatus)}
                                                >
                                                    {item1.statusLog[0].afterStatus}
                                                </Button></>)}
                                        <div className='admin-view-text' >
                                            {getUsername(item1.createdUser)} <span style={{ color: '#FD7845', fontWeight: 'bold' }}> | </span> {(item1.createdDate?.date).replace(/\.\d+$/, '')}
                                        </div>
                                    </div>
                                </Row>

                                <div className='admin-reply-desc'>
                                    Хариу тайлбар. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item1.description}</span>
                                </div>
                                <div className="d-flex align-items-end justify-content-end " >
                                    <Col>
                                        {item1?.file && item1?.file.map((dtlItem, index) => (
                                            <Button key={index} variant="default" style={{ backgroundColor: '#FFFFFF', marginTop: 10, marginLeft: 5, border: '1px solid #979797' }} width="80%" size="sm" onClick={() => openImageInNewWindow(dtlItem.path)} >
                                                <img src='/img/ticket/icon/image.png' alt='school-icon' className='color-info me-1' /> <span style={{ color: 'black', }}>{truncatedName(dtlItem.name)}</span>
                                            </Button>
                                        ))}
                                    </Col>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </>
            <Row>
                {
                    showAssignTicket &&
                    <AssignRequest
                        selectedId={id}
                        userlist={userlist}
                        show={showAssignTicket}
                        setShow={setShowAssignTicket}
                    />
                }
            </Row>
            <Row>
                {
                    showReplyTicket &&
                    <ReplyAdmin
                        selectedId={id}
                        statusId={statusId}
                        statuses={statuses}
                        tag='admin'
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
                        tag='admin'
                        show={showCloseTicket}
                        setShow={setShowCloseTicket}
                    />
                }
            </Row>
            <Row>
                {
                    showStatusLog &&
                    <ShowStatusLog
                        selectedId={id}
                        tag='admin'
                        show={showStatusLog}
                        setShow={setShowStatusLog}
                    />
                }
            </Row>

        </>
    );
};

export default view;
