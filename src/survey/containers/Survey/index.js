import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BorderColorTwoTone, DeleteTwoTone, AddCircleOutline, HighlightOff, PlaylistAddCheckCircleOutlined, HighlightOffRounded } from '@mui/icons-material';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone';
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone';
import ManageHistoryTwoToneIcon from '@mui/icons-material/ManageHistoryTwoTone';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from 'modules/message';
import { fetchRequest } from 'utils/fetchRequest';
import { surveyIndex, surveyCreate, surveyDelete, surveyQuestionsIndex, surveyQuestionCreate } from 'utils/fetchRequest/Urls';
import DTable from 'modules/DataTable/DTable';
import DeleteType from 'modules/DeleteModal';
import { format } from 'date-fns';
import 'css/dashboard.css';
import useData from 'survey/hooks/useData';
import ChangeDateModal from './ChangeDateModal';

const SurveyListContainer = (props) => {
  const history = useHistory();
  const [currentStatus, setCurrentStatus] = useState();
  const { category } = props;
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

  const [showDelete, setShowDelete] = useState(false);

  const [tableTotalCount, setTableTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [tableData, setTableData] = useState([]);

  const [changeDate, setChangeDate] = useState(false);

  const config = {
    excelExport: true,
    printButton: true,
    columnButton: false,
    showPagination: true,
    showFilter: true,
    footer: false,
    excelFileName: t('survey.title') + ' ' + dateTimeToday,
  };

  const contextMenuArray = [
    {
      key: 'report',
      title: t('survey.report'),
      icon: <PreviewTwoToneIcon className="color-info" />,
    },
    {
      key: 'date',
      title: t('survey.changeDate'),
      icon: <ManageHistoryTwoToneIcon className="color-info" />,
    },
    {
      key: 'edit',
      title: t('common.edit'),
      icon: <BorderColorTwoTone className="color-info" />,
    },
    {
      key: 'copy',
      title: t('survey.copy'),
      icon: <FileCopyTwoToneIcon className="color-info" />,
    },
    {
      key: 'delete',
      title: t('common.delete'),
      icon: <DeleteTwoTone className="color-info" />,
    },
    {
      key: 'inactive',
      title: t('action.unPublish'),
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
      formatter: (cell, row) => {
        return (
          <Link to={`/survey/view/${row.id}`} className="underline">
            {cell}
          </Link>
        );
      },
    },
    {
      dataField: 'category_name',
      text: t('survey.category'),
      sort: true,
    },
    {
      dataField: 'type_name',
      text: t('survey.participants'),
      sort: true,
    },
    {
      dataField: 'start_date',
      text: t('survey.startDate'),
      sort: true,
      formatter: (cell, row, rowIndex) => {
        return cell ? format(new Date(cell), 'yyyy-MM-dd HH:mm') : '-';
      },
    },
    {
      dataField: 'end_date',
      text: t('survey.endDate'),
      sort: true,
      formatter: (cell, row, rowIndex) => {
        return cell ? format(new Date(cell), 'yyyy-MM-dd HH:mm') : '';
      },
    },
    {
      dataField: 'registered',
      text: t('survey.registered'),
      sort: true,
    },
    {
      dataField: 'publish_date',
      text: t('survey.publishedDate'),
      sort: true,
      formatter: (cell, row, rowIndex) => {
        return cell ? format(new Date(cell), 'yyyy-MM-dd HH:mm') : '-';
      },
    },
  ];

  const [totalSurvey, setTotalSurvey] = useState(0);
  console.log('total: ', totalSurvey);

  const fetchSurveyList = async () => {
    const postData = {
      school: selectedSchool?.id,
      page: pageNumber,
      pageSize: sizePerPage,
      query: searchValue,
      sortBy: sortKey,
      order: sortOrder,
      category_id: category,
      status_id: currentStatus?.id || '',
      type_id: '',
    };

    if (currentStatus) {
      dispatch(setLoading(true));
      try {
        const countRes = await fetchRequest(surveyIndex, 'POST', { ...postData, status_id: '', page: 1, page_size: 1, query: '', order: '' });
        setTotalSurvey(countRes.count);
      } catch (e) {
        //
      }
      fetchRequest(surveyIndex, 'POST', postData)
        .then((res) => {
          console.log('resss: ', res);
          const { surveys = [], count, page = 1, pageSize = 10, query = '', totalCount = 0, success = false, message = null } = res;
          if (success) {
            setTableData(surveys);
            setPageNumber(page);
            setSizePerPage(pageSize);
            setSearchValue(query);
            setTableTotalCount(count);
          } else {
            showMessage(message || t('errorMessage.title'));
          }
          dispatch(setLoading(false));
        })
        .catch((e) => {
          console.log('message: ', e);
          dispatch(setLoading(false));
          showMessage(t('errorMessage.title'));
        });
    }
  };

  const actionToDelete = (id) => {
    dispatch(setLoading(true));
    const postData = {
      id,
    };
    fetchRequest(surveyDelete, 'POST', postData)
      .then((res) => {
        setShowDelete(false);
        const { message = null, success = false } = res;
        if (success) {
          fetchSurveyList();
          showMessage(message, success);
        } else {
          showMessage(message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
      })
      .catch(() => {
        setShowDelete(false);
        dispatch(setLoading(false));
        showMessage(t('errorMessage.title'));
      })
      .finally(() => {
        setSelectedData(null);
      });
  };

  const actionToDraft = (id) => {
    dispatch(setLoading(true));
    const postData = {
      id,
      status_id: 2,
    };
    fetchRequest(surveyCreate, 'POST', postData)
      .then((res) => {
        const { message = null, success = false } = res;
        if (success) {
          fetchSurveyList();
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

  const actionToChangeDate = (postData) => {
    dispatch(setLoading(true));
    fetchRequest(surveyCreate, 'POST', postData)
      .then((res) => {
        const { message = null, success = false } = res;
        if (success) {
          setChangeDate(false);
          setSelectedData(null);
          fetchSurveyList();
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

  const actionToCopy = (survey) => {
    const { id, ...rest } = survey;
    dispatch(setLoading(true));
    const postData = {
      ...rest,
      status_id: 2,
    };
    fetchRequest(surveyCreate, 'POST', postData)
      .then(async (res) => {
        const { message = null, success = false, survey: newSurvey } = res;
        if (success) {
          try {
            const resQuestions = await fetchRequest(surveyQuestionsIndex, 'POST', {
              survey_id: id,
            });

            await fetchRequest(surveyQuestionCreate, 'POST', {
              survey_id: newSurvey?.id,
              questions: resQuestions?.questions?.map(({ id: _, ...restQuestion }) => restQuestion),
            });
          } catch (e) {
            showMessage(e?.message || t('errorMessage.title'));
          }
          fetchSurveyList();
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
        history.push(`/survey/view/${id}/edit`);
      } else if (key == 'delete') {
        setSelectedData(row);
        setShowDelete(true);
      } else if (key == 'inactive') {
        actionToDraft(id);
      } else if (key == 'active') {
        //
      } else if (key === 'report') {
        history.push(`/survey/view/${id}/report`);
      } else if (key === 'copy') {
        actionToCopy(row);
      } else if (key === 'date') {
        setSelectedData(row);
        setChangeDate(true);
      }
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
    fetchSurveyList();
  }, [currentStatus, category, pageNumber, sizePerPage, searchValue, sortKey, sortOrder]);

  const data = useData();

  useEffect(() => {
    if (data?.survey_statuses?.length > 0) {
      setCurrentStatus(data?.survey_statuses?.[0]);
    }
  }, [data]);

  return (
    <>
      <Row>
        <Row>
          <Col lg={12}>
            <Link to="/survey/create">
              <Button type="button" variant="info" size="sm" className="text-uppercase br-8">
                <span className="m-0 font-weight-bold d-flex align-items-center">
                  <AddCircleOutline className="w-19" />
                  &nbsp;{t('common.create')}
                </span>
              </Button>
            </Link>

            <Row>
              {data?.survey_statuses?.map((status) => {
                const isActive = status?.code === currentStatus?.code;
                return (
                  <Col lg={4} key={status?.code} className="mb-4">
                    <Card
                      className={`custom-card rounded-3 border ${isActive ? 'border-info' : ''}`}
                      onClick={() => {
                        setCurrentStatus(status);
                      }}
                    >
                      <Card.Body className="text-center">
                        <strong>{status?.name}</strong>
                        <p className="m-0">{isActive ? tableTotalCount : totalSurvey - tableTotalCount} судалгаа</p>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            <Card className="mb-3 no-border-radius">
              <Card.Body className="">
                <DTable
                  currentPage={pageNumber}
                  // checkable="false"
                  // onCheckable={false}
                  // remote
                  onInteraction={onInteraction}
                  selectMode="radio"
                  config={config}
                  columns={column}
                  data={tableData?.map((td) => ({
                    ...td,
                    contextMenuKeys: currentStatus.code === 'DRAFT' ? ['edit', 'copy', 'delete'] : ['report', 'date', 'copy', 'inactive'],
                  }))}
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

      {changeDate && selectedData && <ChangeDateModal show={changeDate} setShow={setChangeDate} onSubmit={actionToChangeDate} survey={selectedData} />}
      {showDelete && selectedData && (
        <DeleteType
          onClose={() => {
            setShowDelete(false);
            setSelectedData(null);
          }}
          onDelete={() => actionToDelete(selectedData.id)}
          title={t('warning.delete')}
          modalSize="md"
        >
          <p className="font-pd text-black text-center mb-0">
            {t('warning.delete_confirmation')} {t('warning.delete_confirmation_description')}
          </p>
        </DeleteType>
      )}
    </>
  );
};

export default SurveyListContainer;
