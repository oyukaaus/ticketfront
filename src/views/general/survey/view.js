import React, { useEffect, useState } from 'react';
import { Modal, Button, Col, Row } from 'react-bootstrap';

import { Link, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from 'modules/message';
import { fetchRequest } from 'utils/fetchRequest';
import { surveyInfo } from 'utils/fetchRequest/Urls';

import './css/app.css'
import 'css/dashboard.css';

const View = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { selectedSchool } = useSelector((state) => state.schoolData);

    const [data, setData] = useState();
    const [questionTypes, setQuestionTypes] = useState([])

    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(surveyInfo, 'POST', {
            school: selectedSchool?.id,
            survey: id
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setData(res?.survey)
                    setQuestionTypes(res?.questionTypes)
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    useEffect(() => {
        fetchInfo()
    }, []);

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
                            <strong className={`custom-badge ${data?.statusCode === 'DRAFT' ? '' : 'custom-badge-active'}`}>{data?.status}</strong>
                        </Col>
                    </Row>
                    <Row className="mb-1">
                        <Col md={5}>
                            <div className="text-right">{t('common.code')}</div>
                        </Col>
                        <Col md={7}>
                            <strong>{data?.code}</strong>
                        </Col>
                    </Row>
                    <Row className="mb-1">
                        <Col md={5}>
                            <div className="text-right">{t('survey.name')}</div>
                        </Col>
                        <Col md={7}>
                            <strong>{data?.name}</strong>
                        </Col>
                    </Row>
                    <Row className="mb-1">
                        <Col md={5}>
                            <div className="text-right">{t('survey.category')}</div>
                        </Col>
                        <Col md={7}>
                            <strong>{data?.categoryName || '-'}</strong>
                        </Col>
                    </Row>
                    <Row className="mb-1">
                        <Col md={5}>
                            <div className="text-right">{t('survey.date')}</div>
                        </Col>
                        <Col md={7}>
                            <strong>
                                {data && data?.startDate ? data?.startDate : ''} - {data && data?.endDate ? data?.endDate : ''}
                            </strong>
                        </Col>
                    </Row>
                    {/* <Row className="mb-1">
                        <Col md={5}>
                            <div className="text-right">{t('survey.participants')}</div>
                        </Col>
                        <Col md={7}>
                            <strong>?</strong>
                        </Col>
                    </Row> */}

                    <Row className="mb-1">
                        <Col md={5}>
                            <div className="text-right">{t('survey.goal')}</div>
                        </Col>
                        <Col md={7}>
                            <strong>{data?.purpose || '-'}</strong>
                        </Col>
                    </Row>
                </div>
                <div className="my-4 text-right">
                    <strong className="fw-bold font-pd">Нийт: {data?.questions?.length} асуумж</strong>
                </div>
                {data?.questions?.map((q, i) => {
                    const type = questionTypes?.find((tmp) => tmp.id === q.typeId);
                    return (
                        <div className="custom-container mb-4" key={`questions-${i}`}>
                            <div className="custom-q">
                                <span>№{i + 1}.</span>
                                <h4>{q?.question}</h4>
                                <p className="mb-3">{q?.description}</p>
                                <div className="text-red mb-2">{q.isRequired ? 'Заавал хариулт авна' : ''}</div>
                                <div className="mb-2">
                                    Асуумжийн төрөл: <span className="fw-bold">{type?.name}</span>
                                </div>
                                <div className="d-flex flex-column px-4">
                                    {q.answers?.map((a, j) => (
                                        <label className="mb-2" key={`qa-${i}-${j}`}>
                                            {q?.isMultiAnswer ? <input type="checkbox" name={`q-${i}-${j}`} /> : <input type="radio" name={`q-${i}-${j}`} />}
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

export default View;
