import React from 'react';
import { Modal, Button, Col, Row, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { format } from 'date-fns';

import { Link } from 'react-router-dom';

const SurveyViewContainer = () => {
  const { t } = useTranslation();

  return (
    <Modal fullscreen show={true} size="xl" animation={false} backdropClassName="full-page-bg" dialogClassName="custom-full-page-modal">
      <Modal.Header>
        <Modal.Title className="fs-16 d-flex justify-content-between w-100 align-items-center">
          <span>{t('survey.title')}</span>
          <Link to="/survey/index">
            <Button size="sm" variant="link">
              {t('common.back')}
            </Button>
          </Link>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <div className="custom-container">
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.status')}</div>
            </Col>
            <Col md={7}>
              <strong className="custom-badge">Идэвхгүй</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('common.code')}</div>
            </Col>
            <Col md={7}>
              <strong>SU872928</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.name')}</div>
            </Col>
            <Col md={7}>
              <strong>Судалгаа 1</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.category')}</div>
            </Col>
            <Col md={7}>
              <strong>Сургалтын судалгаа</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.date')}</div>
            </Col>
            <Col md={7}>
              <strong>
                {format(new Date(), 'yyyy-MM-dd hh:mm')} - {format(new Date(), 'yyyy-MM-dd hh:mm')}
              </strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.participants')}</div>
            </Col>
            <Col md={7}>
              <strong>23 | Түвшин 1 | Түвшин 2 | Түвшин 3 | 1A 1Б 2А</strong>
            </Col>
          </Row>

          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.goal')}</div>
            </Col>
            <Col md={7}>
              <strong>Ерөнхий мэдлэг</strong>
            </Col>
          </Row>
        </div>
        <div className="my-4 text-right">
          <strong className="fw-bold font-pd">Нийт: {1} асуумж</strong>
        </div>
        <div className="custom-container">
          {new Array(1).fill(0).map((_, i) => (
            <div key={`a-${i}`} className="custom-q">
              <span>№{i + 1}.</span>
              <h4>Асуужийн текст {i + 1}</h4>
              <p className="mb-3">Асуумжийн тайлбар</p>
              <div className="text-red mb-2">Заавал хариулт авна</div>
              <div className='mb-2'>
                Асуумжийн төрөл: <span className="fw-bold">Сонголтоос сонгох</span>
              </div>
              <div className="d-flex flex-column px-4">
                <label className='mb-2'>
                  <input type="radio" name="op" /> Сонголт 1
                </label>
                <label className='mb-2'>
                  <input type="radio" name="op" /> Сонголт 2
                </label>
                <label className='mb-2'>
                  <input type="radio" name="op" /> Сонголт 3
                </label>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <Link to="/survey/index">
            <Button size="sm" variant="link">
              {t('common.close')}
            </Button>
          </Link>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SurveyViewContainer;
