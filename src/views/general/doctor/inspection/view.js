import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import 'css/addInvoice.css';
import "react-image-crop/dist/ReactCrop.css";

const view = ({
    show,
    setShow,
    newRequest
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='md'
            className='modal-dialog-custom'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
                    {t('doctorsCorner.inspectionTime')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Row className='gx-0 mx-3'>
                    <Col md={12}>
                        <div className='ps-3 p-2 br-8 border-custom-orange'>
                            <Row>
                                <Col xs={2} className='d-flex align-items-center'>
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
                </Row>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button
                    onClick={() => setShow(false)}
                    size='sm'
                    variant="outline-dark"
                    className='px-5 br-8'
                >
                    {t('common.close')}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default view;