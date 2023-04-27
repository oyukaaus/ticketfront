import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { Link } from 'react-router-dom';
import { formatISO } from 'date-fns';

const ChangeDateModal = ({ show, setShow, onSubmit, survey }) => {
  const { t } = useTranslation();
  const formRef = useRef();

  const fields = [
    {
      key: 'date',
      value: [{ startDate: survey?.start_date, endDate: survey?.end_date }],
      label: `${t('survey.date')}*`,
      type: 'daterange',
      required: true,
      errorMessage: t('errorMessage.enterName'),
      labelBold: true,
      selectedStartDate: survey?.start_date,
      selectedEndDate: survey?.end_date,
    },
  ];

  const onSaveClick = () => {
    const [isValid, , values] = formRef.current.validate();
    if (isValid) {
      const [{ startDate, endDate }] = values?.date || {};
      const postData = {
        start_date: startDate ? formatISO(new Date(startDate)) : formatISO(new Date(survey?.start_date)),
        end_date: endDate ? formatISO(new Date(endDate)) : formatISO(new Date(survey?.end_date)),
      };
      onSubmit({
        ...postData,
        id: survey?.id,
      });
      formRef.current.updateFields(fields);
    }
  };

  return (
    <Modal
      show={show}
      onClose={() => {
        setShow(false);
      }}
      size="xl"
    >
      <Modal.Header>
        <Modal.Title className="fs-16 d-flex justify-content-between w-100 align-items-center">
          <span>{survey?.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <Forms key="change-date-range" ref={formRef} fields={fields} />
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <Button size="sm" variant="link" onClick={() => setShow(false)}>
            {t('common.back')}
          </Button>
          <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
            {t('common.save')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeDateModal;
