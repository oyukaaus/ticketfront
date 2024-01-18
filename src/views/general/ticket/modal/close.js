import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketClose } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';

const CloseTicket = ({selectedId, show, setShow }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedRating, setSelectedRating] = useState(0);
    const { person } = useSelector((state) => state.auth);
    const handleRatingClick = (rating) => {
        setSelectedRating(rating);
    };
    const onSaveClick = () => {
        if(selectedRating !=0){
        const postData = {
            ticketId: selectedId,
            statusId: 3,
            rating: selectedRating,
            updatedUser: person.id
        };
        console.log('id: ',selectedId)
        fetchRequest(ticketClose, 'POST', postData)
        .then((res) => {
            const { success = false, message = null } = res;
            if (success) {
                window.location.reload();
                showMessage(message, true);
            } else {
                showMessage(message || t('errorMessage.title'));
            }
            dispatch(setLoading(false));
        })
        .catch((e) => {
            console.log('e', e)
            dispatch(setLoading(false));
            showMessage(t('errorMessage.title'));
        });
    } else {
        showMessage('Үнэлгээ өгнө үү.');
    }
    };

    return (
        <Modal centered show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="fs-16">{t('ticket.close')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>

                <Col>
                    <Row lg={12} className='d-flex justify-content-center'>
                        Та хүсэлтээ хаахдаа итгэлтэй байна уу? Нэгэнт хаасан хүсэлтийг дахин сэргээх боломжгүйг анхаараарай.
                    </Row>
                    <Row lg={12} className='d-flex justify-content-center'>
                        Та манай үйлчилгээнд оноо өгнө үү.
                    </Row>
                    <Row className='m-3'>
                        <Col lg={4}></Col>
                        <Col onClick={() => handleRatingClick(1)}>
                            <Row>
                                {(selectedRating === 0 ||selectedRating === 2 ||selectedRating === 3 ||selectedRating === 4  ||selectedRating === 5) && (
                                    <img
                                        height='50%'
                                        src='../../img/ticket/icon/f1.png'
                                        alt='school-icon'
                                    />
                                )}
                                {selectedRating === 1 && (
                                    <img
                                        height='50%'
                                        src='../../img/ticket/icon/f11.png'
                                        alt='school-icon'
                                    />
                                )}
                            </Row>
                            <Row className='center' style={{ color: '#000000', fontWeight: 'bold', fontSize: 12 }}>
                                Маш муу
                            </Row>
                        </Col>

                        <Col onClick={() => handleRatingClick(2)}>
                            {(selectedRating === 0  ||selectedRating === 1 ||selectedRating === 3 ||selectedRating === 4  ||selectedRating === 5)&& (
                                <img
                                    height='50%'
                                    src='../../img/ticket/icon/f2.png'
                                    alt='school-icon'
                                />
                            )}
                            {selectedRating === 2 && (
                                <img
                                    height='50%'
                                    src='../../img/ticket/icon/f12.png'
                                    alt='school-icon'
                                />
                            )}
                        </Col>
                        <Col onClick={() => handleRatingClick(3)}>
                            {(selectedRating === 0 ||selectedRating === 1 ||selectedRating === 2 ||selectedRating === 4  ||selectedRating === 5) && (
                                <img
                                    height='50%'
                                    src='../../img/ticket/icon/f3.png'
                                    alt='school-icon'
                                />
                            )}
                            {selectedRating === 3 && (
                                <img
                                    height='50%'
                                    src='../../img/ticket/icon/f13.png'
                                    alt='school-icon'
                                />
                            )}
                        </Col>
                        <Col onClick={() => handleRatingClick(4)}>
                            {(selectedRating === 0 ||selectedRating === 1 ||selectedRating === 2 ||selectedRating === 3  ||selectedRating === 5) && (
                                <img
                                    height='50%'
                                    src='../../img/ticket/icon/f4.png'
                                    alt='school-icon'
                                />
                            )}
                            {selectedRating === 4 && (
                                <img
                                    height='50%'
                                    src='../../img/ticket/icon/f14.png'
                                    alt='school-icon'
                                />
                            )}
                        </Col>
                        <Col onClick={() => handleRatingClick(5)}>
                            <Row>
                                {(selectedRating === 0  ||selectedRating === 1 ||selectedRating === 2 ||selectedRating === 3 ||selectedRating === 4)  && (
                                    <img
                                        height='50%'
                                        src='../../img/ticket/icon/f5.png'
                                        alt='school-icon'
                                    />
                                )}
                                {selectedRating === 5 && (
                                    <img
                                        height='50%'
                                        src='../../img/ticket/icon/f15.png'
                                        alt='school-icon'
                                    />
                                )}
                            </Row>
                            <Row className='center' style={{ color: '#000000', fontWeight: 'bold', fontSize: 12 }}>
                                Маш сайн
                            </Row>
                        </Col>
                        <Col lg={4}></Col>
                    </Row>

                </Col>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button onClick={() => setShow(false)} size="sm" variant="link">
                        {t('common.back')}
                    </Button>
                    <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
                        {t('common.send')}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CloseTicket;
