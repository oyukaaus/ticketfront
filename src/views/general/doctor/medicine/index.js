import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import { 
    BorderColorTwoTone, 
    DeleteTwoTone, 
    AddCircleOutline, 
    HighlightOff, 
    PlaylistAddCheckCircleOutlined, 
    HighlightOffRounded
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import {
    doctorMedicineIndex,
    doctorMedicineSubmit,
    doctorMedicineEdit,
    doctorMedicineSetActive,
    doctorMedicineSetInactive,
    doctorMedicineDelete
} from 'utils/fetchRequest/Urls';
import DTable from 'modules/DataTable/DTable';
import DeleteType from 'modules/DeleteModal';
import AddMedicine from './add';
import EditMedicine from './edit';
import SetInactive from './setInactive';
import 'css/dashboard.css';

const index = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const current = new Date();
    const dateTimeToday = current.getFullYear() + "-" + ("00" + (current.getMonth() + 1)).slice(-2) + "-" + ("00" + (current.getDate())).slice(-2) + " " + current.getHours() + ":" + ("00" + (current.getMinutes())).slice(-2) + ":" + ("00" + (current.getSeconds())).slice(-2);
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [selectedData, setSelectedData] = useState(null);

    const [showAddMedicine, setShowAddMedicine] = useState(false);
    const [showEditMedicine, setShowEditMedicine] = useState(false);
    const [showSetInactiveMedicine, setShowSetInactiveMedicine] = useState(false);
    const [showDeleteMedicine, setShowDeleteMedicine] = useState(false);

    const [tableTotalCount, setTableTotalCount] = useState(0)
    const [pageNumber, setPageNumber] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: 'doctor/medicine-registration', text: t('doctorsCorner.medicineRegistration') },
    ];

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: false,
        showPagination: true,
        showFilter: true,
        footer: false,
        excelFileName: t('doctorsCorner.medicineRegistration') + ' ' + dateTimeToday
    };

    const contextMenuArray = [
        {
            key: 'edit',
            title: t('common.edit'),
            icon: <BorderColorTwoTone className='color-info' />,
        },
        {
            key: 'delete',
            title: t('common.delete'),
            icon: <DeleteTwoTone className='color-info' />,
        },
        {
            key: 'inactive',
            title: t('action.setInactive'),
            icon: <HighlightOff className='color-info' />,
        },
        {
            key: 'active',
            title: t('action.setActive'),
            icon: <PlaylistAddCheckCircleOutlined className='color-info' />,
        },
    ];

    const column = [
        {
            dataField: 'isActive',
            text: t('foodManagement.status'),
            colType: 'status',
            sort: false,
            headerStyle: () => ({
                width: 90,
                textAlign: 'center'
            }),
            style: {
                textAlign: 'center',
                verticalAlign: 'middle'
            },
            formatter: (cell) => {
                return <i className={`icon-1_5x ${cell ? 'main-green' : 'main-gray'} fa fa-circle`} />
            }
        },
        {
            dataField: 'code',
            text: t('common.code'),
            sort: true,
        },
        {
            dataField: 'name',
            text: t('doctorsCorner.medicineName'),
            sort: true,
        },
    ];

    const onSetActiveMedicineHandler = (id) => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            medicine: [id],
        }
        fetchRequest(doctorMedicineSetActive, 'POST', postData)
            .then(res => {
                const { list = [], message = null, success = false } = res
                if (success) {
                    setTableData(list)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    const handleContextMenuClick = (id, key, row) => {
        if (id && key) {
            if (key === 'edit') {
                setSelectedData(row)
                setShowEditMedicine(true)
            } else if (key == 'delete') {
                setSelectedData(id)
                setShowDeleteMedicine(true)
            } else if (key == 'inactive') {
                setSelectedData(id)
                setShowSetInactiveMedicine(true)
            } else if (key == 'active') {
                onSetActiveMedicineHandler(id)
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
            ...params
        }
        dispatch(setLoading(true));

        fetchRequest(doctorMedicineSubmit, 'POST', postData)
            .then(res => {
                const { list = [], message = null, success = false } = res
                if (success) {
                    setTableData(list)
                    if (!params.registerAgain) {
                        setShowAddMedicine(false)
                    }
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    const onEditMedicineHandler = (params) => {
        dispatch(setLoading(true));
        const postData = {
            ...{ school: selectedSchool?.id },
            ...{ medicine: selectedData?.id },
            ...params
        }
        fetchRequest(doctorMedicineEdit, 'POST', postData)
            .then(res => {
                const { list = [], message = null, success = false } = res
                if (success) {
                    setTableData(list)
                    setShowEditMedicine(false)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    const onSetInactiveMedicineHandler = () => {
        dispatch(setLoading(true));
        const postData = {
            ...{ school: selectedSchool?.id },
            ...{ medicine: [selectedData] },
        }
        fetchRequest(doctorMedicineSetInactive, 'POST', postData)
            .then(res => {
                const { list = [], message = null, success = false } = res
                if (res.success) {
                    setTableData(list)
                    setShowSetInactiveMedicine(false)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'), success)
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
        }
        fetchRequest(doctorMedicineSetInactive, 'POST', postData)
            .then(res => {
                const { list = [], message = null, success = false } = res
                if (res.success) {
                    setTableData(list)
                    setShowSetInactiveMedicine(false)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'), success)
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
        }
        fetchRequest(doctorMedicineDelete, 'POST', postData)
            .then(res => {
                const { list = [], message = null, success = false } = res
                if (success) {
                    setTableData(list)
                    setShowDeleteMedicine(false)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'), success)
                }
                dispatch(setLoading(false));
            })
            .catch(() => { 
                dispatch(setLoading(false));
            });
    };

    const handlerCheckable = (type, i, value, sr) => {
        if (type == 'allCheck' && value == false) {
            setSelectedRows([])
        } else {
            setSelectedRows(sr.map((param) => tableData.find((p, ind) => ind == param).id))
        }
    };

    const onInteraction = (obj) => {
        setSizePerPage(obj.pageSize)
        setPageNumber(obj.page)
        setSearchValue(obj.search)
        setSortKey(obj.sort)
        setSortOrder(obj.order)
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
        }
        fetchRequest(doctorMedicineIndex, 'POST', postData)
            .then(res => {
                const { list = [], page = 1, pageSize = 10, query = '', totalCount = 0, success = false, message = null } = res
                if (success) {
                    setTableData(list)
                    setPageNumber(page)
                    setSizePerPage(pageSize)
                    setSearchValue(query)
                    setTableTotalCount(totalCount)
                } else {
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }, [pageNumber, sizePerPage, searchValue, sortKey, sortOrder]);

    return (
        <>
            <Row>
                <Col lg={12} className="mb-3">
                    <h2 className='font-standard mb-0'>
                        {t('doctorsCorner.medicineRegistration')}
                    </h2>
                    <BreadcrumbList
                        basePath='/'
                        key={1}
                        items={breadcrumbs}
                    />
                </Col>
                <Row>
                    <Col lg={12}>
                        <Button
                            type="button"
                            variant="info"
                            size="sm"
                            className="text-uppercase br-8"
                            onClick={onAddMedicineClick}
                        >
                            <span className='m-0 font-weight-bold d-flex align-items-center'>
                                <AddCircleOutline className="w-19" />
                                &nbsp;{t('common.register')}
                            </span>
                        </Button>
                        {
                            selectedRows && selectedRows.length > 0 &&
                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                className="ms-2 top-btn br-8"
                                onClick={() => onSetInactiveSelectedMedicineHandler()}
                            >
                                <span className='m-0 font-weight-bold d-flex align-items-center'>
                                    <HighlightOffRounded className="w-19" />
                                    &nbsp;{t('action.setInactive')}
                                </span>
                            </Button>
                        }
                        <Card className="mb-3 no-border-radius">
                            <Card.Body className="">
                                <DTable
                                    currentPage={pageNumber}
                                    checkable="true"
                                    onCheckable={handlerCheckable}
                                    remote
                                    onInteraction={onInteraction}
                                    selectMode='radio'
                                    config={config}
                                    columns={column}
                                    data={tableData}
                                    individualContextMenus='true'
                                    contextMenus={contextMenuArray}
                                    totalDataSize={tableTotalCount}
                                    onContextMenuItemClick={handleContextMenuClick}
                                    excelExportUrl='url'
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
            {showAddMedicine &&
                <AddMedicine
                    show={showAddMedicine}
                    setShow={setShowAddMedicine}
                    onSubmit={onSubmitMedicineHandler}
                />
            }
            {showEditMedicine &&
                <EditMedicine
                    selectedData={selectedData}
                    show={showEditMedicine}
                    setShow={setShowEditMedicine}
                    onSubmit={onEditMedicineHandler}
                />
            }
            {showSetInactiveMedicine &&
                <SetInactive
                    setShow={setShowSetInactiveMedicine}
                    onInactive={onSetInactiveMedicineHandler}
                />
            }
            {showDeleteMedicine && selectedData && (
                <DeleteType
                    onClose={onModalClose}
                    onDelete={onDeleteMedicineHandler}
                    title={t('warning.delete')}
                    modalSize='md'
                >
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteType>
            )}
        </>
    );
};

export default index;
