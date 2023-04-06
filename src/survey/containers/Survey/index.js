import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BorderColorTwoTone, DeleteTwoTone, AddCircleOutline, HighlightOff, PlaylistAddCheckCircleOutlined, HighlightOffRounded } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from 'modules/message';
import { fetchRequest } from 'utils/fetchRequest';
import {
  doctorMedicineIndex,
  doctorMedicineSubmit,
  doctorMedicineEdit,
  doctorMedicineSetActive,
  doctorMedicineSetInactive,
  doctorMedicineDelete,
} from 'utils/fetchRequest/Urls';
import DTable from 'modules/DataTable/DTable';
import DeleteType from 'modules/DeleteModal';
import AddSurvey from './AddModal';
import EditMedicine from './edit';
import SetInactive from './setInactive';
import 'css/dashboard.css';

const SurveyListContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const current = new Date();
  const dateTimeToday =
    current.getFullYear() +
    '-' +
    ('00' + (current.getMonth() + 1)).slice(-2) +
    '-' +
    ('00' + current.getDate()).slice(-2) +
    ' ' +
    current.getHours() +
    ':' +
    ('00' + current.getMinutes()).slice(-2) +
    ':' +
    ('00' + current.getSeconds()).slice(-2);
  const { selectedSchool } = useSelector((state) => state.schoolData);
  const [selectedData, setSelectedData] = useState(null);

  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showEditMedicine, setShowEditMedicine] = useState(false);
  const [showSetInactiveMedicine, setShowSetInactiveMedicine] = useState(false);
  const [showDeleteMedicine, setShowDeleteMedicine] = useState(false);

  const [tableTotalCount, setTableTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const config = {
    excelExport: true,
    printButton: true,
    columnButton: false,
    showPagination: true,
    showFilter: true,
    footer: false,
    excelFileName: t('doctorsCorner.medicineRegistration') + ' ' + dateTimeToday,
  };

  const contextMenuArray = [
    {
      key: 'edit',
      title: t('common.edit'),
      icon: <BorderColorTwoTone className="color-info" />,
    },
    {
      key: 'delete',
      title: t('common.delete'),
      icon: <DeleteTwoTone className="color-info" />,
    },
    {
      key: 'inactive',
      title: t('action.setInactive'),
      icon: <HighlightOff className="color-info" />,
    },
    {
      key: 'active',
      title: t('action.setActive'),
      icon: <PlaylistAddCheckCircleOutlined className="color-info" />,
    },
  ];

  const column = [
    {
      dataField: 'code',
      text: t('common.code'),
      sort: true,
    },
    {
      dataField: 'name',
      text: t('survey.name'),
      sort: true,
    },{
      dataField: 'category',
      text: t('survey.category'),
      sort: true,
    },{
      dataField: 'participants',
      text: t('survey.participants'),
      sort: true,
    },{
      dataField: 'startDate',
      text: t('survey.startDate'),
      sort: true,
    },{
      dataField: 'endDate',
      text: t('survey.endDate'),
      sort: true,
    },{
      dataField: 'registered',
      text: t('survey.registered'),
      sort: true,
    },{
      dataField: 'publishedDate',
      text: t('survey.publishedDate'),
      sort: true,
    }
  ];

  const onSetActiveMedicineHandler = (id) => {
    dispatch(setLoading(true));
    const postData = {
      school: selectedSchool?.id,
      medicine: [id],
    };
    fetchRequest(doctorMedicineSetActive, 'POST', postData)
      .then((res) => {
        const { list = [], message = null, success = false } = res;
        if (success) {
          setTableData(list);
          showMessage(message, success);
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

  const handleContextMenuClick = (id, key, row) => {
    if (id && key) {
      if (key === 'edit') {
        setSelectedData(row);
        setShowEditMedicine(true);
      } else if (key == 'delete') {
        setSelectedData(id);
        setShowDeleteMedicine(true);
      } else if (key == 'inactive') {
        setSelectedData(id);
        setShowSetInactiveMedicine(true);
      } else if (key == 'active') {
        onSetActiveMedicineHandler(id);
      }
    }
  };

  const onModalClose = () => {
    setShowDeleteMedicine(false);
    setSelectedData(null);
  };

  const onAddMedicineClick = () => {
    setShowAddMedicine(true);
  };

  const onSubmitMedicineHandler = (params) => {
    const postData = {
      ...{ school: selectedSchool?.id },
      ...params,
    };
    dispatch(setLoading(true));

    fetchRequest(doctorMedicineSubmit, 'POST', postData)
      .then((res) => {
        const { list = [], message = null, success = false } = res;
        if (success) {
          setTableData(list);
          if (!params.registerAgain) {
            setShowAddMedicine(false);
          }
          showMessage(message, success);
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

  const onEditMedicineHandler = (params) => {
    dispatch(setLoading(true));
    const postData = {
      ...{ school: selectedSchool?.id },
      ...{ medicine: selectedData?.id },
      ...params,
    };
    fetchRequest(doctorMedicineEdit, 'POST', postData)
      .then((res) => {
        const { list = [], message = null, success = false } = res;
        if (success) {
          setTableData(list);
          setShowEditMedicine(false);
          showMessage(message, success);
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

  const onSetInactiveMedicineHandler = () => {
    dispatch(setLoading(true));
    const postData = {
      ...{ school: selectedSchool?.id },
      ...{ medicine: [selectedData] },
    };
    fetchRequest(doctorMedicineSetInactive, 'POST', postData)
      .then((res) => {
        const { list = [], message = null, success = false } = res;
        if (res.success) {
          setTableData(list);
          setShowSetInactiveMedicine(false);
          showMessage(message, success);
        } else {
          showMessage(message || t('errorMessage.title'), success);
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
      });
  };

  const onSetInactiveSelectedMedicineHandler = () => {
    dispatch(setLoading(true));
    const postData = {
      ...{ school: selectedSchool?.id },
      ...{ medicine: selectedRows },
    };
    fetchRequest(doctorMedicineSetInactive, 'POST', postData)
      .then((res) => {
        const { list = [], message = null, success = false } = res;
        if (res.success) {
          setTableData(list);
          setShowSetInactiveMedicine(false);
          showMessage(message, success);
        } else {
          showMessage(message || t('errorMessage.title'), success);
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
      });
  };

  const onDeleteMedicineHandler = () => {
    dispatch(setLoading(true));
    const postData = {
      ...{ school: selectedSchool?.id },
      ...{ medicine: selectedData },
    };
    fetchRequest(doctorMedicineDelete, 'POST', postData)
      .then((res) => {
        const { list = [], message = null, success = false } = res;
        if (success) {
          setTableData(list);
          setShowDeleteMedicine(false);
          showMessage(message, success);
        } else {
          showMessage(message || t('errorMessage.title'), success);
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
      });
  };

  const handlerCheckable = (type, i, value, sr) => {
    if (type == 'allCheck' && value == false) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sr.map((param) => tableData.find((p, ind) => ind == param).id));
    }
  };

  const onInteraction = (obj) => {
    setSizePerPage(obj.pageSize);
    setPageNumber(obj.page);
    setSearchValue(obj.search);
    setSortKey(obj.sort);
    setSortOrder(obj.order);
  };

  useEffect(() => {
    dispatch(setLoading(true));
    const postData = {
      school: selectedSchool?.id,
      page: pageNumber,
      pageSize: sizePerPage,
      query: searchValue,
      sortBy: sortKey,
      order: sortOrder,
    };
    fetchRequest(doctorMedicineIndex, 'POST', postData)
      .then((res) => {
        const { list = [], page = 1, pageSize = 10, query = '', totalCount = 0, success = false, message = null } = res;
        if (success) {
          setTableData(list);
          setPageNumber(page);
          setSizePerPage(pageSize);
          setSearchValue(query);
          setTableTotalCount(totalCount);
        } else {
          showMessage(message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      });
  }, [pageNumber, sizePerPage, searchValue, sortKey, sortOrder]);

  const [published, setPublished] = useState(true);

  return (
    <>
      <Row>
        <Row>
          <Col lg={12}>
            <Button type="button" variant="info" size="sm" className="text-uppercase br-8" onClick={onAddMedicineClick}>
              <span className="m-0 font-weight-bold d-flex align-items-center">
                <AddCircleOutline className="w-19" />
                &nbsp;{t('common.create')}
              </span>
            </Button>

            <Row className="mb-4">
              <Col lg={4}>
                <Card
                  className={`custom-card rounded-3 border ${published ? 'border-info' : ''}`}
                  onClick={() => {
                    setPublished(true);
                  }}
                >
                  <Card.Body className="text-center">
                    <strong>Нийтэлсэн</strong>
                    <p className="m-0">{98} судалгаа</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card
                  className={`custom-card rounded-3 border ${!published ? 'border-info' : ''}`}
                  onClick={() => {
                    setPublished(false);
                  }}
                >
                  <Card.Body className="text-center">
                    <strong>Нийтлээгүй</strong>
                    <p className="m-0">{9} судалгаа</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {selectedRows && selectedRows.length > 0 && (
              <Button type="button" variant="danger" size="sm" className="ms-2 top-btn br-8" onClick={() => onSetInactiveSelectedMedicineHandler()}>
                <span className="m-0 font-weight-bold d-flex align-items-center">
                  <HighlightOffRounded className="w-19" />
                  &nbsp;{t('action.setInactive')}
                </span>
              </Button>
            )}
            <Card className="mb-3 no-border-radius">
              <Card.Body className="">
                <DTable
                  currentPage={pageNumber}
                  checkable="true"
                  onCheckable={handlerCheckable}
                  remote
                  onInteraction={onInteraction}
                  selectMode="radio"
                  config={config}
                  columns={column}
                  data={tableData}
                  individualContextMenus="true"
                  contextMenus={contextMenuArray}
                  totalDataSize={tableTotalCount}
                  onContextMenuItemClick={handleContextMenuClick}
                  excelExportUrl="url"
                  exportExportParams={{
                    school: selectedSchool?.id,
                    sortBy: sortKey,
                    order: sortOrder,
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Row>
      {showAddMedicine && <AddSurvey show={showAddMedicine} setShow={setShowAddMedicine} onSubmit={() => {}} />}
      {showEditMedicine && <EditMedicine selectedData={selectedData} show={showEditMedicine} setShow={setShowEditMedicine} onSubmit={onEditMedicineHandler} />}
      {showSetInactiveMedicine && <SetInactive setShow={setShowSetInactiveMedicine} onInactive={onSetInactiveMedicineHandler} />}
      {showDeleteMedicine && selectedData && (
        <DeleteType onClose={onModalClose} onDelete={onDeleteMedicineHandler} title={t('warning.delete')} modalSize="md">
          {t('warning.delete_confirmation')}
          <br />
          <br />
          {t('warning.delete_confirmation_description')}
        </DeleteType>
      )}
    </>
  );
};

export default SurveyListContainer;
