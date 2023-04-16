import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DeleteModal = ({
    onClose = () => { },
    children,
    onDelete = () => { },
    title = '',
    btnText = null,
    btnClass = null,
    modalSize = "sm",
    ...rest
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            show="true"
            onHide={onClose}
            size={modalSize}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            {...rest}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <div className='row'>
                    <div className='col-12 text-center'>
                        <button type='button' onClick={onClose} className='btn btn-link bolder'>{t('common.back')}</button>
                        <Button type='button' variant={btnClass || 'success btn-danger'} onClick={onDelete}>{btnText || t('common.delete')}</Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;