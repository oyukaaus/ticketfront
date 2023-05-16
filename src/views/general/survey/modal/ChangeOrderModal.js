import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import SouthSharpIcon from '@mui/icons-material/SouthSharp';
import NorthSharpIcon from '@mui/icons-material/NorthSharp';

const ChangeOrderModal = ({ show, setShow, onSubmit, questions, survey, ...rest }) => {
  const [qs, setQS] = useState((questions || [])?.map((q, qIndex) => ({ ...q, orderNumber: qIndex + 1 })));
  const { t } = useTranslation();

  const onSaveClick = () => {
    onSubmit({
      questions: qs,
      survey
    });
  };

  return (
    <Modal
      show={show}
      onClose={() => {
        setShow(false);
      }}
      size="xl"
      {...rest}
    >
      <Modal.Header>
        <Modal.Title className="fs-16 d-flex justify-content-between w-100 align-items-center">
          <span>{t('survey.changeQuestionsOrder')}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {qs
          ?.sort((a, b) => {
            if (a.orderNumber < b.orderNumber) {
              return -1;
            }
            if (a.orderNumber > b.orderNumber) {
              return 1;
            }
            return 0;
          })
          .map((q, i) => (
            <div key={`q-${q.id}`} className="d-flex mb-1 space-x-4">
              <div style={{ width: 100 }} className="d-flex justify-content-center">
                {q.orderNumber !== 1 && (
                  <Button
                    variant="outline-separator"
                    type="button"
                    size="sm"
                    onClick={() => {
                      const tmp = [...qs];
                      const orderNumber = tmp[i - 1].orderNumber;
                      tmp[i - 1].orderNumber = tmp[i].orderNumber;
                      tmp[i].orderNumber = orderNumber;
                      setQS(tmp);
                    }}
                  >
                    {/* <i className="flaticon2-arrow-up text-black" /> */}
                    <NorthSharpIcon className="text-black" fontSize="small" />
                  </Button>
                )}

                {q.orderNumber !== qs.length && (
                  <Button
                    variant="outline-separator"
                    type="button"
                    size="sm"
                    onClick={() => {
                      const tmp = [...qs];
                      const orderNumber = tmp[i + 1].orderNumber;
                      tmp[i + 1].orderNumber = tmp[i].orderNumber;
                      tmp[i].orderNumber = orderNumber;
                      setQS(tmp);
                    }}
                  >
                    {/* <i className="flaticon2-arrow-down text-black" /> */}
                    <SouthSharpIcon className="text-black" fontSize="small" />
                  </Button>
                )}
              </div>
              <div className="custom-q2">{q.question}</div>
            </div>
          ))}
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

export default ChangeOrderModal;
