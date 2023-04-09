import * as React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/app.css';
import SurveyReportContainer from 'survey/containers/Survey/Report';

const SurveyReportPage = (props) => {
  const { t } = useTranslation();

  return (
    <div>
      <SurveyReportContainer />
    </div>
  );
};

export default SurveyReportPage;
