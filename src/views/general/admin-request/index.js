import React, { useState, useEffect } from 'react';
import {  useHistory } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketIndex, ticketList } from 'utils/fetchRequest/Urls';
import { TuneRounded } from '@mui/icons-material';
import DatePickerRange from 'modules/Form/DatePickerRange';
import Select from 'modules/Form/Select';


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
        })
    )
    // console.log('selectedSchool: ', schools)
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
    // const schools = [{ value: 1, text: 'Алдаа' }, { value: 2, text: 'Санал хүсэлт' }];
    const [selectedStatusIds, setSelectedStatus] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [requesters, setRequester] = useState([]);
    const [avatars, setUserAvatars] = useState([]);

    useEffect(() => {
        dispatch(setLoading(true));

    }, []);

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/ticket/index', text: 'Санал хүсэлт' },

    ];
    const getButtonColor = (type) => {
        switch (type) {
            case 'Шинэ':
                return { backgroundColor: 'green', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: 'blue', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'Хаагдсан':
                return { backgroundColor: 'grey', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'Цуцласан':
                return { backgroundColor: 'red', color: '#FFFFFF', fontFamily: 'Mulish' };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'Mulish' }; 
        }
    };


    const handleInspectionDateChange = (value) => {
        if (value && value.length > 0) {
            setStartDate(value[0]?.startDate || '')
            setEndDate(value[0]?.endDate || '')
        }
    }
    const loadDetails = ( start = null, end = null, page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
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
        console.log('postData: ', postData)
        fetchRequest(ticketList, 'POST', postData)
            .then(res => {
                const {success = false, message = null } = res
                if (success) {
                    console.log('res list: ', res)
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
    const getSystemName = (systemId) => {
        const system = systems.find((sys) => sys.value === systemId);
        return system ? system.text : 'Unknown System';
    };
    const onSeeClick = () => {
        if (startDate && endDate) {
            setErrorDueDate(false);
            loadDetails(startDate, endDate);
        } else {
            setErrorDueDate(true);
        }
    };

    const loadDetailsClear = ( start = null, end = null, page = 1, pageSize = 10, query = null, sortBy = null, order = null) => {
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
                const {success = false, message = null } = res
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
        if (startDate && endDate) {
            loadDetailsClear(startDate, endDate);
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
                            value: param?.id,
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
                    setUserAvatars(useravatar)

                    console.log('res: ', res)
                    setData(res?.tickets);
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

    const downloadExcel = () =>{
        console.log('called');
    }

    const getUserAvatar = (userId) => {
        const user = avatars.find((sys) => sys.id === userId);
        return user?.avatar || '/img/system/default-profile.png';
    };
    

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
                            <Card className=' no-border-radius' style={{width:'100.5%'}}>
                                <Card.Body>
                                <Row lg={12}className="d-flex flex-row align-content-center align-items-center position-relative">
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
                                                        options={systems}
                                                        value={selectedSystemIds}
                                                        onChange={(value) => handleSystemChange(value)}
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
                                                        multipleaa
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
                                                <Col className='width-equal pe-2'>
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
                                    <Row style={{ marginTop: 10 }}>
                                        <Col lg={5}>
                                        </Col>
                                        <Col lg={3} className='d-flex p-2  align-items-center'>
                                            <Button
                                                variant="outline-info"
                                                className='text-red text-uppercase br-8 py-2'
                                                onClick={onclickClear}
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
                <Row style={{ marginTop: 20}}>
                    <Col style={{ color: '#FD7845', fontSize: 16, fontWeight: 'bolder', fontFamily: 'Mulish' }}>Ирсэн санал хүсэлтүүд</Col>
                    <Col md={3} className="d-flex align-items-end justify-content-end ">
                        <input
                            className="form-control datatable-search align-items-end justify-content-end "
                            value={searchInput}
                            onChange={handleSearch}
                            placeholder="Хайх..."
                            style={{ fontFamily: 'Mulish' }}
                        />
                    </Col>
                    <Col xs={1} className="d-flex align-items-end justify-content-end ">
                        <img src="../img/ticket/icon/xls.png" alt="dot-icon" className="color-info me-1" onClick={downloadExcel}/>
                    </Col>
                </Row>
                {/* <Row style={{ marginTop: 20 }} >
                    <Col style={{ color: '#FD7845', fontSize: 16, fontWeight: 'bolder' }}>Ирсэн санал хүсэлтүүд</Col>
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
                </Row> */}
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}  onClick={() => history.push(`/admin/view/${item.id}`)}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Row className="d-flex flex-row align-content-center align-items-center position-relative">
                                <Col lg={1} className="text-center flex-row">
                                    <Row style={{ display: 'flex' }}>
                                        <div style={{ textAlign: 'center' }}>
                                        <img  className="profile d-inline me-3  rounded-circle" width={70} alt={item.createdUser} src={getUserAvatar(item.createdUser) ? `${getUserAvatar(item.createdUser)}` : '../img/system/default-profile.png'} />
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
                                    {(item.createdDate?.date).replace(/\.\d+$/, '')} | {item.type} | {getSystemName(item.systemId)}
                                    </div>
                                </Col>
                                </Row>
                                <Row>
                                <div style={{ textAlign: 'left', color: '#FD7845', fontSize: 14, fontWeight: 'bold' }}>
                                        #{item.id}. <span style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> {item.description}</span>
                                        </div>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Row>
                ))}
            </Row>

        </>
    );
};

export default AdminRequest;
