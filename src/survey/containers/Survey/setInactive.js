import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const SetInactive = ({
    setShow,
    onInactive,
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            show="true"
            onHide={() => setShow(false)}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {t('action.setInactive')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {t('warning.inactive_approve_confirmation')}
            </Modal.Body>
            <Modal.Footer>
                <div className='row'>
                    <div className='col-12 text-center'>
                        <button type='button' onClick={() => setShow(false)} className='btn btn-link bolder'>{t('common.back')}</button>
                        <Button type='button' variant='success btn-danger' onClick={onInactive}>{t('action.setInactive')}</Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default SetInactive;