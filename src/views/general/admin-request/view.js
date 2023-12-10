import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketIndex } from 'utils/fetchRequest/Urls';

const view = (props) => {
    const [data, setData] = useState([]);
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
                return { backgroundColor: '#FF003D', color: '#FFFFFF' };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: 'green', color: '#FFFFFF' };
            case 'Хаагдсан':
                return { backgroundColor: 'blue', color: '#FFFFFF' };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000' }; // Default button color
        }
    };
    const comment = "Монгол хэл бол манай ард түмний өндөр соёлыг тусгасан баялаг хэл болох тул түүний үгсийн сангийн бүх баялгийг бүртгэн багтаасан бүрэн тайлбар толь гаргах гэвэл төрөл бүрийн ухааны мэрэгжлийн олон хүн, олон жил ажиллаж байж сая бүтээж чадах юм.Ингэхлээр бид монгол хэлний бүрэн тайлбар толь гаргахын наана монгол хэлний тэр их баялгаас давын өмнө чухал хэрэгцээтэй үгс буюу орчин цагийн монголын төв аялгуун дээр тулгуурласан бичгийн хэлний үгсийг ихэвчлэн багтааж үгийн утгын тоймыг тайлбарласан товч тайлбар толь гаргаж нийгмийн хэрэгцээний одоогийн шаардлагыг хангахыг зорьсон билээ.";
    const [value, setValue] = React.useState();
    const [dropdownStates, setDropdownStates] = useState(Array(data.length).fill(false));

    const handleDropdownToggle = (i) => {
        const updatedDropdownStates = [...dropdownStates];
        updatedDropdownStates[i] = !updatedDropdownStates[i];
        setDropdownStates(updatedDropdownStates);
    };

    const ticketReply = () => {
        setShowReplyTicket(true);
    };

    const ticketClose = () => {
        setShowCloseTicket(true);
    };
    
    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketIndex, 'POST', {
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    console.log('res: ', res)
                    setData(res?.tickets);
                    // setData(res?.survey)
                    // setQuestionTypes(res?.questionTypes)
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
                                                    <img src="../../img/system/default-profile.png" alt="school-icon" className="color-info me-1" style={{ maxWidth: '55%', maxHeight: '55%' }} />
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
                                                {item.createdUser} | {item.createdDate?.date} | {item.type} | {item.systemId}
                                            </div>
                                        </Col>
                                        <Col lg={1}>
                                            <Link to={{ pathname: `/ticket/index` }} style={{ textAlign: 'center', color: '#FD7845', fontSize: 12, fontWeight: 'bold' }}>
                                                Жагсаалт руу буцах
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold', marginLeft: 40 }}>
                                            #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item.description}</span>
                                        </div>
                                    </Row>
                                </Col>
                            </Card.Body>
                        </Card>
                    </Row>

                ))}
            </Row>

            <Row>
                <Col lg={1}></Col>
                {data.map((item, i) => (
                    <Col key={i} lg={11}>
                        <Card className="mb-3">
                            <Card.Body className="d-flex flex-row align-content-center align-items-center position-relative mb-3">
                                <Col xs={11}>
                                    <Row>
                                        <Col xs={1} className="text-center">
                                            <Row style={{ display: 'flex' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img src="../../img/system/default-profile.png" alt="school-icon" className="color-info me-1" style={{ maxWidth: '55%', maxHeight: '55%' }} />
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col>
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
                                                    <div style={{ color: 'black', fontSize: 15, fontWeight: 'semibold' }}>
                                                {item.createdUser} | {item.createdDate?.date} | {item.type} | {item.systemId}
                                            </div>
                                                </Col>

                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <div style={{ color: '#FD7845', fontSize: 14, fontWeight: 'bold', maxWidth: '100%' }}>
                                            Хариу тайлбар. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {comment}</span>
                                        </div>
                                    </Row>
                                </Col>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            
        </>
    );
};

export default view;
