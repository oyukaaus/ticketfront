import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { formatISO } from 'date-fns';
import './css/app.css'

import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { setLoading } from 'utils/redux/action';
import { surveyInit, surveyCreate } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';

const Create = () => {

    const location = useLocation()

    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const formRef = useRef();

    const { selectedSchool } = useSelector((state) => state.schoolData);

    const [userTypes] = useState(location?.state?.userTypes || [])
    const [selectedUserType, setSelectedUserType] = useState(null)
    const [categories] = useState(location?.state?.categories || [])
    const [selectedCategory] = useState(location?.state?.selectedCategory)

    const [grades, setGrades] = useState([])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [classes, setClasses] = useState([])
    const [selectedClass] = useState(null)
    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [roleUsers, setRoleUsers] = useState([])
    const [selectedUsers] = useState(null)
    useEffect(() => {
    }, []);

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
            console.log('response --- ', res)
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
            value: '',
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
            value: '',
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
            value: '',
            label: `${t('survey.date')}*`,
            type: 'daterange',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            clearable: true,
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
            value: '',
            label: `${t('survey.goal')}*`,
            type: 'textArea',
            required: false,
            labelBold: true,
        },
    ];

    const updateFields = () => {
        const values = formRef.current.getValues();
        
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
        formRef.current.updateFields(fields?.map((f) => ({ ...f, value: values[f.key] })));
    }

    useEffect(() => {
        updateFields()
    }, [selectedUserType, selectedGrade, roleUsers]);

    // useEffect(() => {
    //     if (systemRoles?.length > 0) {
    //         const fetchRoles = async () => {
    //             dispatch(setLoading(true));
    //             try {
    //                 const res = await fetchRequest(surveyInfoRoles, 'POST', {
    //                     school: selectedSchool?.id,
    //                     roles: systemRoles,
    //                     role: systemRoles[0],
    //                 });
    //                 if (res?.success) {
    //                     setRoles(res?.roles);
    //                 } else {
    //                     showMessage(res?.message || t('errorMessage.title'));
    //                 }
    //             } catch (e) {
    //                 showMessage(e?.message || t('errorMessage.title'));
    //             }
    //             dispatch(setLoading(false));
    //         };
    //         fetchRoles();
    //     }
    // }, [systemRoles]);

    const onSaveClick = () => {
        const [isValid, , values] = formRef.current.validate();
        
        if (isValid) {
            const [{ startDate, endDate }] = values?.date || {};
            dispatch(setLoading(true));
            const postData = {
                school: selectedSchool?.id,
                code: values.code,
                type: values?.type,
                startDate: startDate ? formatISO(new Date(startDate)) : formatISO(new Date()),
                endDate: endDate ? formatISO(new Date(endDate)) : formatISO(new Date()),
                name: values?.name,
                purpose: values?.purpose,
                category: values?.category,
                roles: values?.role,
                users: values?.users,
                classes: values?.classes,
                grades: values?.grades,
            };

            fetchRequest(surveyCreate, 'POST', postData)
                .then((res) => {
                    const { success = false, message = null } = res;
                    if (success) {
                        history.replace(`/survey/view/${res?.id}/edit`, {
                            userTypes,
                            categories
                        });                        
                        showMessage(message, true);
                    } else {
                        console.log('res: ', res);
                        showMessage(message || t('errorMessage.title'));
                    }
                    dispatch(setLoading(false));
                })
                .catch((e) => {
                    console.log('e', e)
                    dispatch(setLoading(false));
                    showMessage(t('errorMessage.title'));
                });
        }
    };

    return (
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
            <Modal.Body className="px-0">
                <Forms ref={formRef} fields={fields} />
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Link to="/survey/index">
                        <Button size="sm" variant="link">
                            {t('common.back')}
                        </Button>
                    </Link>
                    <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
                        {t('survey.save')}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default Create;
