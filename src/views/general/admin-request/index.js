import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketReport, ticketList } from 'utils/fetchRequest/Urls';
import DatePickerRange from 'modules/Form/DatePickerRange';
import Select from 'modules/Form/Select';
import * as XLSX from 'xlsx';

const AdminRequest = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { schools } = useSelector(state => state.schoolData);
    const schoolData = [];
    schools.map((param) =>
        schoolData.push({
            value: param?.id,
            text: param?.name,
            longName: param?.longName,
        })
    )

    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorDueDate, setErrorDueDate] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [selectedTypesIds, setSelectedTypes] = useState([]);
    const types = [{ value: 1, text: 'Алдаа' }, { value: 2, text: 'Санал хүсэлт' }];
    const [selectedRequestersIds, setSelectedRequesters] = useState([]);
    const [selectedAssigneeIds, setSelectedAssignees] = useState([]);
    const [selectedSystemIds, setSelectedSystems] = useState([]);
    const [systems, setSystems] = useState([]);
    const [selectedSchoolIds, setSelectedSchools] = useState([]);
    const [selectedStatusIds, setSelectedStatus] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [requesters, setRequester] = useState([]);
    const [avatars, setUserAvatars] = useState([]);
    const current = new Date();
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
    });
    const dateTimeToday = current.getFullYear() + "-" + ("00" + (current.getMonth() + 1)).slice(-2) + "-" + ("00" + (current.getDate())).slice(-2) + " " + current.getHours() + ":" + ("00" + (current.getMinutes())).slice(-2) + ":" + ("00" + (current.getSeconds())).slice(-2);
    const generateExcelFile = (reportData, filename) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(reportData);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadExcel = () => {
        const reportData = data;

        generateExcelFile(reportData, `'requests'+ '_' + dateTimeToday+'.xlsx'`);
    };

    useEffect(() => {
        dispatch(setLoading(true));

    }, []);

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/ticket/index', text: 'Санал хүсэлт' },

    ];
    const getButtonColor = (type) => {
        switch (type) {
            case 1:
                return { backgroundColor: '#FF003D', color: '#FFFFFF', fontFamily: 'Mulish', opacity: 1 };
            case 2:
                return { backgroundColor: '#EDB414', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
            case 3:
                return { backgroundColor: '#D9D9D9', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
            case 4:
                return { backgroundColor: '#D9D9D9', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'Mulish', opacity: 1 };
        }
    };


    const handleInspectionDateChange = (value) => {
        if (value && value.length > 0) {
            setStartDate(value[0]?.startDate || '')
            setEndDate(value[0]?.endDate || '')
        }
    }
    const loadDetails = (start = null, end = null, page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
        dispatch(setLoading(true));
        const postData = {
            type: selectedTypesIds,
            requester: selectedRequestersIds,
            assignee: selectedAssigneeIds,
            system: selectedSystemIds,
            school: selectedSchoolIds,
            status: selectedStatusIds,
            startDate: start,
            endDate: end,
            page,
            pageSize,
            query,
            sortBy,
            order
        };
        console.log('postdata: ', postData)
        fetchRequest(ticketList, 'POST', postData)
            .then(res => {
                const { success = false, message = null } = res
                if (success) {
                    setData(res?.tickets);
                    console.log('ticketList: ', res);
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

    const handleRequesterChange = (value) => {
        setSelectedRequesters(value)
    }

    const handleAssigneeChange = (value) => {
        setSelectedAssignees(value)
    }

    const handleSystemChange = (value) => {
        setSelectedSystems(value)
    }
    const handleSchoolChange = (value) => {
        setSelectedSchools(value)
    }
    const handleStatusChange = (value) => {
        setSelectedStatus(value)
    }

    const onSeeClick = () => {
        if (startDate && endDate) {
            setErrorDueDate(false);
            loadDetails(startDate, endDate);
        } else {
            setErrorDueDate(true);
        }
    };

    const loadDetailsClear = (start = null, end = null, page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
        dispatch(setLoading(true));
        const postData = {
            startDate: start,
            endDate: end,
            page,
            pageSize,
            query,
            sortBy,
            order
        };
        fetchRequest(ticketList, 'POST', postData)
            .then(res => {
                const { success = false, message = null } = res
                if (success) {
                    setData(res?.tickets);
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

    const onclickClear = () => {
        setStartDate(dateRange.startDate);
        setEndDate(dateRange.endDate);
        setSelectedAssignees([]);
        setSelectedSchools([]);
        setSelectedStatus([]);
        setSelectedRequesters([]);
        setSelectedTypes([]);
        setSelectedSystems([]);
        console.log(startDate)
        loadDetailsClear(startDate, endDate);
    };

    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketReport, 'POST', {})
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setData(res?.tickets);
                    console.log('ticketIndex: ', res);
                    const assigneeOption = [];
                    res?.assignees.map((param) =>
                        assigneeOption.push({
                            value: param?.id,
                            text: param?.firstName,
                        })
                    );
                    const userOption = [];
                    res?.users.map((param) =>
                        userOption.push({
                            value: param?.userId,
                            text: param?.firstName,
                        })
                    )

                    const useravatar = [];
                    res?.users.map((param) =>
                        useravatar.push({
                            id: param?.userId,
                            avatar: param?.avatar,
                        })
                    )
                    setUserAvatars(useravatar);
                    setSystems(res?.systems);
                    setStatuses(res?.statuses);
                    setAssignees(assigneeOption);
                    setRequester(userOption);
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                console.log(e);
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });

    };


    useEffect(() => {
        fetchInfo()
    }, []);

    const handleSearch = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setSearchInput(inputValue);
        if (inputValue) {
            const filtered = data.filter((item) => {
                return item.description.toLowerCase().indexOf(inputValue) !== -1;
            });
            setData(filtered)
        } else {
            fetchInfo()
        }
    };

    const getUserAvatar = (userId) => {
        const user = avatars.find((sys) => sys.id === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };

    const openImageInNewWindow = (path) => {
        window.open(path, '_blank');
    };

    const getSystemName = (systemId) => {
        const system = systems.find((sys) => sys.value === systemId);
        return system ? system.text : 'Unknown System';
    };

    const getTypeName = (typeId) => {
        const system = types.find((sys) => sys.value === typeId);
        return system ? system.text : 'Unknown Type';
    };

    const getStatusName = (statusId) => {
        const status = statuses.find((sys) => sys.value === statusId);
        return status ? status.text : 'Unknown Status';
    };

    const getSchoolName = (schoolId) => {
        const school = schoolData.find((sys) => sys.value === parseInt(schoolId, 10));
        return school ? school.longName : 'Unknown School';
    };

    const getAssigneeAvatar = (userId) => {
        const user = assignees.find((sys) => sys.userId === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };

    return (
        <>
            <>
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
                    <Card className="mb-3">
                        <Card.Body>
                            <Row lg={12} className="d-flex flex-row align-content-center align-items-center position-relative">
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
                                            <label className='modal-label'>{t('ticket.requester')}</label>
                                        </Col>
                                        <Col>
                                            <Select
                                                multiple
                                                clearable={false}
                                                options={requesters}
                                                value={selectedRequestersIds}
                                                onChange={(value) => handleRequesterChange(value)}
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
                                                options={assignees}
                                                value={selectedAssigneeIds}
                                                onChange={(value) => handleAssigneeChange(value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className='d-flex justify-content-between align-items-center' style={{ marginTop: 10 }}>
                                <Col lg={4}>
                                    <Row className='d-flex justify-content-between align-items-center'>
                                        <Col className=''>
                                            <label className='modal-label'>{t('ticket.system')}</label>
                                        </Col>
                                        <Col>
                                            <Select
                                                multiple
                                                clearable={false}
                                                options={systems}
                                                value={selectedSystemIds}
                                                onChange={(value) => handleSystemChange(value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={4}>
                                    <Row className='d-flex justify-content-between align-items-center'>
                                        <Col  >
                                            <label className='modal-label'>{t('common.date')}</label>
                                        </Col>
                                        <Col>
                                            <DatePickerRange
                                                onChange={(val) => handleInspectionDateChange(val)}
                                                firstPlaceHolder={t('common.startDate')}
                                                lastPlaceHolder={t('common.endDate')}
                                                selectedStartDate={startDate}
                                                selectedEndDate={endDate}
                                                isDisabled={false}
                                                clearable={false}
                                                disableWithFirst={true}
                                                disableWithLast={true}
                                            />
                                            {
                                                errorDueDate &&
                                                <Row className='d-flex justify-content-between '>
                                                    <Col sm={8} className='d-flex'>
                                                        <div className='invalid-feedback d-block'>
                                                            {t('errorMessage.selectDate')}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={4}>
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
                                                options={schoolData}
                                                value={selectedSchoolIds}
                                                onChange={(value) => handleSchoolChange(value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={4}>
                                    <Row className='d-flex justify-content-between align-items-center'>
                                        <Col>
                                            <label className='modal-label'>{t('common.status')}</label>
                                        </Col>
                                        <Col>
                                            <Select
                                                multiple
                                                clearable={false}
                                                options={statuses}
                                                value={selectedStatusIds}
                                                onChange={(value) => handleStatusChange(value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={4}>

                                </Col>
                            </Row>
                            <Row style={{ marginTop: 30, marginBottom: 10 }} className=' border-separator-light border-top d-flex'></Row>
                            <Row >
                                <Col lg={5}>
                                </Col>
                                <Col lg={3} className='d-flex p-2  align-items-center'>
                                    <Button onClick={onclickClear} size="sm" variant="link">
                                        {t('common.clear')}
                                    </Button>
                                    <Button variant="aqua" className="fs-12 br-8 ps-4 pe-4 " style={{ width: 120, color: 'white', marginLeft: 20 }} size="sm" onClick={onSeeClick}>
                                        <img src='../img/ticket/icon/filter.png' alt='school-icon' className='color-info me-1' />{t('ticket.search')}
                                    </Button>

                                </Col>
                                <Col lg={4}>

                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col lg={4} style={{ color: '#FD7845', fontSize: 16, fontWeight: 'bolder', fontFamily: 'Mulish' }}>Ирсэн санал хүсэлтүүд</Col>
                    <Col lg={5}></Col>
                    <Col lg={3} className="d-flex align-items-end justify-content-end ">
                        <input
                            className="form-control datatable-search align-items-end justify-content-end "
                            value={searchInput}
                            onChange={handleSearch}
                            placeholder="Хайх..."
                            style={{ fontFamily: 'Mulish', borderRadius: 10 }}
                        />
                        <img src="../img/ticket/icon/xls.png" alt="dot-icon" className="color-info me-1" style={{ marginLeft: 10 }} onClick={handleDownloadExcel} />
                    </Col>
                </Row>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }} onClick={() => history.push(`/admin/view/${item.id}`)}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Row className="d-flex flex-row align-content-center align-items-center position-relative">
                                    <Col xs={1} className="text-center">
                                        <Row style={{ display: 'flex' }}>
                                            <div className="d-flex justify-content-center">
                                                <img className="profile rounded-circle" width='45' alt={item.createdUserId} src={getUserAvatar(item.createdUserId) ? `${getUserAvatar(item.createdUserId)}` : '../img/system/default-profile.png'} />
                                            </div>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Button className='position-relative d-inline-flex '
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={getButtonColor(item?.statusId)}
                                                >
                                                    {getStatusName(item?.statusId)}
                                                </Button>
                                                <Button className='position-relative d-inline-flex'
                                                    type="button"
                                                    size="sm"
                                                    disabled
                                                    style={{ backgroundColor: '#FD7845', fontFamily: 'Mulish', color: '#000000', marginLeft: 10 }}
                                                >
                                                    {getSchoolName(item.schoolId)}
                                                </Button>
                                            </Col>
                                        </Row>

                                        <div style={{ color: 'black', fontSize: 14, fontWeight: 'semibold', opacity: 1 }}>
                                            {item?.createdDate?.date && (item?.createdDate?.date).replace(/\.\d+$/, '')} <span style={{ color: 'orange', fontWeight: 'bold', opacity: 1 }}> <span style={{ color: 'orange', fontWeight: 'bold', opacity: 1 }}> | </span> </span> {getTypeName(item?.typeId)} <span style={{ color: 'orange', fontWeight: 'bold' }}> | </span> {getSystemName(item?.systemId)}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <div style={{ textAlign: 'left', color: '#FD7845', fontSize: 14, fontWeight: 'bold', opacity: 1 }}>
                                        #{item?.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item?.description}</span>
                                    </div>
                                </Row>
                                <Row className="d-flex align-items-end justify-content-end " >
                                    <Col lg={1}>
                                        {item?.files && item?.files.map((dtlItem, index) => (
                                            <div key={index} className="text-center">
                                                <img src={dtlItem.path} alt={`Image ${index}`} width='100' onClick={() => openImageInNewWindow(dtlItem.path)} />
                                            </div>
                                        ))}
                                    </Col>
                                    <Col lg={11}></Col>
                                </Row>
                                <Row className="d-flex align-items-end justify-content-end " >
                                    <Col lg={1}>
                                        <Button variant="default" style={{ backgroundColor: '#E5E7EB', marginTop: 10 }} width="80%" size="sm" onClick={onSeeClick}>
                                            <img src='../img/ticket/icon/reply.png' alt='school-icon' className='color-info me-1' /> <span style={{ color: 'black' }}>{item.replyCount}</span>
                                        </Button>
                                    </Col>
                                    <Col lg={10}></Col>
                                    <Col xs={1} className="d-flex align-items-end justify-content-end ">
                                        <img className="profile d-inline rounded-circle" width='60%' alt={item.assigneeId}
                                            src={getAssigneeAvatar(item.assigneeId) ? `${getAssigneeAvatar(item.assigneeId)}` : '../img/system/default-profile.png'} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Row>
                ))}
            </>
        </>
    );
};

export default AdminRequest;
