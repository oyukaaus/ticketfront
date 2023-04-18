import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import { useTranslation } from 'react-i18next';
import showMessage from 'modules/message';
import { fetchRequest } from 'utils/fetchRequest';
import { surveyInfo } from 'utils/fetchRequest/Urls';

const useData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const { selectedSchool } = useSelector((state) => state.schoolData);

  React.useEffect(() => {
    const fetchInfo = async () => {
      dispatch(setLoading(true));
      try {
        const { success, message, ...rest } = await fetchRequest(surveyInfo, 'POST', {
          school: selectedSchool?.id,
        });
        if (success) {
          setData(rest);
        } else {
          showMessage(message || t('errorMessage.title'));
        }
      } catch (e) {
        showMessage(e.message || t('errorMessage.title'));
      }
      dispatch(setLoading(false));
    };
    fetchInfo();
  }, []);

  return data;
};

export default useData;
