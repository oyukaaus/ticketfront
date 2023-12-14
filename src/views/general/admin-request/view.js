import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketInfo } from 'utils/fetchRequest/Urls';
import ReplyRequest from '../ticket/modal/reply';
import CloseTicket from '../ticket/modal/close';
import AssignRequest from '../ticket/modal/assign'

const view = (props) => {
    const { match } = props;
    const { id } = match.params;
    const [data, setData] = useState([]);
    const [replyData, setReplyData] = useState([]);
    const [showReplyTicket, setShowReplyTicket] = useState(false);
    const [showCloseTicket, setShowCloseTicket] = useState(false);
    const [showAssignTicket, setShowAssignTicket] = useState(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));

    }, []);

    const getButtonColor = (type) => {
        switch (type) {
            case 'Шинэ':
                return { backgroundColor: '#FF003D', color: '#FFFFFF' };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: 'green', color: '#FFFFFF' };
            case 'Хаагдсан':
                return { backgroundColor: 'blue', color: '#FFFFFF' };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000' }; // Default button color
        }
    };
    const [dropdownStates, setDropdownStates] = useState([]);
    const [dropdownStatesSecond, setDropdownStatesSecond] = useState([]);

    const ticketAssign = () => {
        setShowAssignTicket(true);
    };

    const ticketReply = () => {
        setShowReplyTicket(true);
    };

    const ticketClose = () => {
        setShowCloseTicket(true);
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
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    useEffect(() => {
        setDropdownStates(new Array(data.length).fill(false));
    }, [data]);

    const handleDropdownToggle = (i) => {
        console.log('i: ',i)
        const updatedDropdownStates = [...dropdownStates];
        updatedDropdownStates[i] = !updatedDropdownStates[i];
        setDropdownStates(updatedDropdownStates);
    };

    const resetDropdownStates = () => {
        setDropdownStates([]);
    };
    useEffect(() => {
        fetchInfo()
    }, []);
    return (
        <>
            <Row>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-1">
                            <Card.Body>
                                <Row>
                                    <Link to={{ pathname: `/ticket/index` }} style={{ textAlign: 'right', color: '#FD7845', fontSize: 12, fontWeight: 'bold', fontFamily: 'Mulish' }}>
                                        Жагсаалт руу буцах
                                    </Link></Row>
                                <Row className="d-flex flex-row align-content-center align-items-center position-relative mb-">
                                    <Col lg={1} className="text-center flex-row">
                                        <Row style={{ display: 'flex' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <img src="../../img/ticket/avatar.png" alt="school-icon" className="color-info me-1" />
                                            </div>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Button className='position-relative d-inline-flex m-1'
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={getButtonColor(item.status)}
                                                >
                                                    {item.status}
                                                </Button>
                                                <Button className='position-relative d-inline-flex m-1'
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={{ backgroundColor: '#FD7845', fontFamily: 'Mulish' }}
                                                >
                                                    {/* {item.status} */}
                                                    Тестийн сургууль
                                                </Button>
                                                <Button className='position-relative d-inline-flex m-1'
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={{ backgroundColor: '#3B82F6', fontFamily: 'Mulish' }}
                                                >
                                                    {/* {item.status} */}
                                                    Сургалтын менежер, Багш
                                                </Button>
                                                <Button className='position-relative d-inline-flex m-1'
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={{ backgroundColor: '#047857', fontFamily: 'Mulish' }}
                                                >
                                                    {/* {item.status} */}
                                                    99887766
                                                </Button>
                                            </Col>
                                        </Row>

                                        <div style={{ color: 'black', fontSize: 15, fontWeight: 'semibold' }}>
                                            {item.createdDate?.date} | {item.type} | {item.systemId}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div style={{ textAlign: 'left', color: '#FD7845', fontSize: 14, fontWeight: 'bold' }}>
                                            #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item.description}</span>
                                        </div></Col>
                                    <Col xs="1" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
                                        <Dropdown align="end">
                                            <Dropdown.Toggle className="dropdown-toggle dropdown-toggle-split" size="sm"
                                   
                                                style={{ color: '#FD7845', border: '1px solid' }}>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item onClick={() => {
                                                    ticketAssign();
                                                }}> Хариуцагчийг солих</Dropdown.Item>
                                                <Dropdown.Item onClick={() => ticketReply()}> Хариу бичих</Dropdown.Item>
                                                <Dropdown.Item onClick={() => ticketClose()}> Хүсэлтийг хаах</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        {/* </div> */}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Row>
                ))}
            </Row>

            <Row>
                <Col lg={1}></Col>
                {replyData.map((item, i) => (
                    <Col key={i} lg={11}>
                        <Card className="mb-3">
                            <Card.Body className="d-flex flex-row align-content-center align-items-center position-relative mb-3">
                                <Col xs={12}>
                                    <Row>
                                        <Col xs={1} className="text-center">
                                            <Row style={{ display: 'flex' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img src="../../img/ticket/avatar.png" alt="school-icon" className="color-info me-1" />
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
                                                        {item.createdUser} | {item.createdDate?.date} | {item.type} | {item.systemId}
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row xs={11} style={{ width: "100%" }}>
                                        <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold', maxWidth: '100%', fontFamily: 'Mulish' }}>
                                            Хариу тайлбар. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}> {item.description}</span>
                                        </div>
                                    </Row>
                                </Col>

                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row>
                {
                    showAssignTicket &&
                    <AssignRequest
                        selectedId={id}
                        show={showAssignTicket}
                        setShow={setShowAssignTicket}
                    />
                }
            </Row>
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
