/* eslint no-useless-escape: 0 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TuneRounded } from '@mui/icons-material';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, PointElement, LinearScale, LineElement, BarElement, Title } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { generateColor } from 'utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { doctorDashboardIndex, doctorDashboardDetails } from 'utils/fetchRequest/Urls';
import DTable from 'modules/DataTable/DTable';
import DatePicker from "modules/Form/DatePicker";
import DatePickerRange from "modules/Form/DatePickerRange";
import 'css/food.css';

const index = () => {
    ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const current = new Date();
    const dateTimeToday = current.getFullYear() + "-" + ("00" + (current.getMonth() + 1)).slice(-2) + "-" + ("00" + (current.getDate())).slice(-2) + " " + current.getHours() + ":" + ("00" + (current.getMinutes())).slice(-2) + ":" + ("00" + (current.getSeconds())).slice(-2);

    const [tabIndex] = useState('ate_food_students_tab_index')
    const [tabKey, setTabKey] = useState('INSPECTION');

    const [inspectionStartDate, setInspectionStartDate] = useState('');
    const [inspectionEndDate, setInspectionEndDate] = useState('');
    const [inspectionTableCount, setInspectionTableCount] = useState(0);
    const [inspectionTableData, setInspectionTableData] = useState([]);
    const [inspectionCurrentPage, setInspectionCurrentPage] = useState(1);

    const [medicineStartDate, setMedicineStartDate] = useState('');
    const [medicineEndDate, setMedicineEndDate] = useState('');
    const [medicineCurrentPage, setMedicineCurrentPage] = useState(1);
    const [medicineTableCount, setMedicineTableCount] = useState(0);
    const [medicineTableData, setMedicineTableData] = useState([]);

    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [errorDueDate, setErrorDueDate] = useState(false);
    const [stackData, setStackData] = useState(
        {
            labels: [],
            datasets: [
                {
                    label: t('doctorsCorner.inspected'),
                    data: [],
                    borderColor: 'rgb(255, 91, 29)',
                    backgroundColor: 'rgba(255, 91, 29, 0.5)',
                    tension: 0.3
                },
            ],
        }
    );
    const [lineData, setLineData] = useState(
        {
            labels: [],
            datasets: [
                {
                    label: t('doctorsCorner.inspected'),
                    data: [],
                    borderColor: 'rgb(255, 91, 29)',
                    backgroundColor: 'rgba(255, 91, 29, 0.5)',
                    tension: 0.3
                },
            ],
        }
    );
    const [types] = useState([
        {
            id: 'INSPECTION',
            name: t('doctorsCorner.withInspection')
        },
        {
            id: 'MEDICINE',
            name: t('doctorsCorner.withMedicine')
        },
    ]);

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/doctor/dashboard', text: t('dashboard.title') },

    ];

    const stackOptions = {
        plugins: {
            title: {
                display: false,
                text: 'Chart.js Bar Chart - Stacked',
            },
            legend: {
                labels: {
                    font: {
                        size: 14,
                        family: 'Mulish',
                        weight: 'bold',
                        color: '#575962',
                    }
                }
            }
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    font: {
                        size: 14,
                        family: 'Mulish',
                        weight: 'bold',
                        color: '#575962',
                    }
                },
            },
            y: {
                min: 0,
                stepSize: 10,
                stacked: true,
                ticks: {
                    font: {
                        size: 14,
                        family: 'Mulish',
                        weight: 'bold',
                        color: '#575962',
                    },
                    stepSize: 1
                },
            },
        },
    };

    const inspectionConfig = {
        showAllData: true,
        excelExport: true,
        printButton: false,
        columnButton: false,
        showPagination: false,
        showFilter: true,
        footer: true,
        footerStyle: {
            backgroundColor: '#ebecf5',
            fontWeight: 'bold',
            fontSize: '15px'
        },
        excelFileName: t('doctorsCorner.withInspection') + ' ' + dateTimeToday
    };

    const medicineConfig = {
        excelExport: true,
        printButton: false,
        columnButton: false,
        showPagination: true,
        showFilter: true,
        footer: true,
        footerStyle: {
            backgroundColor: '#ebecf5',
            fontWeight: 'bold',
            fontSize: '15px'
        },
        excelFileName: t('doctorsCorner.withMedicine') + ' ' + dateTimeToday
    };

    const loadData = () => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            type: tabKey === 1 ? 'CLASS' : (tabKey === 2 ? "STUDENT" : "REPORT")
        }
        fetchRequest(doctorDashboardIndex, 'POST', postData)
            .then(res => {
                const { dates = [], visits = [], datesOfMonth = [], studentVisitsOfMonth = [], userVisitsOfMonth = [], success = false, message = null } = res
                if (success) {
                    setLineData(
                        {
                            labels: dates,
                            datasets: [
                                {
                                    label: t('doctorsCorner.inspected'),
                                    data: visits,
                                    borderColor: 'rgb(255, 91, 29)',
                                    backgroundColor: 'rgba(255, 91, 29, 0.5)',
                                    tension: 0.3
                                },
                            ],
                        }
                    )
                    setStackData(
                        {
                            labels: datesOfMonth,
                            datasets: [
                                {
                                    label: t('student.title'),
                                    data: studentVisitsOfMonth,
                                    backgroundColor: generateColor(),
                                },

                                {
                                    label: t('menu.teacherStaff'),
                                    data: userVisitsOfMonth,
                                    backgroundColor: generateColor(),
                                },
                            ]
                        }
                    )
                } else {
                    showMessage(message || t('errorMessage.title'), false)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }

    const loadDetails = (type = null, startDate = null, endDate = null, page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            type,
            startDate,
            endDate,
            page,
            pageSize,
            query,
            sortBy,
            order
        }
        fetchRequest(doctorDashboardDetails, 'POST', postData)
            .then(res => {
                const { list = [], totalCount = 0, success = false, message = null } = res
                if (success) {
                    if (type === 'MEDICINE') {
                        setMedicineCurrentPage(res.page);
                        setMedicineTableData(list);
                        setMedicineTableCount(totalCount);
                    } else if (type === 'INSPECTION') {
                        setInspectionCurrentPage(res.page);
                        setInspectionTableCount(totalCount);
                        setInspectionTableData(list);
                    }
                } else {
                    showMessage(message || t('errorMessage.title'), false)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }

    useEffect(() => {
        const selectedTabIndex = localStorage.getItem(tabIndex);
        if (selectedTabIndex) {
            setTabKey(selectedTabIndex);
        }
        loadData();
    }, [])

    const column = [
        {
            dataField: 'className',
            text: t('foodManagement.className'),
            sort: true,
            footer: '',
            formatter: (cell) => cell || '-'
        },
        {
            dataField: 'code',
            text: t('common.code'),
            sort: true,
            footer: '',
        },
        {
            dataField: 'firstName',
            text: t('person.firstName'),
            sort: true,
            footer: '',
        },
        {
            dataField: 'lastName',
            text: t('person.lastName'),
            sort: true,
            footer: '',
        },
        {
            dataField: 'diagnosis',
            text: t('doctorsCorner.diagnosis'),
            sort: true,
            footer: '',
        },
        {
            dataField: 'medicines',
            text: t('doctorsCorner.takenMedicine'),
            sort: true,
            style: {
                textAlign: 'right',
            },
            footer: '',
            footerType: 'sum',
            footerAlign: 'right',
        },
    ];

    const medicineColumn = [
        {
            dataField: 'code',
            text: t('doctorsCorner.medicineCode'),
            sort: true,
            footer: '',
        },
        {
            dataField: 'name',
            text: t('doctorsCorner.medicineName'),
            sort: true,
            footer: '',
        },
        {
            dataField: 'usedMedicine',
            text: t('doctorsCorner.count'),
            sort: true,
            style: {
                textAlign: 'right',
            },
            footer: '',
            footerType: 'sum',
            footerAlign: 'right',
        },
    ];

    const onStudentSeeClick = () => {
        if (medicineStartDate && medicineEndDate) {
            setErrorDueDate(false);
            loadDetails('MEDICINE', medicineStartDate, medicineEndDate);
        } else {
            setErrorDueDate(true);
        }
    }

    const onSeeClick = () => {
        console.log('See', inspectionStartDate)
        if (inspectionStartDate && inspectionEndDate) {
            setErrorDueDate(false);
            loadDetails('INSPECTION', inspectionStartDate, inspectionEndDate);
        } else {
            setErrorDueDate(true);
        }
    };

    const handleTabChange = key => {
        setTabKey(key);
        setErrorDueDate(false);
        setSortKey('')
        setSortOrder('')
        localStorage.setItem(tabIndex, key)
    };

    const handleInspectionDateChange = (value) => {
        if (value && value.length > 0) {
            setInspectionStartDate(value[0]?.startDate || '')
            setInspectionEndDate(value[0]?.endDate || '')
        }
    }

    const handleMedicineDateChange = (value) => {
        if (value && value.length > 0) {
            setMedicineStartDate(value[0]?.startDate || '')
            setMedicineEndDate(value[0]?.endDate || '')
        }
    };

    const onInteraction = (obj = null) => {
        if (tabKey === 'INSPECTION') {
            setSortKey(obj?.sort)
            setSortOrder(obj?.order)
            loadDetails('INSPECTION', inspectionStartDate, inspectionEndDate, obj?.page, obj?.pageSize, obj?.search, obj?.sort, obj?.order);
        }
        if (tabKey === 'MEDICINE') {
            setSortKey(obj?.sort)
            setSortOrder(obj?.order)
            loadDetails('MEDICINE', medicineStartDate, medicineEndDate, obj?.page, obj?.pageSize, obj?.search, obj?.sort, obj?.order);
        }
    }

    const renderTab = () => {
        const tabs = {
            'INSPECTION':
                <Col sm={12} className='pe-0'>
                    <Card className="mb-3 no-border-radius">
                        <Card.Body className="">
                            <Row>
                                <Col sm={3}></Col>
                                <Col sm={3} className='d-flex p-0'>
                                    <label className='modal-label'>
                                        {t('common.date')}
                                    </label>
                                    <DatePickerRange
                                        onChange={(val) => handleInspectionDateChange(val)}
                                        firstPlaceHolder={t('common.startDate')}
                                        lastPlaceHolder={t('common.endDate')}
                                        selectedStartDate={inspectionStartDate}
                                        selectedEndDate={inspectionEndDate}
                                        isDisabled={false}
                                        clearable={true}
                                        disableWithFirst={true}
                                        disableWithLast={true}
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Button
                                        variant="aqua"
                                        className='text-white text-uppercase br-8 py-2'
                                        onClick={onSeeClick}
                                    >
                                        <TuneRounded />
                                        {t('common.see')}
                                    </Button>
                                </Col>
                            </Row>
                            {
                                errorDueDate &&
                                <Row>
                                    <Col sm={3}></Col>
                                    <Col sm={3} className='d-flex p-0 text-center'>
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.selectDate')}
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                    </Col>
                                </Row>
                            }
                        </Card.Body>
                    </Card>
                    <Card className="mb-3 no-border-radius">
                        <Card.Body className="">
                            <DTable
                                currentPage={inspectionCurrentPage}
                                remote
                                selectMode='radio'
                                config={inspectionConfig}
                                columns={column}
                                data={inspectionTableData}
                                totalDataSize={inspectionTableCount}
                                onInteraction={onInteraction}
                                excelExportUrl={doctorDashboardDetails}
                                exportExportParams={{
                                    school: selectedSchool?.id,
                                    type: 'INSPECTION',
                                    startDate: inspectionStartDate,
                                    endDate: inspectionEndDate,
                                    sortBy: sortKey,
                                    order: sortOrder
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>,
            'MEDICINE':
                <Col sm={12} className='pe-0'>
                    <Card className="mb-3 no-border-radius">
                        <Card.Body className="">
                            <Row>
                                <Col sm={3}></Col>
                                <Col sm={3} className='d-flex p-0'>
                                    <label className='modal-label'>
                                        {t('common.date')}
                                    </label>
                                    <DatePickerRange
                                        onChange={(val) => handleMedicineDateChange(val)}
                                        firstPlaceHolder={t('common.startDate')}
                                        lastPlaceHolder={t('common.endDate')}
                                        selectedStartDate={medicineStartDate}
                                        selectedEndDate={medicineEndDate}
                                        isDisabled={false}
                                        clearable={true}
                                        disableWithFirst={true}
                                        disableWithLast={true}
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Button
                                        variant="aqua"
                                        className='text-white text-uppercase br-8 py-2'
                                        onClick={onStudentSeeClick}
                                    >
                                        <TuneRounded />
                                        {t('common.see')}
                                    </Button>
                                </Col>
                            </Row>
                            {
                                errorDueDate &&
                                <Row>
                                    <Col sm={3}></Col>
                                    <Col sm={3} className='d-flex p-0 text-center'>
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.selectDate')}
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                    </Col>
                                </Row>
                            }
                        </Card.Body>
                    </Card>
                    <Card className="mb-3 no-border-radius">
                        <Card.Body className="">
                            <DTable
                                currentPage={medicineCurrentPage}
                                selectMode='radio'
                                remote
                                config={medicineConfig}
                                columns={medicineColumn}
                                data={medicineTableData}
                                totalDataSize={medicineTableCount}
                                onInteraction={onInteraction}
                                excelExportUrl={doctorDashboardDetails}
                                exportExportParams={{
                                    school: selectedSchool?.id,
                                    type: 'MEDICINE',
                                    startDate: medicineStartDate,
                                    endDate: medicineEndDate,
                                    sortBy: sortKey,
                                    order: sortOrder
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
        };
        return tabs[tabKey];
    };

    const lineOptions = {
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Line Chart',
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14,
                        family: 'Mulish',
                        weight: 'bold',
                        color: '#575962',
                    }
                },
            },
            y: {
                beginAtZero: true,
                min: 0,
                ticks: {
                    font: {
                        size: 14,
                        family: 'Mulish',
                        weight: 'bold',
                        color: '#575962',
                    },
                    stepSize: 1
                },
            }
        }
    };

    return (
        <>
            <Row>
                <Col lg={12} className="mb-3">
                    <h2 className='font-standard mb-0'>
                        {t('dashboard.title')}
                    </h2>
                    <BreadcrumbList
                        basePath='/'
                        key={1}
                        items={breadcrumbs}
                    />
                </Col>
                <Col sm={12} className='font-pinnacle-demibold fs-16 text-info d-flex justify-content-between align-items-center mt-3 mb-2'>
                    <div className='ps-2'>
                        {t('doctorsCorner.inThisWeek')}
                    </div>
                </Col>
                <Row>
                    <Col sm={12} className='pe-0'>
                        <Card className='no-border-radius'>
                            <Card.Body>
                                <Row>
                                    <Col xs={2}></Col>
                                    <Col xs={8}>
                                        <Line height={135} options={lineOptions} data={lineData} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Col sm={12} className='font-pinnacle-demibold fs-16 text-info d-flex justify-content-between align-items-center mt-3 mb-2'>
                    <div className='ps-2'>
                        {t('doctorsCorner.inThisMonth')}
                    </div>
                </Col>
                <Row>
                    <Col sm={12} className='pe-0'>
                        <Card className='no-border-radius'>
                            <Card.Body>
                                <Row>
                                    <Col xs={2}></Col>
                                    <Col xs={8}>
                                        <Bar height={80} options={stackOptions} data={stackData} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className='custom-tab-col mt-3 mb-2 pe-0'>
                        {
                            types && types.length > 0
                                ?
                                <Nav
                                    variant="tabs"
                                    activeKey={tabKey}
                                    onSelect={(key, e) => handleTabChange(key, e)}
                                >
                                    {
                                        types.map(type => {
                                            return (
                                                <Nav.Item
                                                    key={"type_" + type.id}>
                                                    <Nav.Link eventKey={type.id}>{type.name}</Nav.Link>
                                                </Nav.Item>
                                            )
                                        })
                                    }
                                </Nav>
                                : null
                        }
                    </Col>
                    {renderTab()}
                </Row>
            </Row>
        </>
    );
};

export default index;