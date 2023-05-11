import React, { useState, useEffect, useRef } from 'react';
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
import { format, formatISO } from 'date-fns';
import 'css/dashboard.css';
import useData from 'survey/hooks/useData';
import useLocalStorage from 'survey/hooks/useLocalStorage';
import ChangeDateModal from './ChangeDateModal';
import deepEqual from '../../utils/deep';

const SurveyListContainer = (props) => {
  const [counts, setCounts] = useState({ PUBLISH: 0, DRAFT: 0 });
  const history = useHistory();
  const [currentStatus, setCurrentStatus] = useLocalStorage('current-status', {
    code: 'PUBLISH',
    color: '',
    id: 1,
    name: 'Нийтэлсэн',
  });
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
  const loading = useSelector((state) => state.loading);
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
          <Link to={`/survey/view/${row.id}`} className="underline" style={{ color: '#4037d7' }}>
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
      formatter: (cell, row, rowU) => {
        return row?.created_user_id
          ? `${row?.created_user_last_name !== null ? row?.created_user_last_name : ''} ${
              row?.created_user_first_name !== null ? row?.created_user_first_name : ''
            }`
          : '-';
      },
    },
    {
      dataField: 'created_date',
      text: t('survey.publishedDate'),
      sort: true,
      formatter: (cell, row, rowIndex) => {
        return cell ? format(new Date(cell), 'yyyy-MM-dd HH:mm') : '-';
      },
    },
  ];

  const isFetchedRef = useRef();

  const fetchSurveyList = async () => {
    const postData = {
      school: selectedSchool?.id,
      page: pageNumber,
      page_size: sizePerPage,
      query: searchValue,
     
      sortBy: sortKey,
      order: sortOrder,

      order_field: sortKey,
      order_direction: sortOrder === 'ASC' ? 1 : 0,

      category_id: category,
      status_id: currentStatus?.id || '',
      type_id: '',
    };

    if (currentStatus) {
      dispatch(setLoading(true));
      return fetchRequest(surveyIndex, 'POST', postData)
        .then((res) => {
          const { surveys = [], count, page = 1, query = '', success = false, message = null, status_counts: statusCounts } = res;
          if (success) {
            setTableData(surveys);
            setPageNumber(page);
            setSizePerPage(res?.page_size || 10);
            setSearchValue(query);
            setTableTotalCount(count);
            const P = statusCounts?.find((sc) => sc.code === 'PUBLISH');
            const D = statusCounts?.find((sc) => sc.code === 'DRAFT');
            setCounts({
              PUBLISH: P?.survey_count || 0,
              DRAFT: D?.survey_count || 0,
            });
          } else {
            showMessage(message || t('errorMessage.title'));
          }
          dispatch(setLoading(false));
        })
        .catch((e) => {
          dispatch(setLoading(false));
          showMessage(t('errorMessage.title'));
        });
    }
    return Promise.resolve();
  };

  const actionToDelete = (id) => {
    dispatch(setLoading(true));
    const postData = {
      id,
    };
    fetchRequest(surveyDelete, 'POST', postData)
      .then(async (res) => {
        setShowDelete(false);
        const { message = null, success = false } = res;
        if (success) {
          setCounts({ ...counts, [currentStatus.code]: counts[currentStatus.code] - 1 });
          await fetchSurveyList();
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
      .then(async (res) => {
        const { message = null, success = false } = res;
        if (success) {
          setCounts({
            DRAFT: counts.DRAFT + 1,
            PUBLISH: counts.PUBLISH - 1,
          });
          await fetchSurveyList();
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
      .then(async (res) => {
        const { message = null, success = false } = res;
        if (success) {
          setChangeDate(false);
          setSelectedData(null);
          await fetchSurveyList();
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

  const actionToCopy = async (survey) => {
    const { id, ...rest } = survey;
    dispatch(setLoading(true));
    const postData = {
      ...rest,
      status_id: 2,
      grades: rest?.grades?.map((g) => g.gradeId),
      classes: rest?.classes?.map((cl) => cl.id),
      system_roles: rest?.roles?.map((sro) => sro.id),
      start_date: rest?.start_date ? formatISO(new Date(rest?.start_date)) : formatISO(new Date()),
      end_date: rest?.end_date ? formatISO(new Date(rest?.end_date)) : formatISO(new Date()),
    };

    try {
      const resForUsers = await fetchRequest(surveyQuestionsIndex, 'POST', {
        survey_id: id,
      });
      if (resForUsers?.success) {
        postData.system_users = resForUsers?.survey?.system_users?.map((su) => su.id);
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
                setCounts({ ...counts, DRAFT: counts.DRAFT + 1 });
              } catch (e) {
                showMessage('336:' + e?.message || t('errorMessage.title'));
              }
              await fetchSurveyList();
              showMessage(message, success);
            } else {
              showMessage('341:' + message || t('errorMessage.title'));
            }
            dispatch(setLoading(false));
          })
          .catch(() => {
            dispatch(setLoading(false));
            showMessage('347:' + t('errorMessage.title'));
          });
      }
    } catch (e) {
      dispatch(setLoading(false));
      showMessage('352:' + t('errorMessage.title'));
    }
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
    if (!isFetchedRef.current) {
      fetchSurveyList();
      isFetchedRef.current = { currentStatus, category, pageNumber, sizePerPage, searchValue, sortKey, sortOrder };
    } else {
      const KEY = { currentStatus, category, pageNumber, sizePerPage, searchValue, sortKey, sortOrder };
      if (!deepEqual(KEY, isFetchedRef.current)) {
        fetchSurveyList();
        isFetchedRef.current = KEY;
      }
    }
  }, [currentStatus, category, pageNumber, sizePerPage, searchValue, sortKey, sortOrder]);

  const data = useData();

  useEffect(() => {
    setPageNumber(1);
  }, [currentStatus]);

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
                      className={`custom-card border ${isActive ? 'border-info' : 'border-white'}`}
                      style={{ borderRadius: '8px' }}
                      onClick={() => {
                        setCurrentStatus(status);
                      }}
                    >
                      <Card.Body className="text-center">
                        <strong>{status?.name}</strong>
                        <p className="m-0">{counts[status.code]} судалгаа</p>
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
                  remote
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
