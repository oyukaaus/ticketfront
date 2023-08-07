import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const DeleteModal = ({ categoryData, show, setShow, onSubmit, categories = [] }) => {
    const { t } = useTranslation();
    
    const onSaveClick = () => {
        
    };

    return (
        <Modal centered show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="fs-16">{t('survey.surveyCategory')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-0">
                <Row>
                    <Col md={12} />
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button onClick={() => setShow(false)} size="sm" variant="link">
                        {t('common.back')}
                    </Button>
                    <Button variant="danger" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
                        {t('common.delete')}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
