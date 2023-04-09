import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { Link } from 'react-router-dom';

const CreateSurveyContainer = ({ show, setShow, onSubmit }) => {
  const { t } = useTranslation();
  const formRef = useRef();
  const [registerAgain, setRegisterAgain] = useState(false);

  const [participant, setParticipant] = useState();

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
      key: 'name',
      value: '',
      label: `${t('survey.category')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
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
      key: 'participants',
      value: '',
      label: `${t('survey.participants')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      options: [
        {
          text: 'Сурагчид',
          value: 'students',
        },
        {
          text: 'Багш нар',
          value: 'teachers',
        },
        {
          text: 'Эцэг, эх',
          value: 'parents',
        },
      ],
      onChange: (value) => {
        setParticipant(value);
      },
    },

    {
      key: 'systemRole',
      value: '',
      label: `${t('survey.systemRole')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant !== 'teachers',
    },

    {
      key: 'workers',
      value: '',
      label: `${t('survey.workers')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant !== 'teachers',
    },

    {
      key: 'level',
      value: '',
      label: `${t('survey.level')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant === 'teachers',
    },
    {
      key: 'group',
      value: '',
      label: `${t('survey.group')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      hidden: participant === 'teachers',
    },
    {
      key: 'goal',
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

  const handleRegisterAgainChange = (value) => {
    if (value) {
      setRegisterAgain(false);
    } else {
      setRegisterAgain(true);
    }
  };

  const onSaveClick = () => {
    const [isValid, , values] = formRef.current.validate();
    if (isValid) {
      onSubmit({
        ...values,
        registerAgain,
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

export default CreateSurveyContainer;
