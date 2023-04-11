import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AddCircleOutline } from '@mui/icons-material';
// import TreeView from 'survey/components/TreeView';
import TreeView from 'modules/TreeView';
import { useDispatch } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { setLoading } from 'utils/redux/action';
import { surveyCategoryIndex, surveyCategoryCreate, surveyCategoryEdit } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import AddModal from './AddModal';

const CategoryContainer = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  const [selectedTreeId, setSelectedTreeId] = React.useState(null);
  const [categories, setCategories] = React.useState([
    {
      key: 1,
      title: 'First',
      children: [
        {
          key: '1-1',
          title: 'First - 1',
        },
        {
          key: '1-2',
          title: 'First - 2',
        },
      ],
    },
    {
      key: 2,
      title: 'Second',
      children: [
        {
          key: '2-1',
          title: 'Second - 1',
        },
        {
          key: '2-2',
          title: 'SEcond - 2',
        },
      ],
    },
  ]);

  function convertDataToTree(data) {
    return data.map((item) => {
      const { name, id } = item;
      const children = item.sub_categories && item.sub_categories?.length > 0 ? convertDataToTree(item.sub_categories) : [];
      return { key: id, title: name, children };
    });
  }

  function convertDataToOptions(data) {
    return data.reduce((acc, item) => {
      const { key, title, children } = item;
      acc.push({ value: key, text: title });
      if (children) {
        acc.push(...convertDataToOptions(children));
      }
      return acc;
    }, []);
  }

  const handleTreeClick = (array) => {
    const [id] = array;
    setSelectedTreeId(id);
  };

  const fetch = () => {
    dispatch(setLoading(true));
    const postData = {};
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

  console.log('xaxa: ', categories);
  console.log('wtf: ', convertDataToOptions(categories));

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
        <div className="bg-white">
          <TreeView defaultExpandAll={true} selectedNodes={[selectedTreeId]} onSelect={(e) => handleTreeClick(e)} treeData={categories} />
        </div>
      </section>
    </>
  );
};

export default CategoryContainer;
