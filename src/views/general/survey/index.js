import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import SurveyListContainer from 'survey/containers/Survey';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useTranslation } from 'react-i18next';
import { AddCircleOutline, BorderColorTwoTone, DeleteTwoTone, HighlightOff, PlaylistAddCheckCircleOutlined } from '@mui/icons-material';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone';
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone';
import ManageHistoryTwoToneIcon from '@mui/icons-material/ManageHistoryTwoTone';
import { Link, useHistory } from 'react-router-dom';
import TreeView from 'modules/TreeView';
import './css/app.css'

import 'css/dashboard.css';

import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import { fetchRequest } from 'utils/fetchRequest';
import { surveyIndex, surveyCategorySubmit, surveyUnpublish, surveyChangeDate, surveyDelete, surveyDuplicate } from 'utils/fetchRequest/Urls';

import DTable from 'modules/DataTable/DTable';
import DeleteModal from 'modules/DeleteModal';

import showMessage from 'modules/message';
import AddCategory from './modal/AddCategory'
import ChangeDateModal from './modal/ChangeDate';

const SurveyPage = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: 'survey/index', text: t('dashboard.survey') },
    ];

    const { selectedSchool } = useSelector((state) => state.schoolData);
    const loading = useSelector((state) => state.loading);

    const [selectedTreeId, setSelectedTreeId] = useState('');
    const [categories, setCategories] = useState([]);
    const [flatCategories, setFlatCategories] = useState([])
    const [showAddCategory, setShowAddCategory] = useState(false)

    const categoryContextMenus = []

    const [questionTypes, setQuestionTypes] = useState([])
    const [userTypes, setUserTypes] = useState([])

    const [statuses, setStatuses] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [selectedStatusCode, setSelectedStatusCode] = useState(null)

    const [tableTotalCount, setTableTotalCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [tableData, setTableData] = useState([]);

    const [changeDate, setChangeDate] = useState(false);
    const [showDelete, setShowDelete] = useState(false)
    const [selectedData, setSelectedData] = useState(null)

    const [updateView, setUpdateView] = useState(false)

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
            dataField: 'categoryName',
            text: t('survey.category'),
            sort: true,
        },
        {
            dataField: 'typeName',
            text: t('survey.participants'),
            sort: true,
        },
        {
            dataField: 'startDate',
            text: t('survey.startDate'),
            sort: true,
            formatter: (cell, row, rowIndex) => {
                return cell ? cell?.date?.substring(0, 10) : '';
            },
        },
        {
            dataField: 'endDate',
            text: t('survey.endDate'),
            sort: true,
            formatter: (cell, row, rowIndex) => {
                return cell ? cell?.date?.substring(0, 10) : '';
            },
        },
        {
            dataField: 'firstName',
            text: t('survey.registered'),
            sort: true,
        },
        {
            dataField: 'publishDate',
            text: t('survey.publishedDate'),
            sort: true,
            formatter: (cell, row, rowIndex) => {
                return cell ? cell?.date?.substring(0, 10) : '';
            },
        },
    ];

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: false,
        showPagination: true,
        showFilter: true,
        footer: false,
    };

    const fetchIndex = async (selectedCategoryId = null, selectedStatusId = null, page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
        const postData = {
            school: selectedSchool?.id,
            page,
            pageSize,
            query,
            sortBy,
            order,
            category: selectedCategoryId,
            status: selectedStatusId
        };
        dispatch(setLoading(true));
        fetchRequest(surveyIndex, 'POST', postData)
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setStatuses(res?.statuses)
                    setSelectedStatus(res?.selectedStatus)
                    setSelectedStatusCode(res?.selectedStatusCode)
                    setCategories(res?.categories)
                    setFlatCategories(res?.flatCategories.map(obj => {
                        return {
                            value: obj?.id,
                            text: obj?.name
                        }
                    }))
                    setQuestionTypes(res?.questionTypes)
                    setUserTypes(res?.types)
                    setTableTotalCount(res?.totalCount)
                    setTableData(res?.surveys)
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    useEffect(() => {
        fetchIndex()
    }, [])

    const handleTreeClick = (array) => {
        const [id] = array;
        setSelectedTreeId(id);

        fetchIndex(id, selectedStatus)
    };

    const categorySubmit = (params) => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            ...params
        };
        fetchRequest(surveyCategorySubmit, 'POST', postData)
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setCategories(res?.categories)
                    setFlatCategories(res?.flatCategories.map(obj => {
                        return {
                            value: obj?.id,
                            text: obj?.name
                        }
                    }))

                    setShowAddCategory(false)
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    }

    const unPublish = (id) => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            page: pageNumber,
            pageSize: sizePerPage,
            query: searchValue,
            sort: sortKey,
            order: sortOrder,
            id
        };
        fetchRequest(surveyUnpublish, 'POST', postData)
            .then(async (res) => {
                const { message = null, success = false } = res;
                if (success) {
                    setStatuses(res?.statuses)
                    setTableTotalCount(res?.totalCount)
                    setTableData(res?.surveys)
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

    const deleteSubmit = (id) => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            page: pageNumber,
            pageSize: sizePerPage,
            query: searchValue,
            sortBy: sortKey,
            order: sortOrder,
            category: selectedTreeId,
            status: selectedStatus,
            id,
        };
        fetchRequest(surveyDelete, 'POST', postData)
            .then(async (res) => {
                if (res?.success) {
                    setSelectedData(null)
                    setShowDelete(false);

                    setStatuses(res?.statuses)
                    setTableTotalCount(res?.totalCount)
                    setTableData(res?.surveys)
                } else {
                    showMessage(res?.message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            })
    };

    const copySurvey = (id) => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            id,
        };
        fetchRequest(surveyDuplicate, 'POST', postData)
            .then(async (res) => {
                if (res?.success) {
                    showMessage(res?.message);
                    history.replace(`/survey/view/${res?.id}/edit`, {
                        userTypes,
                        categories
                    });
                } else {
                    showMessage(res?.message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            })
    }

    const actionToChangeDate = (postData) => {
        dispatch(setLoading(true));
        fetchRequest(surveyChangeDate, 'POST', { ...{ school: selectedSchool?.id }, ...postData })
            .then(async (res) => {
                const { message = null, success = false } = res;
                if (success) {
                    const tableList = tableData;
                    for (let tt = 0; tt < tableList.length; tt++) {
                        if (tableList[tt]?.id === res?.id) {
                            tableList[tt].startDate = res?.startDate;
                            tableList[tt].endDate = res?.endDate;
                        }
                    }
                    setChangeDate(false)
                    setSelectedData(null)
                    setTableData(tableList)
                    setUpdateView(!updateView)
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
                unPublish(id)
            } else if (key === 'report') {
                history.push(`/survey/view/${id}/report`);
            } else if (key === 'copy') {
                copySurvey(id);
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

    return (
        <div>
            <div className="mb-3">
                <h2 className="font-standard mb-0">{t('dashboard.survey')}</h2>
                <BreadcrumbList basePath="/" key={1} items={breadcrumbs} />
            </div>
            <Row>
                <Col md={3}>
                    <div className="">
                        <Button
                            type="button"
                            variant="info"
                            size="sm"
                            className="text-uppercase br-8"
                            onClick={() => {
                                setShowAddCategory(true)
                            }}
                        >
                            <span className="m-0 font-weight-bold d-flex align-items-center">
                                <AddCircleOutline className="w-19" />
                                &nbsp;{t('common.Category')} {t('common.create')}
                            </span>
                        </Button>
                    </div>
                    <div className="bg-white p-5">
                        {
                            categories && categories.length > 0 && <TreeView
                                selectedNodes={[selectedTreeId]}
                                onSelect={(e) => handleTreeClick(e)}
                                treeData={categories}
                                contextMenus={categoryContextMenus}
                            />
                        }
                    </div>
                </Col>
                <Col>
                    <Link to={{
                        pathname: "/survey/create",
                        state: {
                            categories: flatCategories,
                            questionTypes: questionTypes,
                            userTypes: userTypes
                        }
                    }}
                    >
                        <Button type="button" variant="info" size="sm" className="text-uppercase br-8">
                            <span className="m-0 font-weight-bold d-flex align-items-center">
                                <AddCircleOutline className="w-19" />
                                &nbsp;{t('common.create')}
                            </span>
                        </Button>
                    </Link>

                    <Row>
                        {statuses?.map((status) => {
                            const isActive = status?.id === selectedStatus;
                            return (
                                <Col lg={4}
                                    key={status?.id}
                                    className="mb-4">
                                    <Card
                                        className={`custom-card rounded-3 border ${isActive ? 'border-info' : ''}`}
                                        onClick={() => {
                                            setSelectedStatus(status?.id);
                                            setSelectedStatusCode(status?.code)
                                            fetchIndex(selectedTreeId, status?.id)
                                        }}
                                    >
                                        <Card.Body className="text-center">
                                            <strong>{status?.name}</strong>
                                            <p className="m-0">{status.count} судалгаа</p>
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
                                remote
                                onInteraction={onInteraction}
                                selectMode="radio"
                                config={config}
                                columns={column}
                                data={tableData?.map((td) => ({
                                    ...td,
                                    contextMenuKeys: selectedStatusCode === 'DRAFT' ? ['edit', 'copy', 'delete'] : ['report', 'date', 'copy', 'inactive'],
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

            <AddCategory
                show={showAddCategory}
                categories={flatCategories}
                setShow={setShowAddCategory}
                onSubmit={(values) => {
                    categorySubmit(values);
                }}
            />

            {showDelete && selectedData && (
                <DeleteModal
                    onClose={() => {
                        setShowDelete(false);
                        setSelectedData(null);
                    }}
                    onDelete={() => deleteSubmit(selectedData.id)}
                    title={t('warning.delete')}
                    modalSize="md"
                >
                    <p className="font-pd text-black text-center mb-0">
                        {t('warning.delete_confirmation')} {t('warning.delete_confirmation_description')}
                    </p>
                </DeleteModal>
            )}

            {changeDate && selectedData
                && <ChangeDateModal show={changeDate} setShow={setChangeDate} onSubmit={actionToChangeDate} survey={selectedData} />}
        </div>
    );
};

export default SurveyPage;