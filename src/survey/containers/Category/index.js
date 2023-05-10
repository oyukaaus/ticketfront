import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AddCircleOutline } from '@mui/icons-material';
// import TreeView from 'survey/components/TreeView';
import TreeView from 'modules/TreeView';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { setLoading } from 'utils/redux/action';
import { surveyCategoryIndex, surveyCategoryCreate, surveyCategoryEdit } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import useLocalStorage from 'survey/hooks/useLocalStorage';
import AddModal from './AddModal';

export function convertDataToTree(data) {
  return data.map((item) => {
    const { name, id } = item;
    const children = item.sub_categories && item.sub_categories?.length > 0 ? convertDataToTree(item.sub_categories) : [];
    return { key: id, title: name, children };
  });
}

export function convertDataToOptions(data) {
  return data.reduce((acc, item) => {
    const { key, title, children } = item;
    acc.push({ value: key, text: title });
    if (children) {
      acc.push(...convertDataToOptions(children));
    }
    return acc;
  }, []);
}

const CategoryContainer = (props) => {
  const { setCategory } = props;
  const dispatch = useDispatch();
  const { selectedSchool } = useSelector((state) => state.schoolData);
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  const [selectedTreeId, setSelectedTreeId] = useLocalStorage('category', '');
  const [categories, setCategories] = React.useState([]);

  const handleTreeClick = (array) => {
    const [id] = array;
    setSelectedTreeId(id);
  };

  React.useEffect(() => {
    setCategory(selectedTreeId);
  }, [selectedTreeId]);

  const fetch = () => {
    dispatch(setLoading(true));
    const postData = {
      school: selectedSchool?.id,
    };
    fetchRequest(surveyCategoryIndex, 'POST', postData)
      .then((res) => {
        const { success = false, message = null, categories: tmpCategories = [] } = res;

        if (success) {
          setCategories(convertDataToTree(tmpCategories));
        } else {
          showMessage(message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      });
  };

  const handleSubmit = async (values) => {
    dispatch(setLoading(true));
    const postData = {
      school: selectedSchool?.id,
      ...values,
      code: values.name?.replaceAll(' ', '').toLowerCase(),
      is_active: 1,
      order_number: 2, // order_number: 2,
    };

    fetchRequest(surveyCategoryCreate, 'POST', postData)
      .then((res) => {
        const { success = false, message = null } = res;
        if (success) {
          setShow(false);
          fetch();
        } else {
          showMessage(message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      });
  };

  React.useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <AddModal
        show={show}
        setShow={setShow}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        categories={convertDataToOptions(categories)}
      />
      <section>
        <div className="">
          <Button
            type="button"
            variant="info"
            size="sm"
            className="text-uppercase br-8"
            onClick={() => {
              setShow(true);
            }}
          >
            <span className="m-0 font-weight-bold d-flex align-items-center">
              <AddCircleOutline className="w-19" />
              &nbsp;{t('common.Category')} {t('common.create')}
            </span>
          </Button>
        </div>
        <div className="bg-white p-5">
          <TreeView
            defaultExpandAll={true}
            selectedNodes={[selectedTreeId]}
            onSelect={(e) => handleTreeClick(e)}
            treeData={[{ key: '', title: t('common.all'), children: categories }]}
          />
        </div>
      </section>
    </>
  );
};

export default CategoryContainer;
