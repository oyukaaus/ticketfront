import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AddCircleOutline } from '@mui/icons-material';
// import TreeView from 'survey/components/TreeView';
import TreeView from 'modules/TreeView'
import AddModal from './AddModal';

const CategoryContainer = (props) => {
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
          title: 'First - 1'
        },
        {
          key: '1-2',
          title: 'First - 2'
        }
      ]
    },
    {
      key: 2,
      title: 'Second',
      children: [
        {
          key: '2-1',
          title: 'Second - 1'
        },
        {
          key: '2-2',
          title: 'SEcond - 2'
        }
      ]
    }
  ])

  const handleTreeClick = (array) => {
    const [id] = array;
    setSelectedTreeId(id);
  };


  return (
    <>
      <AddModal
        show={show}
        setShow={setShow}
        onSubmit={(values) => {
          console.log('hello world: ', values);
        }}
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
          <TreeView
            defaultExpandAll={true}
            selectedNodes={[selectedTreeId]}
            onSelect={(e) => handleTreeClick(e)}
            treeData={categories} />
        </div>
      </section>
    </>
  );
};

export default CategoryContainer;
