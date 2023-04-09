import * as React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/app.css';
import SurveyViewContainer from 'survey/containers/Survey/View';

const SurveyViewPage = (props) => {
  const { t } = useTranslation();

  return (
    <div>
      <SurveyViewContainer />
    </div>
  );
};

export default SurveyViewPage;
