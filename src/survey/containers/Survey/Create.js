import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { Link, useHistory } from 'react-router-dom';
import { format, formatISO } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { setLoading } from 'utils/redux/action';
import { surveyCategoryIndex, surveyCreate, surveyInfoRoles } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import useData from 'survey/hooks/useData';
import { convertDataToTree, convertDataToOptions } from '../Category';

const CreateSurveyContainer = ({ show, setShow, onSubmit }) => {
  const data = useData();
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formRef = useRef();
  const { selectedSchool } = useSelector((state) => state.schoolData);
  const [categories, setCategories] = React.useState([]);
  const [participant, setParticipant] = useState('');

  const [refreshId, setRefreshId] = useState(0);
  const [grades, setGrades] = useState([]);
  const [systemRoles, setSystemRoles] = useState([]);

  const [roles, setRoles] = useState([]);

  const fetch = () => {
    dispatch(setLoading(true));
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
        setRefreshId((id) => id + 1);
      })
      .catch(() => {
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setRefreshId((id) => id + 1);
  }, [data]);

  const TYPE = data?.survey_types?.find((st) => st.id === participant);

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
      key: 'category_id',
      value: '',
      label: `${t('survey.category')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
      options: convertDataToOptions(categories),
    },
    {
      key: 'date',
      value: '',
      label: `${t('survey.date')}*`,
      type: 'daterange',
      required: true,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
    },
    {
      key: 'type_id',
      value: '',
      label: `${t('survey.participants')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
      options: data?.survey_types?.map((type) => ({
        text: type.name,
        value: type.id,
      })),
      onChange: (value) => {
        setParticipant(value);
      },
    },

    {
      key: 'system_roles',
      value: '',
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
      key: 'system_users',
      value: '',
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
      value: '',
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
      value: '',
      label: `${t('survey.group')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterValue'),
      labelBold: true,
      hidden: TYPE?.code === 'TEACHER',
      searchable: true,
      multiple: true,
      options: data?.classes?.classes
        ?.filter((classes) => {
          const tmpGrades = data?.grades?.filter((g) => {
            return grades.includes(g.key);
          });
          let flag = false;
          tmpGrades.forEach((tg) => {
            const childs = tg.children?.map((tgc) => tgc.key);
            if (childs.includes(classes.gradeId)) {
              flag = true;
            }
          });
          return flag;
        })
        ?.map((classes) => ({
          text: classes.class,
          value: classes.id,
        })),
    },
    {
      key: 'purpose',
      value: '',
      label: `${t('survey.goal')}`,
      type: 'textArea',
      required: false,
      labelBold: true,
    },
  ];

  useEffect(() => {
    const values = formRef.current.getValues();
    formRef.current.updateFields(fields?.map((f) => ({ ...f, value: values[f.key] })));
  }, [participant, grades, roles]);

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

  const onSaveClick = () => {
    const [isValid, , values] = formRef.current.validate();
    if (isValid) {
      const [{ startDate, endDate }] = values?.date || {};
      dispatch(setLoading(true));
      const postData = {
        ...{ school: selectedSchool?.id },
        code: values.code,
        status_id: '2', // DRAFT ID
        type_id: values?.type_id,
        start_date: startDate ? formatISO(new Date(startDate)) : formatISO(new Date()),
        end_date: endDate ? formatISO(new Date(endDate)) : formatISO(new Date()),
        name: values?.name,
        purpose: values?.purpose,
        category_id: values?.category_id,
        system_roles: values?.system_roles,
        system_users: values?.system_users,
        classes: values?.classes,
        grades: values?.grades,
      };
      console.log('postData: ', postData);
      dispatch(setLoading(false));
      fetchRequest(surveyCreate, 'POST', postData)
        .then((res) => {
          const { success = false, message = null } = res;
          if (success) {
            console.log('res2: ', res);
            history.replace(`/survey/view/${res?.survey?.id}/edit`);
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
  };

  console.log('DATA: ', data);

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
      <Modal.Body className="px-0">
        <Forms key={`categories-${refreshId}`} ref={formRef} fields={fields} />
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

export default CreateSurveyContainer;
