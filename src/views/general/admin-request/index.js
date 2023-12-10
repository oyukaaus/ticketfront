import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketIndex, doctorDashboardIndex, doctorDashboardDetails } from 'utils/fetchRequest/Urls';
import { PlaylistAddCheckCircleOutlined, TuneRounded } from '@mui/icons-material';
import DatePickerRange from 'modules/Form/DatePickerRange';
import Select from 'modules/Form/Select';

const AdminRequest = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorDueDate, setErrorDueDate] = useState(false);
    const [selectedTypesIds, setSelectedTypes] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/ticket/index', text: 'Санал хүсэлт' },

    ];

    const types = [{ value: 1, text: 'Алдаа' }, { value: 2, text: 'Санал хүсэлт' }];
    useEffect(() => {
        dispatch(setLoading(true));

    }, []);

    const getButtonColor = (type) => {
        switch (type) {
            case 'Шинэ':
                return { backgroundColor: '#FF003D', color: '#FFFFFF' };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: 'green', color: '#FFFFFF' };
            case 'Хаагдсан':
                return { backgroundColor: 'blue', color: '#FFFFFF' };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000' }; // Default button color
        }
    };
    const [dropdownStates, setDropdownStates] = useState(Array(data.length).fill(false));

    const handleDropdownToggle = (i) => {
        const updatedDropdownStates = [...dropdownStates];
        updatedDropdownStates[i] = !updatedDropdownStates[i];
        setDropdownStates(updatedDropdownStates);
    };
    const handleInspectionDateChange = (value) => {
        if (value && value.length > 0) {
            setStartDate(value[0]?.startDate || '')
            setEndDate(value[0]?.endDate || '')
        }
    }
    const loadDetails = (type = null, start = null, end = null, page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
        dispatch(setLoading(true));
        const postData = {
            // school: selectedSchool?.id,
            type,
            startDate: start,
            endDate: end,
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
                        // setMedicineCurrentPage(res.page);
                        // setMedicineTableData(list);
                        // setMedicineTableCount(totalCount);
                    } else if (type === 'INSPECTION') {
                        // setInspectionCurrentPage(res.page);
                        // setInspectionTableCount(totalCount);
                        // setInspectionTableData(list);
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

    const handleTypeChange = (value) => {
        setSelectedTypes(value)
    }

    const onSeeClick = () => {
        if (startDate && endDate) {
            setErrorDueDate(false);
            loadDetails('INSPECTION', startDate, endDate);
        } else {
            setErrorDueDate(true);
        }
    };

    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketIndex, 'POST', {
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    console.log('res: ', res)
                    setData(res?.tickets);
                    // setData(res?.survey)
                    // setQuestionTypes(res?.questionTypes)
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
        fetchInfo()
    }, []);
    return (
        <>
            <Row>
                <Col lg={12} className="mb-3">
                    <h2 className='font-standard mb-0'>
                        {/* {t('dashboard.appointment')} */}
                        Санал хүсэлт
                    </h2>
                    <BreadcrumbList
                        basePath='/'
                        key={1}
                        items={breadcrumbs}
                    />
                </Col>
                <Row>
                    <Col>
                        <Col lg={12}>
                            <Card className='mb-3 no-border-radius'>
                                <Card.Body>
                                    <Row lg={12} className='d-flex justify-content-between align-items-center'>
                                        <Col lg={4}>
                                            <Row className='d-flex justify-content-between align-items-center'>
                                                <Col>
                                                    <label className='modal-label'>{t('common.type')}</label>
                                                </Col>
                                                <Col>
                                                    <Select
                                                        multiple
                                                        clearable={false}
                                                        options={types}
                                                        value={selectedTypesIds}
                                                        onChange={(value) => handleTypeChange(value)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={4}>
                                            <Row className='d-flex justify-content-between align-items-center'>
                                                <Col >
                                                    <label className='modal-label'>{t('ticket.sender')}</label>
                                                </Col>
                                                <Col>
                                                    <Select
                                                        multiple
                                                        clearable={false}
                                                        options={types}
                                                        value={selectedTypesIds}
                                                        onChange={(value) => handleTypeChange(value)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={4}>
                                            <Row className='d-flex justify-content-between align-items-center'>
                                                <Col >
                                                    <label className='modal-label'>{t('ticket.assignee')}</label>
                                                </Col>
                                                <Col>
                                                    <Select
                                                        multiple
                                                        clearable={false}
                                                        options={types}
                                                        value={selectedTypesIds}
                                                        onChange={(value) => handleTypeChange(value)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row lg={12} className='d-flex justify-content-between align-items-center' style={{ marginTop: 10 }}>
                                        <Col lg={4}>
                                            <Row className='d-flex justify-content-between align-items-center'>
                                                <Col className=''>
                                                    <label className='modal-label'>{t('ticket.system')}</label>
                                                </Col>
                                                <Col>
                                                    <Select
                                                        multiple
                                                        clearable={false}
                                                        options={types}
                                                        value={selectedTypesIds}
                                                        onChange={(value) => handleTypeChange(value)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={6}>
                                            <Row className='d-flex justify-content-between align-items-center'>
                                                <Col lg={4}>
                                                    <label className='modal-label'>{t('common.date')}</label>
                                                </Col>
                                                <Col lg={8}>
                                                    <DatePickerRange
                                                        onChange={(val) => handleInspectionDateChange(val)}
                                                        firstPlaceHolder={t('common.startDate')}
                                                        lastPlaceHolder={t('common.endDate')}
                                                        selectedStartDate={startDate}
                                                        selectedEndDate={endDate}
                                                        isDisabled={false}
                                                        clearable={true}
                                                        disableWithFirst={true}
                                                        disableWithLast={true}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={2}>
                                        </Col>
                                    </Row>

                                    <Row lg={12} className='d-flex justify-content-between align-items-center' style={{ marginTop: 10 }} >
                                        <Col lg={4}>
                                            <Row className='d-flex justify-content-between align-items-center'>
                                                <Col className=''>
                                                    <label className='modal-label'>{t('menu.school')}</label>
                                                </Col>
                                                <Col>
                                                    <Select
                                                        multiple
                                                        clearable={false}
                                                        options={types}
                                                        value={selectedTypesIds}
                                                        onChange={(value) => handleTypeChange(value)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={4}>
                                            <Row className='d-flex justify-content-between align-items-center'>
                                                <Col className='width-equal pe-2'>
                                                    <label className='modal-label'>{t('common.status')}</label>
                                                </Col>
                                                <Col>
                                                    <Select
                                                        multiple
                                                        clearable={false}
                                                        options={types}
                                                        value={selectedTypesIds}
                                                        onChange={(value) => handleTypeChange(value)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={4}>

                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col lg={5}>
                                        </Col>
                                        <Col lg={3} className='d-flex p-2  align-items-center'>
                                            <Button
                                                variant="outline-info"
                                                className='text-red text-uppercase br-8 py-2'
                                                onClick={onSeeClick}
                                            >
                                                <TuneRounded />
                                                {t('common.clear')}
                                            </Button>
                                            <Button
                                                variant="aqua"
                                                className='text-white text-uppercase br-8 py-2'
                                                onClick={onSeeClick}
                                                style={{ marginLeft: 20 }}
                                            >
                                                <TuneRounded />
                                                {t('common.search')}
                                            </Button>
                                        </Col>
                                        <Col lg={4}>

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
                        </Col>
                        {/* </Row> */}
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col style={{ color: '#FD7845', fontSize: 16, fontWeight: 'bolder' }}>Миний илгээсэн санал хүсэлтүүд</Col>
                    <Col lg={2} className='d-flex justify-content-between align-items-center'>
                        <Row >
                            <input
                                className="form-control datatable-search"
                                value={searchValue || ''}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                                placeholder="Хайх..."
                            /></Row>
                        <Row>
                            <i className='flaticon-alert' />
                        </Row>
                    </Col>
                </Row>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-3">
                            <Card.Body className="d-flex flex-row align-content-center align-items-center position-relative mb-3">
                                <Col lg={1} className="text-center flex-row">
                                    <Row style={{ display: 'flex' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <img src="../img/system/default-profile.png" alt="school-icon" className="color-info me-1" style={{ maxWidth: '80%', height: 'auto' }} />
                                        </div>
                                        <div style={{ textAlign: 'center', color: '#FD7845', fontSize: 14, fontWeight: 'bold' }}>
                                        #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item.description}</span>
                                        </div>
                                    </Row>
                                </Col>

                                <Col>
                                    <Row>
                                        <Col>
                                            <Button className='position-relative d-inline-flex m-1'
                                                type="button"
                                                size="sm"
                                                disabled
                                                style={getButtonColor(item.status)}
                                            >
                                                {item.status}
                                            </Button>
                                            <Button className='position-relative d-inline-flex m-1'
                                                type="button"
                                                size="sm"
                                                disabled
                                                style={{backgroundColor:'#FD7845', fontFamily: 'Mulish'}}
                                            >
                                                {/* {item.status} */}
                                                Тестийн сургууль
                                            </Button>
                                            <Button className='position-relative d-inline-flex m-1'
                                                type="button"
                                                size="sm"
                                                disabled
                                                style={{backgroundColor:'#3B82F6', fontFamily: 'Mulish'}}
                                            >
                                                {/* {item.status} */}
                                                Сургалтын менежер, Багш
                                            </Button>
                                            <Button className='position-relative d-inline-flex m-1'
                                                type="button"
                                                size="sm"
                                                disabled
                                                style={{backgroundColor:'#047857', fontFamily: 'Mulish'}}
                                            >
                                                {/* {item.status} */}
                                                99887766
                                            </Button>
                                        </Col>
                                    </Row>

                                    <div style={{ color: 'black', fontSize: 15, fontWeight: 'semibold' }}>
                                        {item.createdDate?.date} | {item.type} | {item.systemId}
                                    </div>
                                </Col>
                            </Card.Body>
                        </Card>
                    </Row>
                ))}
            </Row>

        </>
    );
};

export default AdminRequest;
