import React, { useEffect, useRef, useState } from 'react';
import { Col, Modal, Nav, Button, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import './css/app.css'
import { formatISO } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { setLoading } from 'utils/redux/action';
import { surveyInfo, surveyInit, surveyEdit, surveyPublish, surveyQuestionCreate, surveyQuestionDelete, surveyQuestionOrder } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import { BorderColorTwoTone, DeleteTwoTone, AddCircleOutline } from '@mui/icons-material';
import LowPriorityRoundedIcon from '@mui/icons-material/LowPriorityRounded';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Checkbox from 'modules/Form/Checkbox';

import EditQuestion from 'survey/components/questions/EditQuestion';

import DeleteModal from 'modules/DeleteModal';
import ChangeOrderModal from './modal/ChangeOrderModal';

const Edit = () => {

    const [tabKey, setTabKey] = useState('questionnaire');

    const location = useLocation()

    const { id } = useParams();

    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const formRef = useRef();
    const formQuestionnaireRef = useRef();

    const { selectedSchool } = useSelector((state) => state.schoolData);

    const [isInitial, setIsInitial] = useState(true)

    const [userTypes, setUserTypes] = useState([])
    const [selectedUserType, setSelectedUserType] = useState(null)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [questionTypes, setQuestionTypes] = useState([])

    const [selectedDate, setSelectedDate] = useState(null)
    const [grades, setGrades] = useState([])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [classes, setClasses] = useState([])
    const [selectedClass] = useState(null)
    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [roleUsers, setRoleUsers] = useState([])
    const [selectedUsers] = useState(null)

    const [addAgain, setAddAgain] = useState(false);

    const [view, setView] = useState('list');
    const [surveyData, setSurveyData] = useState();
    const [selectedData, setSelectedData] = useState();

    const [questions, setQuestions] = useState([])

    const [showDelete, setShowDelete] = useState(false);
    const [showOrder, setShowOrder] = useState(false);
    const [saved, setSave] = useState({});

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

    const filterClasses = () => {
        const allClasses = [];
        const selectedGradeIds = selectedGrade || [];
        classes.forEach(classObj => {
            if (selectedGradeIds.indexOf(classObj.grade) > -1) {
                allClasses.push(classObj)
            }
        })
        return allClasses;
    }

    const loadInit = (userType = null, roleIds = []) => {
        dispatch(setLoading(true));
        fetchRequest(surveyInit, 'POST', {
            school: selectedSchool?.id,
            roles: roleIds
        }).then((res) => {
            if (res?.success) {
                setRoles(res?.roles.map(obj => {
                    return {
                        value: obj?.id,
                        text: obj?.name
                    }
                }))
                setGrades(res?.grades.map(obj => {
                    return {
                        value: obj?.key,
                        text: obj?.title
                    }
                }))
                setClasses(res?.classes.map(obj => {
                    return {
                        value: obj?.id,
                        grade: obj?.gradeId,
                        text: obj?.class
                    }
                }))
                setRoleUsers(res?.users.map(userObj => {
                    return {
                        value: userObj.id,
                        text: userObj.firstName + ' (' + userObj.lastName + ' ' + userObj.username + ')'
                    }
                }))
                setSelectedUserType(userType)
            } else {
                showMessage(res?.message || t('errorMessage.title'));
            }
            dispatch(setLoading(false));
        }).catch(e => {
            console.log('e', e)
            dispatch(setLoading(false));
            showMessage(t('errorMessage.title'));
            setSelectedUserType(userType)
        })
    }

    const onRoleChange = (e) => {
        setSelectedRole(e)
        loadInit(selectedUserType, e)
    }

    const onGradeChange = (e) => {
        setSelectedGrade(e)
    }
    const fields = [
        {
            key: 'code',
            value: surveyData?.code,
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
            value: surveyData?.name,
            label: `${t('survey.name')}*`,
            type: 'text',
            required: true,
            placeHolder: t('errorMessage.enterName'),
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
        },
        {
            key: 'category',
            value: selectedCategory,
            label: `${t('survey.category')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            options: categories,
        },
        {
            key: 'date',
            value: selectedDate,
            selectedStartDate: selectedDate?.startDate,
            selectedEndDate: selectedDate?.endDate,
            label: `${t('survey.date')}*`,
            type: 'daterange',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            clearable: true,
            onChange: (dates) => {
                let start = selectedData?.startDate;
                let end = selectedData?.endDate;
                if (dates) {
                    if (dates.length > 0) {
                        start = dates[0]?.startDate || selectedData?.startDate;
                        end = dates[0]?.endDate || selectedData?.endDate;
                    }
                }
                setSelectedDate({
                    startDate: start,
                    endDate: end
                })
            }
        },
        {
            key: 'type',
            value: selectedUserType?.value,
            label: `${t('survey.participants')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            options: userTypes,
            onChange: (value) => {
                const type = userTypes.find(obj => {
                    return obj.value === value
                });
                loadInit(type)
            },
        },
        {
            key: 'role',
            value: selectedRole,
            label: `${t('survey.systemRole')}*`,
            type: 'dropdown',
            required: false,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            hidden: selectedUserType?.code !== 'TEACHER',
            searchable: true,
            multiple: true,
            options: roles,
            onChange: onRoleChange,
        },

        {
            key: 'users',
            value: selectedUsers,
            label: `${t('survey.workers')}*`,
            type: 'dropdown',
            required: false,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            hidden: selectedUserType?.code !== 'TEACHER',
            searchable: true,
            multiple: true,
            options: roleUsers,
        },
        {
            key: 'grades',
            value: selectedGrade,
            label: `${t('survey.level')}*`,
            type: 'dropdown',
            required: false,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            hidden: selectedUserType?.code === 'TEACHER',
            searchable: true,
            multiple: true,
            options: grades,
            onChange: onGradeChange,
        },
        {
            key: 'classes',
            value: selectedClass,
            label: `${t('survey.group')}*`,
            type: 'dropdown',
            required: false,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            hidden: selectedUserType?.code === 'TEACHER',
            searchable: true,
            multiple: true,
            options: filterClasses(),
        },
        {
            key: 'purpose',
            value: surveyData?.purpose,
            label: `${t('survey.goal')}*`,
            type: 'textArea',
            required: false,
            labelBold: true,
        },
    ];

    const updateFields = () => {
        if (formRef && formRef?.current) {
            const values = formRef?.current?.getValues();

            if (isInitial) {
                if (surveyData) {
                    values.code = surveyData?.code;
                    values.name = surveyData?.name;
                    values.purpose = surveyData?.purpose;
                    values.category = surveyData?.category;
                    values.type = surveyData?.type;
                    values.grades = surveyData?.grades;
                    values.classes = surveyData?.classes;
                    values.roles = surveyData?.roles;
                    values.users = surveyData?.users;
                    values.date = [{
                        startDate: surveyData?.startDate,
                        endDate: surveyData?.endDate
                    }];
                }
            } else {
                const userType = userTypes.find(obj => {
                    return obj.value === values?.type
                });

                if (userType?.code === 'TEACHER') {
                    values.classes = []
                    values.grades = []
                } else {
                    values.role = []
                    values.users = []
                }
            }
            formRef?.current?.updateFields(fields?.map((f) => {
                if (f.key === 'date') {
                    f.selectedStartDate = values?.date && values?.date.length > 0 ? values?.date[0]?.startDate : null;
                    f.selectedEndDate = values?.date && values?.date.length > 0 ? values?.date[0]?.endDate : null;
                }
                return {
                    ...f,
                    value: values[f.key]
                }
            }));
        }
    }
    
    const loadInfo = () => {
        dispatch(setLoading(true));
        fetchRequest(surveyInfo, 'POST', {
            school: selectedSchool?.id,
            survey: id
        }).then((res) => {
            if (res?.success) {
                setUserTypes(res?.userTypes || [])
                setSelectedGrade((res?.survey?.grades || []))
                setSelectedCategory(res?.survey?.category)
                setSurveyData(res?.survey)
                setCategories((res?.flatCategories || []).map(obj => {
                    return {
                        value: obj?.id,
                        text: obj?.name
                    }
                }))
                setQuestionTypes(res?.questionTypes)
                setSelectedUserType(res?.survey?.type)
                setSelectedDate({
                    startDate: res?.survey?.startDate,
                    endDate: res?.survey?.endDate
                })

                setQuestions(res?.survey?.questions)

                const type = res?.survey?.userTypes?.find(obj => {
                    return obj.value === res?.survey?.type
                });

                updateFields();
                loadInit(type, res?.survey?.roles)
                setIsInitial(false)
            } else {
                showMessage(res?.message || t('errorMessage.title'));
            }
            dispatch(setLoading(false));
        }).catch(() => {
            dispatch(setLoading(false));
            showMessage(t('errorMessage.title'));
        })
    }

    useEffect(() => {
        loadInfo()
    }, []);

    useEffect(() => {
        updateFields()
    }, [selectedUserType, selectedGrade, roleUsers]);

    const onSaveClick = () => {
        if (tabKey === 'general') {
            const [isValid, , values] = formRef.current.validate();
            if (isValid) {
                const [{ startDate, endDate }] = values?.date || [];
                dispatch(setLoading(true));
                const postData = {
                    school: selectedSchool?.id,
                    id,
                    code: values.code,
                    type: values?.type,
                    startDate: startDate
                        ? formatISO(new Date(startDate))
                        : values?.startDate
                            ? formatISO(new Date(values?.startDate))
                            : formatISO(new Date()),
                    endDate: endDate
                        ? formatISO(new Date(endDate))
                        : values?.endDate
                            ? formatISO(new Date(values?.endDate))
                            : formatISO(new Date()),
                    name: values?.name,
                    purpose: values?.purpose,
                    category: values?.category,
                    roles: values?.role,
                    users: values?.users,
                    classes: values?.classes,
                    grades: values?.grades
                }

                fetchRequest(surveyEdit, 'POST', postData)
                    .then((res) => {
                        const { success = false, message = null } = res;
                        if (success) {
                            showMessage(message);
                        } else {
                            showMessage(message || t('errorMessage.title'));
                        }
                        dispatch(setLoading(false));
                    })
                    .catch((e) => {
                        dispatch(setLoading(false));
                        showMessage(t('errorMessage.title'));
                    });

            }
        } else if (view === 'form-view') {
            const [isValid, , values] = formQuestionnaireRef.current.validate();
            if (isValid) {
                const postData = {
                    school: selectedSchool?.id,
                    survey: id,
                    questions: [
                        {
                            isRequired: !!values?.isRequired,
                            isMultiAnswer: !!values?.isMultiAnswer,
                            question: values?.question,
                            orderNumber: '1',
                            description: values?.description,
                            type: values?.type,
                            ...saved,
                            ...(selectedData ? { id: selectedData.id } : {}),
                        },
                    ],
                };

                dispatch(setLoading(true));

                fetchRequest(surveyQuestionCreate, 'post', postData)
                    .then((res) => {
                        const { success = false, message = null, ...rest } = res;
                        if (success) {
                            setQuestions(res?.questions)
                            if (addAgain) {
                                setView('form-view');
                                setTabKey('questionnaire');
                                setSelectedData(null);
                            } else {
                                setView('list');
                                setTabKey('questionnaire');
                                setSelectedData(null);
                            }
                        } else {
                            showMessage(message || t('errorMessage.title'));
                        }
                        dispatch(setLoading(false));
                    })
                    .catch(() => {
                        dispatch(setLoading(false));
                        showMessage(t('errorMessage.title'));
                    });
                // onSubmit({
                //     ...values,
                // });
            }
        }



        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            console.log('values ! *', values)
            // const [{ startDate, endDate }] = values?.date || {};
            // dispatch(setLoading(true));
            // const postData = {
            //     school: selectedSchool?.id,
            //     code: values.code,
            //     type: values?.type,
            //     startDate: startDate ? formatISO(new Date(startDate)) : formatISO(new Date()),
            //     endDate: endDate ? formatISO(new Date(endDate)) : formatISO(new Date()),
            //     name: values?.name,
            //     purpose: values?.purpose,
            //     category: values?.category,
            //     roles: values?.role,
            //     users: values?.users,
            //     classes: values?.classes,
            //     grades: values?.grades,
            // };

            // fetchRequest(surveyCreate, 'POST', postData)
            //     .then((res) => {
            //         const { success = false, message = null } = res;
            //         if (success) {
            //             history.replace(`/survey/view/${res?.id}/edit`);

            //             showMessage(message, true);
            //         } else {
            //             console.log('res: ', res);
            //             showMessage(message || t('errorMessage.title'));
            //         }
            //         dispatch(setLoading(false));
            //     })
            //     .catch((e) => {
            //         console.log('e', e)
            //         dispatch(setLoading(false));
            //         showMessage(t('errorMessage.title'));
            //     });
        }
    };

    const actionToPublish = () => {
        dispatch(setLoading(true));
        fetchRequest(surveyPublish, 'POST', {
            school: selectedSchool?.id,
            id,
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
        fetchRequest(surveyQuestionOrder, 'POST', { ...{ school: selectedSchool?.id }, ...postData })
            .then((res) => {
                const { message = null, success = false } = res;
                if (success) {
                    setShowOrder(false);
                    setQuestions(res?.questions)
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

    const deleteItem = async (itemId) => {
        dispatch(setLoading(true));
        fetchRequest(surveyQuestionDelete, 'POST', {
            questions: [itemId]
        })
            .then((res) => {
                const { message = null, success = false } = res;
                if (success) {
                    setQuestions(res?.questions)
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

    return (
        <>
            <Modal fullscreen show size="xl" animation={false} backdropClassName="full-page-bg" dialogClassName="custom-full-page-modal">
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

                    <div style={tabKey == 'general' ? {} : { display: 'none' }}>
                        <Forms ref={formRef} fields={fields} />
                    </div>
                    {tabKey === 'questionnaire' && (
                        <>
                            {view === 'list' ? (
                                <>
                                    <Row>
                                        <Col>
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
                                        </Col>
                                        <Col xs='auto' />
                                        <Col xs={3} style={{ textAlign: 'right', paddingRight: 10 }}>
                                            <span style={{ lineHeight: '72px' }}><b>Нийт: {questions.length} асуумж</b></span>
                                        </Col>
                                    </Row>

                                    {
                                        questions && questions.map((questionObj, i) => {
                                            const type = questionTypes?.find((tmp) => tmp.id === questionObj.typeId);
                                            return <div className="custom-container mb-4" key={`questions-${questionObj?.id}`}>
                                                <OverlayTrigger
                                                    trigger="focus"
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
                                                                                setSelectedData(questionObj);
                                                                                setShowDelete(true);
                                                                            } else if (m.key === 'edit') {
                                                                                setSelectedData(questionObj);
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
                                                    <h4>{questionObj?.question}</h4>
                                                    <p className="mb-3">{questionObj?.description}</p>
                                                    <div className="text-red mb-2">{questionObj.isRequired ? 'Заавал хариулт авна' : ''}</div>
                                                    <div className="mb-2">
                                                        Асуумжийн төрөл: <span className="fw-bold">{type?.name}</span>
                                                    </div>
                                                    <div className="d-flex flex-column px-4">
                                                        {questionObj.answers?.map((a, j) => (
                                                            <label className="mb-2" key={`qa-${i}-${j}`}>
                                                                {questionObj?.isMultiAnswer ? <input type="checkbox" name={`q-${i}-${j}`} /> : <input type="radio" name={`q-${i}-${j}`} />}
                                                                {a?.answer}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </>
                            ) : (
                                <EditQuestion
                                    ref={formQuestionnaireRef}
                                    key={`questionnaire-form-${surveyData?.questions?.length}`}
                                    question_types={questionTypes}
                                    save={setSave}
                                    selectedData={selectedData}
                                />
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {
                        tabKey === 'general' && <Row>
                            <Col className='text-center'>
                                <Button
                                    size="sm"
                                    variant="link"
                                    onClick={() => {
                                        setView('list');
                                    }}
                                >
                                    {t('common.back')}
                                </Button>
                                <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
                                    {t('common.save')}
                                </Button>
                            </Col>
                        </Row>
                    }
                    {
                        tabKey === 'questionnaire' && <Row>
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
                    }
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
                    survey={surveyData?.id}
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

export default Edit;
