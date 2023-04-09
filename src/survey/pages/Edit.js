import * as React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/app.css';
import EditSurveyContainer from '../containers/Survey/Edit';

const SurveyEditPage = (props) => {
  const { t } = useTranslation();

  return (
    <div>
      <EditSurveyContainer />
    </div>
  );
};

export default SurveyEditPage;
