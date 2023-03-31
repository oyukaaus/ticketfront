import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import 'css/addInvoice.css';
import "react-image-crop/dist/ReactCrop.css";

const addTicket = ({
    show,
    setShow,
    onSubmit,
    newRequest
}) => {
    const { t } = useTranslation();
    const [note, setNote] = useState('');
    const [isAccepted, setIsAccepted] = useState(false);

    const handleInputChange = (e) => {
        setNote(e.target.value)
    };

    const onSaveClick = () => {
        const postData = {
            appointment: newRequest?.id,
            description: note,
            isAccepted,
        }
        onSubmit(postData)
    };

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
                    {t('appointment.respond')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Row className='gx-0 mx-3'>
                    <Col md={6}>
                        <div className='ps-3 p-2 br-8 border-custom-orange h-100'>
                            <Row>
                                <Col xs={2} className='d-flex align-items-center justify-content-center'>
                                    <img className="profile" alt={newRequest?.firstName || t('system.profilePicture')} src={newRequest?.avatar ? `https://api.eschool.mn/${newRequest?.avatar}` : '../img/system/default-profile.png'} width={65} />
                                </Col>
                                <Col xs={7}>
                                    <Row>
                                        <Col className='pe-0'>
                                            <Button
                                                variant="dark"
                                                style={{ backgroundColor: '#575962' }}
                                                size='sm'
                                                className='br-4 w-100 fs-13'
                                            >
                                                {newRequest?.appointmentDate?.date?.slice(0, 10)}
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                variant="dark"
                                                style={{ backgroundColor: '#575962' }}
                                                size='sm'
                                                className='br-4 w-100 fs-13'
                                            >
                                                {newRequest?.startTime?.date?.slice(11, 16)} - {newRequest?.endTime?.date?.slice(11, 16)}
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row className='fs-13 mt-2'>
                                        <span className='color-grey'>{newRequest?.createdDate?.date?.slice(0, 19)}</span>
                                        <span className='absolute-black'>{newRequest?.className || '-'} | {newRequest?.code || '-'}</span>
                                        <span className='absolute-black'>{newRequest?.lastName} <b className='text-secondary text-uppercase font-weight-bold'>{newRequest?.firstName}</b></span>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className='absolute-black mt-2'>
                                <Col>
                                    {newRequest?.content}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='h-100 ms-2 ps-3 p-2 br-8 border-custom-orange'>
                            <Row className='gx-0 mt-2'>
                                <Col className='d-flex justify-content-center'>
                                    <Button
                                        disabled={isAccepted}
                                        onClick={() => setIsAccepted(true)}
                                        variant="success"
                                        size='sm'
                                        className='br-8 fs-13 px-5'
                                    >
                                        {t('appointment.accept')}
                                    </Button>
                                    <Button
                                        disabled={!isAccepted}
                                        onClick={() => setIsAccepted(false)}
                                        variant="danger"
                                        size='sm'
                                        className='ms-2 br-8 fs-13 px-5'
                                    >
                                        {t('appointment.reject')}
                                    </Button>
                                </Col>
                            </Row>
                            <Row className='gx-0 mt-2'>
                                <Col md='3' className='font-pinnacle-demibold fs-12 text-right label-custom'>
                                    {t('common.description')}
                                </Col>
                                <Col md='8' className='ps-2'>
                                    <textarea
                                        className='form-control'
                                        type='text'
                                        placeholder={t('common.description')}
                                        onChange={(e) => { handleInputChange(e) }}
                                        value={note}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button
                    onClick={() => setShow(false)}
                    size='sm'
                    variant="link"
                >
                    {t('common.back')}
                </Button>
                <Button
                    variant="success"
                    className='text-uppercase fs-12 br-8 ps-4 pe-4'
                    size='sm'
                    onClick={onSaveClick}
                >
                    {t('common.save')}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default addTicket;