import * as React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/app.css';
import CreateSurveyContainer from 'survey/containers/Survey/Create';

const SurveyCreatePage = (props) => {
  const { t } = useTranslation();

  return (
    <div>
      <CreateSurveyContainer />
    </div>
  );
};

export default SurveyCreatePage;
