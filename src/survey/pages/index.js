import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import CategoryContainer from 'survey/containers/Category';
import SurveyListContainer from 'survey/containers/Survey';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useTranslation } from 'react-i18next';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/app.css';

const SurveyPage = (props) => {
  const { t } = useTranslation();
  const breadcrumbs = [
    { to: '', text: t('menu.home') },
    { to: 'survey/index', text: t('dashboard.survey') },
  ];
  const [category, setCategory] = useLocalStorage('category', '');
  return (
    <div>
      <div className="mb-3">
        <h2 className="font-standard mb-0">{t('dashboard.survey')}</h2>
        <BreadcrumbList basePath="/" key={1} items={breadcrumbs} />
      </div>
      <Row>
        <Col md={3}>
          <CategoryContainer setCategory={setCategory} />
        </Col>
        <Col>
          <SurveyListContainer category={category} />
        </Col>
      </Row>
    </div>
  );
};

export default SurveyPage;
