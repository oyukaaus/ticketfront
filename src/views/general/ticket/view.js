import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketInfo } from 'utils/fetchRequest/Urls';
import ReplyRequest from './modal/reply';
import CloseTicket from './modal/close'

const view = (props) => {
    const { match } = props;
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
                return { backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'Mulish' }; // Default button color
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
    
    useEffect(() => {
        fetchInfo()
    }, []);
    return (
        <>
            <Row>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-3">
                            <Card.Body className="d-flex flex-row position-relative">
                                <Col>
                                    <Row>
                                        <Col xs={1} className="text-center">
                                            <Row style={{ display: 'flex' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                <img  className="profile d-inline me-3  rounded-circle" width={70} alt={item.createdUser} 
                                                src={getUserAvatar(item.createdUser) ? `${getUserAvatar(item.createdUser)}` : '../img/system/default-profile.png'} />
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
                                            <div style={{ color: 'black', fontSize: 15, fontWeight: 'semibold' }}>
                                            {getUsername(item.createdUser)} | {(item.createdDate?.date).replace(/\.\d+$/, '')} | {item.type} | {getSystemName(item.systemId)}
                                            </div>
                                        </Col>
                                        <Col xs={2} className="d-flex justify-content-end ">
                                            <Row>
                                                <Link to={{ pathname: `/ticket/index` }} style={{ textAlign: 'center', color: '#FD7845', fontSize: 12, fontWeight: 'bold', fontFamily: 'Mulish' }}>
                                                    Жагсаалт руу буцах
                                                </Link></Row>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col>
                                            <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold', marginLeft: 40 }}>
                                                #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}> {item.description}</span>
                                            </div>
                                        </Col>
                                        <Col xs="1" className="d-flex align-items-end justify-content-end ">
                                            <Dropdown align="end">
                                                <Dropdown.Toggle className="dropdown-toggle dropdown-toggle-split" size="sm" style={{ color: '#FD7845', border: '1px solid' }}>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {(item.status === 'Шинэ' || item.status === "eSchool хүлээж авсан") && (
                                                        <Dropdown.Item onClick={() => ticketReply()}> Хариу бичих
                                                        </Dropdown.Item>
                                                    )}
                                                    <Dropdown.Item onClick={() => ticketClose()}> Хүсэлтийг хаах
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex align-items-end justify-content-end " >
                                        <Col lg={1}>
                                            {item.files && item.files.map((dtlItem, index) => (
                                                <div key={index} className="text-center">
                                                    <img src={dtlItem.path} alt={`Image ${index}`} width='100' onClick={() => openImageInNewWindow(dtlItem.path)} />
                                                    {/* {dtlItem.name} */}
                                                </div>
                                            ))}
                                        </Col>
                                        <Col lg={11}></Col>
                                    </Row>
                                </Col>
                            </Card.Body>
                        </Card>
                    </Row>

                ))}
            </Row>

            {replyData.map((item, i) => (
                <Row key={i} style={{width:'100.8%'}}>
                    <Col lg={1}></Col>
                    <Col className="mb-3">
                        <Card className="mb-3">
                            <Card.Body className="d-flex flex-row position-relative">
                                <Col xs={12}>
                                    <Row>
                                        <Col xs={1} className="text-center">
                                            <Row style={{ display: 'flex' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                <img  className="profile d-inline me-3  rounded-circle" width={70} alt={item.createdUser} 
                                                src={getUserAvatar(item.createdUser) ? `${getUserAvatar(item.createdUser)}` : '../img/system/default-profile.png'} />
                                                </div>
                                            </Row>

                                        </Col>
                                        <Col xs={10}>
                                            <Row>
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
                                                        {getUsername(item.createdUser)} | {(item.createdDate?.date).replace(/\.\d+$/, '')}
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Col>
                                        <Col xs="1" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
                                        </Col>
                                    </Row>
                                    <Row xs={11} style={{ width: "100%" }}>
                                        <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold', maxWidth: '100%', fontFamily: 'Mulish' }}>
                                            Хариу тайлбар. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}> {item.description}</span>
                                        </div>
                                    </Row>
                                    <Row className="d-flex align-items-end justify-content-end " >
                                        <Col lg={1}>
                                            {item.file && item.file.map((dItem, index) => (
                                                <div key={index} className="text-center">
                                                    <img src={dItem.path} alt={`Image ${index}`} width='100' onClick={() => openImageInNewWindow(dItem.path)} />
                                                    {/* {dItem.name} */}
                                                </div>
                                            ))}
                                        </Col>
                                        <Col lg={11}></Col>
                                    </Row>
                                </Col>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

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
