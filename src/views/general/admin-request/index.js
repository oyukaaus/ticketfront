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
import Select from 'modules/Form/Select';
import * as XLSX from 'xlsx';
import { mn } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import format from 'date-fns/format';

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
            longName: param?.schoolName,
            userTitle: param?.userTitle
        })
    )
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [selectedTypesIds, setSelectedTypes] = useState(null);
    const types = [{ value: 1, text: 'Алдаа' }, { value: 2, text: 'Санал хүсэлт' }];
    const [selectedRequestersIds, setSelectedRequesters] = useState(null);
    const [selectedAssigneeIds, setSelectedAssignees] = useState(null);
    const [selectedSystemIds, setSelectedSystems] = useState(null);
    const [systems, setSystems] = useState([]);
    const [selectedSchoolIds, setSelectedSchools] = useState(null);
    const [selectedStatusIds, setSelectedStatus] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [requesters, setRequester] = useState([]);
    const [avatars, setUserAvatars] = useState([]);
    const [createdUsers, setCreatedUsers] = useState([]);

    const openImageInNewWindow = (path) => {
        window.open(path, '_blank');
    };

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

        generateExcelFile(reportData, `Ирсэн_санал_хүсэлтүүд.xlsx`);
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

    const field = [
        {
            key: 'date',
            value: '',
            // label: `${t('survey.date')}*`,
            type: 'daterange',
            required: true,
            errorMessage: t('errorMessage.enterName'),
            labelBold: true,
            selectedStartDate: startDate,
            selectedEndDate: endDate,
            firstPlaceHolder: t('ticket.startDate'),
            lastPlaceHolder: t('ticket.endDate'),
            width: '100%',

        },
    ];
    const handerRangePicker = (dates) => {
        console.log('dates: ', dates)
        setStartDate(dates[0] && dates[0].startDate || null);
        setEndDate(dates[0] && dates[0].endDate || null);
    };

    const defaultDate = {
        startDate: format((new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd'),
        endDate: format((new Date()), 'yyyy-MM-dd'),
    };

    const loadDetails = (page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
        dispatch(setLoading(true));
        const postData = {
            type: selectedTypesIds,
            requester: selectedRequestersIds,
            assignee: selectedAssigneeIds,
            system: selectedSystemIds,
            school: selectedSchoolIds,
            status: selectedStatusIds,
            startDate: startDate !== null ? format(startDate, 'yyyy-MM-dd') : defaultDate.startDate,
            endDate: endDate !== null ? format(endDate, 'yyyy-MM-dd') : defaultDate.endDate,
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
        const intValue = parseInt(value, 10);
        setSelectedRequesters(intValue)
    }

    const handleAssigneeChange = (value) => {
        const intValue = parseInt(value, 10);
        setSelectedAssignees(intValue)
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
            loadDetails(startDate, endDate);
        } else {
            loadDetails(defaultDate.startDate, defaultDate.endDate);
        }
    };

    const onclickClear = () => {
        handerRangePicker([]);
        setStartDate(null);
        setEndDate(null);
        setSelectedAssignees(null);
        setSelectedSchools(null);
        setSelectedStatus([]);
        setSelectedRequesters(null);
        setSelectedTypes(null);
        setSelectedSystems(null);
    };

    const fetchInfo = async () => {
        dispatch(setLoading(true));
        fetchRequest(ticketReport, 'POST', {})
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setData(res?.tickets);
                    setCreatedUsers(res?.users);
                    console.log('ticketIndex: ', res);
                    const assigneeOption = [];
                    res?.assignees.map((param) =>
                        assigneeOption.push({
                            value: param?.userId,
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
                            avatar: param?.avatar
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
        const inputValue = e.target.value.trim(); // Trim whitespace
        setSearchInput(inputValue);
    
        if (inputValue) {
            const filtered = data.filter((item) => {
                const idMatch = item.id.toString().includes(inputValue);
                const descriptionMatch = item.description.toLowerCase().includes(inputValue.toLowerCase());
                const usernameMatch = item.createdUser.toLowerCase().includes(inputValue.toLowerCase());
                return idMatch || descriptionMatch || usernameMatch;
            });
    
            setData(filtered);
        } else {
            fetchInfo();
        }
    };

    const getUserAvatar = (userId) => {
        const user = avatars.find((sys) => sys.id === userId);
        return user?.avatar || '/img/system/default-profile.png';
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

    // const getSchoolName = (schoolId) => {
    //     const school = schoolData.find((sys) => sys.value === parseInt(schoolId, 10));
    //     return school ? school.longName : 'Unknown School';
    // };

    const getTitle = (schoolId) => {
        const school = schoolData.find((sys) => sys.value === parseInt(schoolId, 10));
        return school ? school.userTitle : 'Unknown Title';
    };

    const getCreatedPhone = (userId) => {
        const user = createdUsers.find((sys) => sys.userId === userId);
        return user ? user.phone : 'Unknown Phone';
    };

    const getAssigneeAvatar = (userId) => {
        const user = assignees.find((sys) => sys.userId === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };

    const truncatedDescription = (description) => {
        return description.length > 122 ? `${description.slice(0, 122)}...` : description;
    };

    const truncatedName = (name) => {
        return name.length > 25 ? `${name.slice(0, 25)}.png` : name;
    };

    // const [setIsStart] = useState(false);
    // const [setIsEnd] = useState(false);
    const handleFirstCalendarClose = () => {
        // setIsStart(false);
    };

    const handleLastCalendarClose = () => {
        // setIsEnd(false);
    };
    const clearDate = () => {
        setStartDate(null);
        setEndDate(null);
    }

    return (
        <>
            <>
                <Col lg={12} className="mb-3">
                    <h2 className='font-standard mb-0'>
                        {t('ticket.ticket')}
                    </h2>
                    <BreadcrumbList
                        basePath='/'
                        key={1}
                        items={breadcrumbs}
                    />
                </Col>
                <>
                    <Card className="mb-3 ">
                        <Card.Body>
                            <Row lg={12} className="d-flex flex-row align-content-center align-items-center position-relative">
                                <Col lg={4}>
                                    <Row className='d-flex justify-content-between align-items-center'>
                                        <Col lg={4}>
                                            <label className='modal-label'>{t('common.type')}</label>
                                        </Col>
                                        <Col lg={8}>
                                            <Select
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
                                        <Col>
                                            <label className='modal-label' style={{ textOverflow: 'ellipsis', textAlign: 'end' }} >{t('ticket.requester')}</label>
                                        </Col>
                                        <Col lg={8}>
                                            <Select
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
                                            <label className='modal-label' style={{ textOverflow: 'ellipsis', textAlign: 'end' }} >{t('ticket.assignee')}</label>
                                        </Col>
                                        <Col lg={8}>
                                            <Select
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
                                        <Col lg={4}>
                                            <label className='modal-label'>{t('ticket.system')}</label>
                                        </Col>
                                        <Col lg={8}>
                                            <Select
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
                                        <Col lg={4}>
                                            <label className='modal-label'>{t('common.date')}</label>
                                        </Col>
                                        <Col lg={8}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                    flexDirection: 'column',
                                                    fontFamily: field.labelBold ? 'Pinnacle-Bold' : 'Pinnacle',
                                                    border: 1
                                                }}
                                            >
                                                {/* <DatePickerRange
                                                onChange={(val) => handerRangePicker(val)}
                                                firstPlaceHolder={t('ticket.startDate')}
                                                lastPlaceHolder={t('ticket.endDate')}
                                                selectedStartDate={startDate}
                                                selectedEndDate={endDate}
                                            /> */}
                                                <div className='date-picker-range-container'>
                                                    <DatePicker
                                                        locale={mn}
                                                        selected={startDate ? new Date(startDate) : startDate ? new Date(startDate) : null}
                                                        onChange={(date) => setStartDate(date)}
                                                        startDate={startDate}
                                                        maxDate={endDate}
                                                        dateFormat='yyyy-MM-dd'
                                                        disabled={false}
                                                        className='first-datepicker'
                                                        onCalendarClose={handleFirstCalendarClose}
                                                        placeholderText={t('ticket.startDate')}
                                                        dayClassName=''
                                                    />
                                                    <div
                                                        className='d-flex align-items-end justify-content-center'
                                                        style={{
                                                            width: 80, 
                                                            border: '1px solid hsl(0, 0%, 70%)', 
                                                            borderLeft: 'none',
                                                            borderRight: 'none',
                                                            height: 37,
                                                            backgroundColor: '#EBEDF2', 
                                                            opacity: 0.5, 
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={clearDate}
                                                    ><span>
                                                    ...</span>
                                                    </div>
                                                    <DatePicker
                                                        locale={mn}
                                                        selected={endDate ? new Date(endDate) : endDate ? new Date(endDate) : null}
                                                        minDate={startDate}
                                                        onChange={(date) => setEndDate(date)}
                                                        endDate={endDate}
                                                        dateFormat='yyyy-MM-dd'
                                                        disabled={false}
                                                        className='last-datepicker'
                                                        onCalendarClose={handleLastCalendarClose}
                                                        shouldCloseOnSelect={false}
                                                        placeholderText={t('ticket.endDate')}
                                                        dayClassName=''
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={4}>
                                </Col>
                            </Row>

                            <Row lg={12} className='d-flex justify-content-between align-items-center' style={{ marginTop: 10 }} >
                                <Col lg={4}>
                                    <Row className='d-flex justify-content-between align-items-center'>
                                        <Col lg={4}>
                                            <label className='modal-label'>{t('menu.school')}</label>
                                        </Col>
                                        <Col lg={8}>
                                            <Select
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
                                        <Col lg={4}>
                                            <label className='modal-label'>{t('common.status')}</label>
                                        </Col>
                                        <Col lg={8}>
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
                            <Row>
                                <Col></Col>
                                <Col className='d-flex justify-content-center'>
                                    <Button onClick={onclickClear} size="sm" variant="link" style={{ fontSize: 14 }}>
                                        {t('common.clear')}
                                    </Button>
                                    <Button variant="aqua" style={{ color: 'white', marginLeft: 20, fontSize: 14, width: 109, height: 30 }} className='d-flex justify-content-center' size="sm" onClick={onSeeClick}>
                                        <img src='../img/ticket/icon/filter.png' alt='school-icon' style={{ alignSelf: 'center', marginRight: 5 }} />{t('ticket.search')}
                                    </Button>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>
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
                    <Row key={i} className="d-flex " style={{ marginTop: 10, marginLeft: 1 }} onClick={() => history.push(`/admin/view/${item.id}`)} >
                        <Card style={{ width: '99.5%' }} >
                            <Card.Body>
                                <Row className="d-flex ">
                                    <div className='new-row'>
                                        <img className="profile rounded-circle" width='45' alt={item.createdUserId} src={getUserAvatar(item.createdUserId) ? `${getUserAvatar(item.createdUserId)}` : '../img/system/default-profile.png'} />
                                    </div>
                                    <div className='new-button '>
                                        <div className='view-button ' >
                                            <Button className='customButton position-relative d-inline-flex '    
                                                type="button"
                                                size="sm"
                                                style={getButtonColor(item?.statusId)}
                                            >
                                                {getStatusName(item?.statusId)}
                                            </Button>
                                            <Button className='customButton position-relative d-inline-flex'
                                                type="button"
                                                size="sm"
                                                style={{ backgroundColor: 'rgba(253, 120, 69, 0.2)', color: '#000000' }}
                                            >
                                                {item.schoolName}
                                            </Button>
                                            <Button className='customButton position-relative d-inline-flex'
                                                type="button"
                                                size="sm"
                                                style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#000000' }}
                                            >
                                                {item.userTitle}
                                            </Button>
                                            <Button className='customButton position-relative d-inline-flex'
                                                type="button"
                                                size="sm"
                                                style={{ backgroundColor: 'rgba(4, 120, 87, 0.2)', color: 'rgba(0, 0, 0, 1)' }}
                                            >
                                                {getCreatedPhone(item.createdUserId)}
                                            </Button>
                                        </div>
                                        <div style={{ color: 'black', fontSize: 14, fontWeight: 'semibold', opacity: 1, marginLeft:10 }}>
                                            {item?.createdDate?.date && (item?.createdDate?.date).replace(/\.\d+$/, '')} <span style={{ color: '#FD7845', fontWeight: 'bold', opacity: 1 }}> <span style={{ color: '#FD7845', fontWeight: 'bold', opacity: 1 }}> | </span> </span> {getTypeName(item?.typeId)} <span style={{ color: '#FD7845', fontWeight: 'bold' }}> | </span> {getSystemName(item?.systemId)}
                                        </div>
                                    </div>
                                </Row>
                                <div style={{ textAlign: 'left', color: '#FD7845', fontSize: 14, fontWeight: 'bold', opacity: 1 }}>
                                    #{item?.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {truncatedDescription(item?.description)}</span>
                                </div>
                                <div className="d-flex align-items-end justify-content-end " >
                                    <Col>
                                        {item?.files && item?.files.map((dtlItem, index) => (
                                            <Button key={index} variant="default" style={{ backgroundColor: '#FFFFFF', marginTop: 10, marginRight: 5, border: '1px solid #979797' }} width="80%" size="sm" onClick={() => openImageInNewWindow(dtlItem.path)} >
                                                <img src='../img/ticket/icon/image.png' alt='school-icon' className='color-info me-1' /> <span style={{ color: 'black', }}>{truncatedName(dtlItem.name)}</span>
                                            </Button>
                                        ))}
                                    </Col>
                                </div>
                                <Row className="d-flex align-items-end justify-content-end " >
                                    <Col lg={1}>
                                        <Button variant="default" style={{ backgroundColor: '#E5E7EB', marginTop: 10 }} width="80%" size="sm" onClick={onSeeClick}>
                                            <img src='../img/ticket/icon/reply.png' alt='school-icon' className='color-info me-1' /> <span style={{ color: 'black' }}>{item.replyCount}</span>
                                        </Button>
                                    </Col>
                                    <Col lg={10}></Col>
                                    <Col xs={1} className="d-flex align-items-end justify-content-end ">
                                        <img className="profile d-inline rounded-circle" width='50' alt={item.assigneeId}
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
