import React, { useRef, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import Checkbox from 'modules/Form/Checkbox';
import 'css/addInvoice.css';

const AddModal = ({ show, setShow, onSubmit }) => {
  const { t } = useTranslation();
  const formRef = useRef();
  const [registerAgain, setRegisterAgain] = useState(false);

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
      key: 'level',
      value: '',
      label: `${t('survey.level')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
    },
    {
      key: 'group',
      value: '',
      label: `${t('survey.group')}*`,
      type: 'dropdown',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
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
    <Modal centered show={show} onHide={() => setShow(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="fs-16">{t('survey.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <Forms ref={formRef} fields={fields} />
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <Button onClick={() => setShow(false)} size="sm" variant="link">
            {t('common.back')}
          </Button>
          <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
            {t('survey.save')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModal;
