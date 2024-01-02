import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketCancel } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';

const CancelRequest = ({id, show, setShow }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const onSaveClick = () => {
        setShow(false)
        const postData = {
            ticketId: id,
            statusId: 4
        };
        fetchRequest(ticketCancel, 'POST', postData)
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
    };

    return (
        <Modal centered show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="fs-16">{t('common.cancel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Col>
                    <Row lg={12} className='d-flex justify-content-center' style={{ fontWeight: 'bold', fontSize:12 }}>
                        Та хүсэлтээ цуцлахдаа итгэлтэй байна уу? Нэгэнт цуцалсан хүсэлтийг дахин сэргээх боломжгүйг анхаараарай.
                    </Row>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button onClick={() => setShow(false)} size="sm" variant="link">
                        {t('common.cancel')}
                    </Button>
                    <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4 " style={{width:120}} size="sm" onClick={onSaveClick}>
                        {t('ticket.ok')}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelRequest;
