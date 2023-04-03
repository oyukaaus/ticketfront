import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AddCircleOutline } from '@mui/icons-material';
import TreeView from 'survey/components/TreeView';
import AddModal from './AddModal';

const CategoryContainer = (props) => {
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
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
          <TreeView />
        </div>
      </section>
    </>
  );
};

export default CategoryContainer;
