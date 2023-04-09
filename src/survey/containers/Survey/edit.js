import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Row, Col, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { Link } from 'react-router-dom';

const EditSurveyContainer = ({ onSubmit }) => {
  const { t } = useTranslation();
  const formRef = useRef();
  const form2Ref = useRef();
  const [registerAgain, setRegisterAgain] = useState(false);

  const [type, setType] = useState('text');

  const [answers, setAnswers] = useState([{}]);

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

  const questionnaireFields = [
    {
      key: 'questionnaire',
      value: '',
      label: `${t('survey.questionnaire')}*`,
      type: 'textArea',
      required: true,
      labelBold: true,
    },
    {
      key: 'questionnaireDesc',
      value: '',
      label: `${t('survey.questionnaireDesc')}*`,
      type: 'textArea',
      required: true,
      labelBold: true,
    },
    {
      key: 'image',
      label: '',
      value: '',
      type: 'fileUpload',
      required: true,
      fileName: '',
      multiple: false,
      isExtendedButton: true,
      isExtendedButtonText: t('survey.selectImage'),
      isExtendedButtonClass: 'btn btn-outline-alternate',
      // altImage: '../img/system/default-profile.png',
      accept: 'image/*',
      fileType: 'image',
      clearButton: true,
      isClearButtonText: t('foodManagement.deletePhoto'),
      isClearButtonClass: 'btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28 ml-2',
    },
    {
      key: 'answerRequired',
      value: '',
      label: `${t('survey.answerRequired')}*`,
      type: 'checkbox',
      required: true,
      labelBold: true,
    },
    {
      key: 'questionnaireType',
      value: '',
      label: `${t('survey.questionnaireType')}*`,
      type: 'dropdown',
      required: true,
      labelBold: true,
      options: [
        {
          text: t('survey.typeText'),
          value: 'text',
        },
        {
          text: t('survey.typeSelect'),
          value: 'select',
        },
      ],
      onChange: setType,
    },
  ];

  useEffect(() => {
    if (formRef.current) {
      const values = formRef.current?.getValues();
      formRef.current.updateFields(fields?.map((f) => ({ ...f, value: values[f.key] })));
    }
  }, [participant]);

  const handleRegisterAgainChange = (value) => {
    if (value) {
      setRegisterAgain(false);
    } else {
      setRegisterAgain(true);
    }
  };

  const [tabKey, setTabKey] = useState('general');

  const onSaveClick = () => {
    if (tabKey === 'general') {
      const [isValid, , values] = formRef.current.validate();
      if (isValid) {
        onSubmit({
          ...values,
          registerAgain,
        });
        formRef.current.updateFields(fields);
      }
    } else {
      const [isValid, , values] = form2Ref.current.validate();
      if (isValid) {
        onSubmit({
          ...values,
          registerAgain,
        });
        form2Ref.current.updateFields(fields);
      }
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
      <Modal.Body className="px-8">
        <Nav variant="tabs" activeKey={tabKey} onSelect={(key, e) => setTabKey(key, e)}>
          <Nav.Item key={'type_' + 1}>
            <Nav.Link eventKey="general">Ерөнхий мэдээлэл</Nav.Link>
          </Nav.Item>
          <Nav.Item key={'type_' + 2}>
            <Nav.Link eventKey="questionnaire">Асуумж</Nav.Link>
          </Nav.Item>
        </Nav>
        {tabKey === 'general' && <Forms ref={formRef} fields={fields} />}
        {tabKey === 'questionnaire' && (
          <>
            <Forms ref={form2Ref} fields={questionnaireFields} />
            <br />
            <br />
            {type === 'select' && (
              <div className="custom-container">
                {answers?.map((a, i) => (
                  <div key={`a-${i}`} className="d-flex mb-1 space-x-4">
                    <Button variant="outline-separator" type="button" size="sm">
                      <i className="flaticon2-arrow-up text-black" />
                    </Button>
                    <Button variant="outline-separator" type="button" size="sm">
                      <i className="flaticon2-arrow-down text-black" />
                    </Button>
                    <input className="form-control w-30" placeholder="Асуумж" />
                    <label>
                      <input className="form-control" style={{ display: 'none' }} type="file" accept="image/*" />
                    </label>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (i > 0) {
                          const tmp = [...answers];
                          tmp.splice(i, 1);
                          setAnswers(tmp);
                        }
                      }}
                    >
                      <i className="flaticon2-cross" />
                    </Button>
                  </div>
                ))}
                <label className="my-3">
                  <input type="checkbox" /> Олон утга сонгоно
                </label>
                <div>
                  <Button
                    onClick={() => {
                      setAnswers([...answers, {}]);
                    }}
                    variant="outline-alternate"
                    outline
                    className="text-uppercase br-8 py-2"
                  >
                    {t('common.add')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <Link to="/survey/index">
            <Button size="sm" variant="link">
              {t('common.back')}
            </Button>
          </Link>
          <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
            {t('common.save')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSurveyContainer;
