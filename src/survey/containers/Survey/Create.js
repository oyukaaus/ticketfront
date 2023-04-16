import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { Link, useHistory } from 'react-router-dom';
import { format, formatISO } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { setLoading } from 'utils/redux/action';
import { surveyCategoryIndex, surveyCreate } from 'utils/fetchRequest/Urls';
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
  const [participant, setParticipant] = useState();

  const [refreshId, setRefreshId] = useState(0);

  const fetch = () => {
    dispatch(setLoading(true));
    const postData = {};
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
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
    },
    {
      key: 'category_id',
      value: '',
      label: `${t('survey.category')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      options: convertDataToOptions(categories),
    },
    {
      key: 'date',
      value: '',
      label: `${t('survey.date')}*`,
      type: 'daterange',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
    },
    {
      key: 'type_id',
      value: '',
      label: `${t('survey.participants')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
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
      key: 'systemRole',
      value: '',
      label: `${t('survey.systemRole')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant !== 'teachers',
      searchable: true,
      multiple: true,
    },

    {
      key: 'workers',
      value: '',
      label: `${t('survey.workers')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant !== 'teachers',
      searchable: true,
      multiple: true,
    },

    {
      key: 'level',
      value: '',
      label: `${t('survey.level')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant === 'teachers',
      searchable: true,
      multiple: true,
    },
    {
      key: 'group',
      value: '',
      label: `${t('survey.group')}*`,
      type: 'dropdown',
      required: false,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant === 'teachers',
      searchable: true,
      multiple: true,
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

  useEffect(() => {
    const values = formRef.current.getValues();
    formRef.current.updateFields(fields?.map((f) => ({ ...f, value: values[f.key] })));
  }, [participant]);

  const onSaveClick = () => {
    const [isValid, , values] = formRef.current.validate();
    if (isValid) {
      const [{ startDate, endDate }] = values?.date || {};
      dispatch(setLoading(true));
      const postData = {
        ...{ school: selectedSchool?.id },
        code: values.code,
        status_id: '2',  // DRAFT ID
        type_id: values?.type_id,
        start_date: formatISO(new Date(startDate)),
        end_date: formatISO(new Date(endDate)),
        name: values?.name,
        purpose: values?.purpose,
        category_id: values?.category_id,
      };

      console.log('postData: ', postData);

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
