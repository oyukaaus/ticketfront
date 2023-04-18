import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Row, Col, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Forms from 'modules/Form/Forms';
import { Link, useHistory, useParams } from 'react-router-dom';
import useData from 'survey/hooks/useData';
import { fetchRequest } from 'utils/fetchRequest';
import { surveyQuestionsIndex, surveyCategoryIndex, surveyQuestionCreate, surveyCreate, surveyQuestionDelete, surveyInfoRoles } from 'utils/fetchRequest/Urls';
import Checkbox from 'modules/Form/Checkbox';
import showMessage from 'modules/message';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import { formatISO } from 'date-fns';
import { BorderColorTwoTone, DeleteTwoTone, AddCircleOutline } from '@mui/icons-material';
import EditQuestion from 'survey/components/questions/EditQuestion';
import LowPriorityRoundedIcon from '@mui/icons-material/LowPriorityRounded';
import DeleteModal from 'modules/DeleteModal';
import { convertDataToTree, convertDataToOptions } from '../Category';
import ChangeOrderModal from './ChangeOrderModal';

const EditSurveyContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { selectedSchool } = useSelector((state) => state.schoolData);
  const { id } = useParams();
  const data = useData();
  console.log('dispatch: ', data);
  const { t } = useTranslation();
  const formRef = useRef();
  const formQuestionnaireRef = useRef();
  const [addAgain, setAddAgain] = useState(false);

  const [saved, setSave] = useState({});

  const [view, setView] = useState('list');

  const [participant, setParticipant] = useState();

  const [surveyData, setSurveyData] = useState();
  const [categories, setCategories] = React.useState([]);
  console.log('surveyData: ', surveyData);

  const [showDelete, setShowDelete] = useState(false);

  const [selectedData, setSelectedData] = useState();

  const [showOrder, setShowOrder] = useState(false);

  const [grades, setGrades] = useState([]);
  const [systemRoles, setSystemRoles] = useState([]);

  const [roles, setRoles] = useState([]);

  const TYPE = data?.survey_types?.find((st) => st.id === participant);



  const fetchCategories = () => {
    // dispatch(setLoading(true));
    const postData = {
      school: selectedSchool?.id,
    };
    fetchRequest(surveyCategoryIndex, 'POST', postData)
      .then((res) => {
        const { success = false, message = null, categories: tmpCategories = [] } = res;

        if (success) {
          setCategories(convertDataToTree(tmpCategories));
        } else {
          showMessage(message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      });
  };

  const fetchInfo = async (surveyId) => {
    dispatch(setLoading(true));
    try {
      const { success, message, ...rest } = await fetchRequest(surveyQuestionsIndex, 'POST', {
        survey_id: surveyId,
      });
      if (success) {
        setSurveyData(rest);
        if (rest.survey?.status_id === 1) {
          history.replace('/survey/index');
        }
        if ((rest.questions || []).length === 0) {
          setView('form-view');
        }
      } else {
        showMessage(message || t('errorMessage.title'));
      }
    } catch (e) {
      showMessage(e.message || t('errorMessage.title'));
    }
    dispatch(setLoading(false));
  };

  const deleteItem = async (itemId) => {
    dispatch(setLoading(true));
    try {
      const res = await fetchRequest(surveyQuestionDelete, 'POST', {
        questions: [itemId],
      });
      if (res?.success) {
        fetchInfo(id);
      } else {
        showMessage(res?.message || t('errorMessage.title'));
      }
    } catch (e) {
      showMessage(e.message || t('errorMessage.title'));
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchInfo(id);
  }, [id]);

  useEffect(() => {
    fetchCategories();
  }, []);



  const fields = [
    {
      key: 'code',
      value: surveyData?.survey?.code || '',
      label: `${t('common.code')}*`,
      type: 'nonCryllic',
      upperCase: true,
      required: true,
      placeHolder: t('errorMessage.enterCode'),
      errorMessage: t('errorMessage.enterCode'),
      labelBold: true,
    },
    {
      key: 'name',
      value: surveyData?.survey?.name || '',
      label: `${t('survey.name')}*`,
      type: 'text',
      required: true,
      placeHolder: t('errorMessage.enterName'),
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
    },
    {
      key: 'category_id',
      value: surveyData?.survey?.category_id || '',
      label: `${t('survey.category')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      options: convertDataToOptions(categories),
    },
    {
      key: 'date',
      value: [{ startDate: surveyData?.survey?.start_date, endDate: surveyData?.survey?.end_date }],
      label: `${t('survey.date')}*`,
      type: 'daterange',
      selectedStartDate: surveyData?.survey?.start_date,
      selectedEndDate: surveyData?.survey?.end_date,
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
    },
    {
      key: 'type_id',
      value: surveyData?.survey?.type_id || '',
      label: `${t('survey.participants')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      options: data?.survey_types?.map((st) => ({
        text: st.name,
        value: st.id,
      })),
      onChange: (value) => {
        setParticipant(value);
      },
    },

    {
      key: 'system_roles',
      value: surveyData?.survey?.system_roles,
      label: `${t('survey.systemRole')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
      hidden: TYPE?.code !== 'TEACHER',
      searchable: true,
      multiple: true,
      options: data?.roles?.map((role) => ({
        text: role.name,
        value: role.id,
      })),
      onChange: setSystemRoles,
    },

    {
      key: 'roles',
      value: surveyData?.survey?.roles,
      label: `${t('survey.workers')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
      hidden: TYPE?.code !== 'TEACHER',
      searchable: true,
      multiple: true,
      options: roles?.map((tmpRole) => ({
        text: `${tmpRole.lastName} ${tmpRole.firstName}`,
        value: tmpRole.id,
      })),
    },

    {
      key: 'grades',
      value: surveyData?.survey?.grades,
      label: `${t('survey.level')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
      hidden: TYPE?.code === 'TEACHER',
      searchable: true,
      multiple: true,
      options: data?.grades?.map((tmpGrade) => ({
        text: tmpGrade.title,
        value: tmpGrade.key,
      })),
      onChange: setGrades,
    },
    {
      key: 'classes',
      value: surveyData?.survey?.classes,
      label: `${t('survey.group')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
      hidden: TYPE?.code === 'TEACHER',
      searchable: true,
      multiple: true,
      options: data?.classes?.classes
        // ?.filter((classes) => {
        //   return grade.includes(classes?.gradeId);
        // })
        ?.map((classes) => ({
          text: classes.class,
          value: classes.id,
        })),
    },
    {
      key: 'purpose',
      value: surveyData?.survey?.purpose || '',
      label: `${t('survey.goal')}*`,
      type: 'textArea',
      required: false,
      labelBold: true,
    },
  ];

  useEffect(() => {
    if (formRef.current) {
      const values = formRef.current?.getValues();
      formRef.current.updateFields(fields?.map((f) => ({ ...f, value: values[f.key] })));
    }
  }, [participant, grades, roles]);

  const [tabKey, setTabKey] = useState('questionnaire');

  const onSaveClick = () => {
    dispatch(setLoading(true));
    if (tabKey === 'general') {
      const [isValid, , values] = formRef.current.validate();
      if (isValid) {
        const [{ startDate, endDate }] = values?.date || [];
        const postData = {
          ...{ school: selectedSchool?.id },
          id,
          code: values.code,
          status_id: '2',
          type_id: values?.type_id,
          start_date: formatISO(new Date(startDate)),
          end_date: formatISO(new Date(endDate)),
          name: values?.name,
          purpose: values?.purpose,
          category_id: values?.category_id,
          system_roles: values?.system_roles,
          roles: values?.roles,
          classes: values?.classes,
          grades: values?.grades,
        };

        console.log('postData: ', postData);

        fetchRequest(surveyCreate, 'POST', postData)
          .then((res) => {
            const { success = false, message = null } = res;
            if (success) {
              console.log('res2: ', res);
              // history.replace(`/survey/view/${res?.survey?.id}/edit`);
              fetchInfo(id);
            } else {
              console.log('res: ', res);
              showMessage(message || t('errorMessage.title'));
            }
            dispatch(setLoading(false));
          })
          .catch((e) => {
            console.log('ERROR: ', e);
            dispatch(setLoading(false));
            showMessage(t('errorMessage.title'));
          });

        formRef.current.updateFields(fields);
      }
    } else if (view === 'form-view') {
      const [isValid, , values] = formQuestionnaireRef.current.validate();
      console.log(isValid, values);
      if (isValid) {
        const postData = {
          survey_id: id,
          questions: [
            {
              // id: '4',
              is_required: !!values?.is_required,
              is_multi_answer: !!values?.is_multi_answer,
              // min_answer_number: 1,
              // max_answer_number: 2,
              question: values?.question,
              order_number: '1',
              description: values?.description,
              type_id: values?.type_id,
              ...saved,
              ...(selectedData ? { id: selectedData.id } : {}),
            },
          ],
        };

        fetchRequest(surveyQuestionCreate, 'post', postData)
          .then((res) => {
            const { success = false, message = null, ...rest } = res;

            if (success) {
              if (addAgain) {
                fetchInfo(id);
                setTabKey('questionnaire');
                setAddAgain(false);
                setSelectedData(null);
              } else {
                fetchInfo(id);
                setView('list');
                setTabKey('questionnaire');
                setSelectedData(null);
              }
            } else {
              showMessage(message || t('errorMessage.title'));
              dispatch(setLoading(false));
            }
          })
          .catch(() => {
            dispatch(setLoading(false));
            showMessage(t('errorMessage.title'));
          });
        // onSubmit({
        //   ...values,
        // });
      }
    }
  };

  const menu = [
    {
      key: 'order',
      title: t('survey.orderAction'),
      icon: <LowPriorityRoundedIcon className="color-info" />,
    },
    {
      key: 'edit',
      title: t('common.edit'),
      icon: <BorderColorTwoTone className="color-info" />,
    },
    {
      key: 'delete',
      title: t('common.delete'),
      icon: <DeleteTwoTone className="color-info" />,
    },
  ];

  const actionToPublish = () => {
    dispatch(setLoading(true));
    fetchRequest(surveyCreate, 'POST', {
      id,
      status_id: '1',
    })
      .then((res) => {
        const { message = null, success = false } = res;
        if (success) {
          history.replace('/survey/index');
          showMessage(message, success);
        } else {
          showMessage(message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      });
  };

  const actionToOrder = (postData) => {
    dispatch(setLoading(true));
    fetchRequest(surveyQuestionCreate, 'POST', postData)
      .then((res) => {
        console.log('wtf: ', postData, res);
        const { message = null, success = false } = res;
        if (success) {
          setShowOrder(false);
          fetchInfo(id);
          showMessage(message, success);
        } else {
          showMessage(message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      });
  };


  useEffect(() => {
    if (systemRoles?.length > 0) {
      const fetchRoles = async () => {
        dispatch(setLoading(true));
        try {
          const res = await fetchRequest(surveyInfoRoles, 'POST', {
            school: selectedSchool?.id,
            roles: systemRoles,
            role: systemRoles[0],
          });
          console.log('res: ', res);
          if (res?.success) {
            setRoles(res?.roles);
          } else {
            showMessage(res?.message || t('errorMessage.title'));
          }
        } catch (e) {
          showMessage(e?.message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      };
      fetchRoles();
    }
  }, [systemRoles]);


  return (
    <>
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
        <Modal.Body className="px-8">
          <Nav variant="tabs" activeKey={tabKey} onSelect={(key, e) => setTabKey(key, e)}>
            <Nav.Item key={'type_' + 1}>
              <Nav.Link eventKey="general">{t('survey.general')}</Nav.Link>
            </Nav.Item>
            <Nav.Item key={'type_' + 2}>
              <Nav.Link eventKey="questionnaire">{t('survey.questionnaire')}</Nav.Link>
            </Nav.Item>
          </Nav>
          {tabKey === 'general' && <Forms ref={formRef} fields={fields} />}
          {tabKey === 'questionnaire' && (
            <>
              {view === 'list' ? (
                <>
                  <Button
                    onClick={() => {
                      setView('form-view');
                    }}
                    type="button"
                    variant="info"
                    size="sm"
                    className="text-uppercase mt-4 br-8"
                  >
                    <span className="m-0 font-weight-bold d-flex align-items-center">
                      <AddCircleOutline className="w-19" />
                      &nbsp;{t('survey.questionnaire')}&nbsp;
                      {t('common.create')}
                    </span>
                  </Button>

                  {surveyData?.questions
                    ?.sort((a, b) => {
                      if (a.order_number < b.order_number) {
                        return -1;
                      }
                      if (a.order_number > b.order_number) {
                        return 1;
                      }
                      return 0;
                    })
                    .map((q, i) => {
                      const type = data?.question_types?.find((tmp) => tmp.id === q.type_id);
                      return (
                        <div className="custom-container mb-4" key={`questions-${surveyData?.questions?.length}-${i}`}>
                          <OverlayTrigger
                            trigger="click"
                            placement="left-start"
                            overlay={
                              <Popover id={`popover-${i}`} className="custom-popover">
                                <Popover.Body>
                                  {menu?.map((m) => (
                                    <div
                                      className="dt-cm-item"
                                      key={m.key}
                                      onClick={() => {
                                        if (m.key === 'delete') {
                                          setSelectedData(q);
                                          setShowDelete(true);
                                        } else if (m.key === 'edit') {
                                          setSelectedData(q);
                                          setView('form-view');
                                        } else if (m.key === 'order') {
                                          setShowOrder(true);
                                        }
                                      }}
                                    >
                                      <div>{m.icon ? m.icon : null}</div>
                                      <span className="grey-color">{m.title}</span>
                                    </div>
                                  ))}
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <div className="btn-more-container">
                              <button type="button" className="btn-more">
                                <img src="/assets/dots.png" alt="dots" />
                              </button>
                            </div>
                          </OverlayTrigger>
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
                </>
              ) : (
                <EditQuestion
                  ref={formQuestionnaireRef}
                  key={`questionnaire-form-${surveyData?.questions?.length}`}
                  question_types={data?.question_types}
                  save={setSave}
                  selectedData={selectedData}
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col xs={3}>
              {view === 'form-view' && (
                <Checkbox
                  checked={addAgain}
                  className="custom-cbox"
                  label={t('survey.addAgain')}
                  onChange={() => {
                    setAddAgain(!addAgain);
                  }}
                />
              )}
            </Col>
            <Col xs={2}></Col>
            <Col>
              {view === 'form-view' && (
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => {
                    setView('list');
                  }}
                >
                  {t('common.back')}
                </Button>
              )}

              <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
                {t('common.save')}
              </Button>

              {view === 'list' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={actionToPublish}
                  className="text-uppercase fs-12 br-8 ps-4 pe-4 custom-green-bg"
                  style={{ marginLeft: 5 }}
                >
                  {t('action.publish')}
                </Button>
              )}
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      {showOrder && surveyData && (
        <ChangeOrderModal
          backdropClassName="custom-nested-modal"
          dialogClassName="custom-nested-modal"
          className="custom-nested-modal"
          show={showOrder}
          setShow={setShowOrder}
          questions={surveyData?.questions || []}
          survey={surveyData?.survey}
          onSubmit={actionToOrder}
        />
      )}

      {showDelete && selectedData && (
        <DeleteModal
          onClose={() => {
            setShowDelete(false);
            setSelectedData(null);
          }}
          onDelete={() => {
            setShowDelete(false);
            setSelectedData(null);
            deleteItem(selectedData.id);
          }}
          title={t('warning.delete')}
          modalSize="md"
          backdropClassName="custom-nested-modal"
          dialogClassName="custom-nested-modal"
          className="custom-nested-modal"
        >
          <p className="font-pd text-black text-center mb-0">
            {t('warning.delete_confirmation')} {t('warning.delete_confirmation_description')}
          </p>
        </DeleteModal>
      )}
    </>
  );
};

export default EditSurveyContainer;
