import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Rating from 'react-rating';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const CloseTicket = ({ show, setShow }) => {
    const { t } = useTranslation();
    const [value1, setValue1] = React.useState(2);
    const onSaveClick = () => {

    };
    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#ff6d75',
        },
        '& .MuiRating-iconHover': {
          color: '#ff3d47',
        },
      });
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
                    <Row lg={12} className='d-flex justify-content-center'>
                        <Col>
                        <Rating
                            initialRating={value1}
                            onChange={setValue1}
                            start={1}
                            stop={5}
                            emptySymbol={<i className="fab fa-facebook-f" />}
                            fullSymbol={<i className="	fa fa-circle" />}
                            />
                        </Col>
                      
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
