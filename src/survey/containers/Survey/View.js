import React, { useEffect, useState } from 'react';
import { Modal, Button, Col, Row } from 'react-bootstrap';

import { format } from 'date-fns';

import { Link, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from 'modules/message';
import { fetchRequest } from 'utils/fetchRequest';
import { surveyQuestionsIndex } from 'utils/fetchRequest/Urls';

import 'css/dashboard.css';
import useData from 'survey/hooks/useData';

const SurveyViewContainer = () => {
  const infoData = useData();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [data, setData] = useState();

  const fetchInfo = async (surveyId) => {
    dispatch(setLoading(true));
    try {
      const { success, message, ...rest } = await fetchRequest(surveyQuestionsIndex, 'POST', {
        survey_id: surveyId,
      });
      if (success) {
        setData(rest);
      } else {
        showMessage(message || t('errorMessage.title'));
      }
    } catch (e) {
      showMessage(e.message || t('errorMessage.title'));
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (id) fetchInfo(id);
  }, [id]);

  console.log('surveyData: ', data);

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
              <strong className={`custom-badge ${data?.survey?.status_code === 'DRAFT' ? '' : 'custom-badge-active'}`}>{data?.survey?.status_name}</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('common.code')}</div>
            </Col>
            <Col md={7}>
              <strong>{data?.survey?.code}</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.name')}</div>
            </Col>
            <Col md={7}>
              <strong>{data?.survey?.name}</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.category')}</div>
            </Col>
            <Col md={7}>
              <strong>{data?.survey?.category_name || '-'}</strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.date')}</div>
            </Col>
            <Col md={7}>
              <strong>
                {data && data?.survey?.start_date && format(new Date(data?.survey?.start_date), 'yyyy-MM-dd hh:mm')} -{' '}
                {data && data?.survey?.end_date && format(new Date(data?.survey?.end_date), 'yyyy-MM-dd hh:mm')}
              </strong>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.participants')}</div>
            </Col>
            <Col md={7}>
              <strong>?</strong>
            </Col>
          </Row>

          <Row className="mb-1">
            <Col md={5}>
              <div className="text-right">{t('survey.goal')}</div>
            </Col>
            <Col md={7}>
              <strong>{data?.survey?.purpose || '-'}</strong>
            </Col>
          </Row>
        </div>
        <div className="my-4 text-right">
          <strong className="fw-bold font-pd">Нийт: {data?.questions?.length} асуумж</strong>
        </div>
        {data?.questions?.map((q, i) => {
          const type = infoData?.question_types?.find((tmp) => tmp.id === q.type_id);
          return (
            <div className="custom-container mb-4" key={`questions-${i}`}>
              <div className="custom-q">
                <span>№{i + 1}.</span>
                <h4>{q?.question}</h4>
                <p className="mb-3">{q?.description}</p>
                <div className="text-red mb-2">{q.is_required ? 'Заавал хариулт авна' : ''}</div>
                <div className="mb-2">
                  Асуумжийн төрөл: <span className="fw-bold">{type?.name}</span>
                </div>
                <div className="d-flex flex-column px-4">
                  {q.answers?.map((a, j) => (
                    <label className="mb-2" key={`qa-${i}-${j}`}>
                      {q?.is_multi_answer ? <input type="checkbox" name={`q-${i}-${j}`} /> : <input type="radio" name={`q-${i}-${j}`} />}
                      {a?.answer}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
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
