import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CancelRequest = ({ show, setShow, onSubmit }) => {
    const { t } = useTranslation();
    const onSaveClick = () => {
        setShow(false)
        window.location.reload();
        onSubmit();
    };

    return (
        <Modal centered show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="fs-16">{t('common.cancel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Col>
                    <Row lg={12} className='d-flex justify-content-center' style={{ fontWeight: 'bold' }}>
                        Та хүсэлтээ цуцлахдаа итгэлтэй байна уу? Нэгэнт цуцалсан хүсэлтийг дахин сэргээх боломжгүйг анхаараарай.
                    </Row>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button onClick={() => setShow(false)} size="sm" variant="link">
                        {t('common.cancel')}
                    </Button>
                    <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
                        {t('common.send')}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelRequest;
