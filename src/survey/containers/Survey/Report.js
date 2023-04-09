import React from 'react';
import { Modal, Button, Col, Row, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { format } from 'date-fns';

import { Link } from 'react-router-dom';

const SurveyReportContainer = () => {
  const { t } = useTranslation();

  return (
    <Modal fullscreen show={true} size="xl" animation={false} backdropClassName="full-page-bg" dialogClassName="custom-full-page-modal">
      <Modal.Header>
        <Modal.Title className="fs-16 d-flex justify-content-between w-100 align-items-center">
          <span>Судалгааны код & Судалгааны нэр</span>
          <Link to="/survey/index">
            <Button size="sm" variant="link">
              {t('common.back')}
            </Button>
          </Link>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <div className="d-flex space-x-4">
          <div className="custom-container w-25"></div>
          <div className="custom-container w-25"></div>
          <div className="custom-container w-50"></div>
        </div>

        <div className="d-flex space-x-4">
          <div className="custom-container w-25"></div>
          <div className="custom-container w-70"></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <Button size="sm" variant="alternate" style={{ marginRight: 5 }}>
            Асуумжаар эксель татах
          </Button>
          <Button size="sm" variant="alternate">
            Хэрэглэгч тус бүрээр эксель татах
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SurveyReportContainer;
