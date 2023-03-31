import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useSelector, useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { appointmentRequestIndex, appointmentRequestSubmit, appointmentRequestEdit } from 'utils/fetchRequest/Urls';
import DeleteModal from 'modules/DeleteModal';
import ResponseAppointment from './reponse';
import ViewAppointment from './view';
import 'css/dashboard.css';
import 'css/fullcalendar-custom.css'

const index = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const calendarRef = useRef();
    const current = new Date();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(new Date(current.getFullYear(), current.getMonth(), new Date().getDate() - new Date().getDay()));
    const [lastDayOfWeek, setLastDayOfWeek] = useState(new Date(current.getFullYear(), current.getMonth(), (new Date().getDate() - new Date().getDay()) + 6));

    // const current = new Date();
    // const dateTimeToday = current.getFullYear() + "-" + ("00" + (current.getMonth() + 1)).slice(-2) + "-" + ("00" + (current.getDate())).slice(-2) + " " + current.getHours() + ":" + ("00" + (current.getMinutes())).slice(-2) + ":" + ("00" + (current.getSeconds())).slice(-2);
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [showResponseAppointment, setShowResponseAppointment] = useState(false);
    const [showViewAppointment, setShowViewAppointment] = useState(false);
    const [showAcceptAppointment, setShowAcceptAppointment] = useState(false);

    const typeCode = 'NORMAL_APPOINTMENT';
    const [tabIndex] = useState('appointment_tab_index')
    const [tabKey, setTabKey] = useState('REQUESTS');
    const [types] = useState([
        {
            id: 'REQUESTS',
            name: t('appointment.newRequests')
        },
        {
            id: 'REJECTED',
            name: t('appointment.rejectedRequests')
        },
    ]);
    const [gridType, setGridType] = useState('MONTH');
    const [gridTypeOptions] = useState([
        {
            value: "MONTH",
            text: "Сараар"
        },
        {
            value: "WEEK",
            text: "7 хоног"
        },
        {
            value: "DAY",
            text: "Өдөр"
        },
    ]);//setGridTypeOptions

    const [newRequests, setNewRequests] = useState([]); // setNewRequests
    const [rejectedRequests, setRejectedRequests] = useState([]); //setRejectedRequests
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/appointment/appointment', text: t('dashboard.appointment') },

    ];

    const onResponseAppointment = (newRequest) => {
        setSelectedRequest(newRequest)
        setShowResponseAppointment(true);
    };

    const handleTabChange = key => {
        setTabKey(key);
        localStorage.setItem(tabIndex, key)
    };

    const handleEventClick = (newRequest) => {
        setSelectedRequest(newRequest?.event?.extendedProps?.data || null)
        setShowViewAppointment(true)
    };

    const renderEvent = (event) => {
        return (
            <span style={{ width: '100%', height: 30, borderRadius: 8, backgroundColor: 'rgba(223, 226, 234, 0.5)' }} className='d-flex align-items-center justify-content-center'>
                {
                    ("00" + (event.event?.start?.getHours()))?.slice(-2) + ':' + ("00" + (event.event?.start?.getMinutes()))?.slice(-2) + ' ' + event.event?.title
                }
            </span>
        )
    }

    const handleDrop = (selectInfo) => {
        dispatch(setLoading(true));
        const selectedData = new Date(selectInfo.event?.start);
        const selectedDataEnd = new Date(selectInfo.event?.end);
        const selectedDate = selectedData.getFullYear() + "-" + ("00" + (selectedData.getMonth() + 1)).slice(-2) + "-" + ("00" + (selectedData.getDate())).slice(-2);
        const start = ("00" + (selectedData.getHours()))?.slice(-2) + ':' + ("00" + (selectedData.getMinutes()))?.slice(-2) + ':' + ("00" + (selectedData.getSeconds()))?.slice(-2);
        const end = ("00" + (selectedDataEnd.getHours()))?.slice(-2) + ':' + ("00" + (selectedDataEnd.getMinutes()))?.slice(-2) + ':' + ("00" + (selectedDataEnd.getSeconds()))?.slice(-2);
        const postData = {
            school: selectedSchool.id,
            appointment: selectInfo.event?.extendedProps?.data?.id,
            date: selectedDate,
            start,
            end,
            typeCode
        }
        fetchRequest(appointmentRequestEdit, 'POST', postData)
            .then(res => {
                const { success = false, message = null, appointments = [] } = res
                if (success) {
                    const scheduleObj = [];
                    const newRequestsObj = [];
                    const rejectedRequestsObj = [];
                    if (appointments && appointments?.length > 0) {
                        appointments?.map((app) => {
                            if (app?.statusCode == "SENT") {
                                newRequestsObj.push(app)
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            } else if (app?.statusCode == "REJECT") {
                                rejectedRequestsObj.push(app)
                            } else if (app?.statusCode == "ACCEPT") {
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            }
                            return null
                        })
                    }
                    setSchedule(scheduleObj)
                    setRejectedRequests(rejectedRequestsObj);
                    setNewRequests(newRequestsObj);
                } else {
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }

    const renderTab = () => {
        const tabs = {
            'REQUESTS':
                newRequests && newRequests.length > 0 ?
                    newRequests.map((newRequest, i) => {
                        return (
                            <Card className={i > 0 ? 'no-border-radius mt-2' : 'no-border-radius'} key={i}>
                                <Card.Body>
                                    <Row>
                                        <Col xs={2} className='d-flex align-items-center'>
                                            <img className="profile" alt={newRequest?.firstName || t('system.profilePicture')} src={newRequest?.avatar ? `https://api.eschool.mn/${newRequest?.avatar}` : '../img/system/default-profile.png'} width={65} />
                                        </Col>
                                        <Col xs={7}>
                                            <Row>
                                                <Col className='pe-0'>
                                                    <Button
                                                        variant="dark"
                                                        style={{ backgroundColor: '#575962' }}
                                                        size='sm'
                                                        className='br-4 w-100 fs-13'
                                                    >
                                                        {newRequest?.appointmentDate?.date?.slice(0, 10)}
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        variant="dark"
                                                        style={{ backgroundColor: '#575962' }}
                                                        size='sm'
                                                        className='br-4 w-100 fs-13'
                                                    >
                                                        {newRequest?.startTime?.date?.slice(11, 16)} - {newRequest?.endTime?.date?.slice(11, 16)}
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row className='fs-13 mt-2'>
                                                <span className='color-grey'>{newRequest?.createdDate?.date?.slice(0, 19)}</span>
                                                <span className='absolute-black'>{newRequest?.className || '-'} | {newRequest?.code || '-'}</span>
                                                <span className='absolute-black'>{newRequest?.lastName} <b className='text-secondary text-uppercase font-weight-bold'>{newRequest?.firstName}</b></span>
                                            </Row>
                                        </Col>
                                        <Col xs={3} className='d-flex align-items-center'>
                                            <Button
                                                onClick={() => onResponseAppointment(newRequest)}
                                                variant="secondary"
                                                size='sm'
                                                className='br-8 w-100 fs-13 text-black text-wrap lh-base p-3'
                                            >
                                                {t('appointment.respond')}
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row className='absolute-black mt-2'>
                                        {newRequest?.content}
                                    </Row>
                                </Card.Body>
                            </Card>
                        )
                    })
                    :
                    <Card className='no-border-radius'>
                        <Card.Body className='text-center'>
                            {t('appointment.emptyNewRequest')}
                        </Card.Body>
                    </Card>,
            'REJECTED':
                rejectedRequests && rejectedRequests.length > 0 ?
                    rejectedRequests.map((rejectedRequest, i) => {
                        return (
                            <Card className={i > 0 ? 'no-border-radius mt-2' : 'no-border-radius'} key={i}>
                                <Card.Body>
                                    <Row>
                                        <Col xs={2} className='d-flex align-items-center'>
                                            <img className="profile" alt={rejectedRequest?.firstName || t('system.profilePicture')} src={rejectedRequest?.avatar ? `https://api.eschool.mn/${rejectedRequest?.avatar}` : '../img/system/default-profile.png'} width={65} />
                                        </Col>
                                        <Col xs={7}>
                                            <Row>
                                                <Col className='pe-0'>
                                                    <Button
                                                        variant="dark"
                                                        style={{ backgroundColor: '#575962' }}
                                                        size='sm'
                                                        className='br-4 w-100 fs-13'
                                                    >
                                                        {rejectedRequest?.appointmentDate?.date?.slice(0, 10)}
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        variant="dark"
                                                        style={{ backgroundColor: '#575962' }}
                                                        size='sm'
                                                        className='br-4 w-100 fs-13'
                                                    >
                                                        {rejectedRequest?.startTime?.date?.slice(11, 16)} - {rejectedRequest?.endTime?.date?.slice(11, 16)}
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row className='fs-13 mt-2'>
                                                <span className='color-grey'>{rejectedRequest?.createdDate?.date?.slice(0, 19)}</span>
                                                <span className='absolute-black'>{rejectedRequest?.className || '-'} | {rejectedRequest?.code || '-'}</span>
                                                <span className='absolute-black'>{rejectedRequest?.lastName} <b className='text-secondary text-uppercase font-weight-bold'>{rejectedRequest?.firstName}</b></span>
                                            </Row>
                                        </Col>
                                        <Col xs={3} className='d-flex align-items-center'>
                                            <Button
                                                variant="success"
                                                size='sm'
                                                className='br-8 w-100 fs-13'
                                                onClick={() => { setSelectedId(rejectedRequest?.id); setShowAcceptAppointment(true); }}
                                            >
                                                {t('appointment.accept')}
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row className='absolute-black mt-2'>
                                        {rejectedRequest?.content}
                                    </Row>
                                </Card.Body>
                            </Card>
                        )
                    })
                    :
                    <Card className='no-border-radius'>
                        <Card.Body className='text-center'>
                            {t('appointment.emptyRejectedRequest')}
                        </Card.Body>
                    </Card>,
        };
        return tabs[tabKey];
    };

    useEffect(() => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            typeCode
        }
        fetchRequest(appointmentRequestIndex, 'POST', postData)
            .then(res => {
                const { success = false, message = null, appointments = [] } = res
                if (success) {
                    const scheduleObj = [];
                    const newRequestsObj = [];
                    const rejectedRequestsObj = [];
                    if (appointments && appointments?.length > 0) {
                        appointments?.map((app) => {
                            if (app?.statusCode == "SENT") {
                                newRequestsObj.push(app)
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            } else if (app?.statusCode == "REJECT") {
                                rejectedRequestsObj.push(app)
                            } else if (app?.statusCode == "ACCEPT") {
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            }
                            return null
                        })
                    }
                    setSchedule(scheduleObj)
                    setRejectedRequests(rejectedRequestsObj);
                    setNewRequests(newRequestsObj);
                } else {
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }, []);

    const onResponseAppointmentSubmitHandler = (params) => {
        dispatch(setLoading(true));
        const postData = {
            ...{ school: selectedSchool?.id },
            ...params,
            typeCode
        }
        fetchRequest(appointmentRequestSubmit, 'POST', postData)
            .then(res => {
                const { message = null, success = false, appointments = [] } = res
                if (success) {
                    const scheduleObj = [];
                    const newRequestsObj = [];
                    const rejectedRequestsObj = [];
                    if (appointments && appointments?.length > 0) {
                        appointments?.map((app) => {
                            if (app?.statusCode == "SENT") {
                                newRequestsObj.push(app)
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            } else if (app?.statusCode == "REJECT") {
                                rejectedRequestsObj.push(app)
                            } else if (app?.statusCode == "ACCEPT") {
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            }
                            return null
                        })
                    }
                    setSchedule(scheduleObj)
                    setRejectedRequests(rejectedRequestsObj)
                    setNewRequests(newRequestsObj)
                    setShowResponseAppointment(false)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'), success)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    const handleGridTypeDropdownChange = (e) => {
        setCurrentDate(new Date())
        setFirstDayOfWeek(new Date(current.getFullYear(), current.getMonth(), new Date().getDate() - new Date().getDay()))
        setLastDayOfWeek(new Date(current.getFullYear(), current.getMonth(), (new Date().getDate() - new Date().getDay()) + 6))
        setGridType(e.target.value)
    }

    const handleNextMonthClick = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        setCurrentDate(newDate)
        const calendarAPI = calendarRef?.current?.getApi();
        calendarAPI?.next();
    }

    const handlePrevMonthClick = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        setCurrentDate(newDate)
        const calendarAPI = calendarRef?.current?.getApi();
        calendarAPI?.prev();
    }

    const handleNextWeekClick = () => {
        const newFirstDate = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate() + 1); // get current date
        const newLastDate = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate() + 7); // get current date

        setFirstDayOfWeek(newFirstDate)
        setLastDayOfWeek(newLastDate)
        const calendarAPI = calendarRef?.current?.getApi();
        calendarAPI?.next();
    }

    const handlePrevWeekClick = () => {
        const newFirstDate = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate() - 13); // get current date
        const newLastDate = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate() - 7)

        setFirstDayOfWeek(newFirstDate)
        setLastDayOfWeek(newLastDate)
        const calendarAPI = calendarRef?.current?.getApi();
        calendarAPI?.prev();
    }

    const handleNextDayClick = () => {
        const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        setCurrentDate(newDate)
        const calendarAPI = calendarRef?.current?.getApi();
        calendarAPI?.next();
    }

    const handlePrevDayClick = () => {
        const newDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        setCurrentDate(newDate)
        const calendarAPI = calendarRef?.current?.getApi();
        calendarAPI?.prev();
    }

    const onModalClose = () => {
        setSelectedId(null);
        setShowAcceptAppointment(false);
    };

    const onAccpetAppointmentHandler = () => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id,
            appointment: selectedId,
            typeCode,
            isAccepted: true
        }
        fetchRequest(appointmentRequestSubmit, 'POST', postData)
            .then(res => {
                const { message = null, success = false, appointments = [] } = res
                if (success) {
                    const scheduleObj = [];
                    const newRequestsObj = [];
                    const rejectedRequestsObj = [];
                    if (appointments && appointments?.length > 0) {
                        appointments?.map((app) => {
                            if (app?.statusCode == "SENT") {
                                newRequestsObj.push(app)
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            } else if (app?.statusCode == "REJECT") {
                                rejectedRequestsObj.push(app)
                            } else if (app?.statusCode == "ACCEPT") {
                                scheduleObj.push(
                                    {
                                        id: app?.id,
                                        title: app?.firstName,
                                        start: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.startTime?.date?.slice(11, 19),
                                        end: app?.appointmentDate?.date?.slice(0, 10) + ' ' + app?.endTime?.date?.slice(11, 19),
                                        data: app
                                    }
                                )
                            }
                            return null
                        })
                    }
                    setSchedule(scheduleObj)
                    setRejectedRequests(rejectedRequestsObj)
                    setNewRequests(newRequestsObj)
                    setShowAcceptAppointment(false)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'), success)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }

    return (
        <>
            <Row>
                <Col lg={12} className="mb-3">
                    <h2 className='font-standard mb-0'>
                        {t('dashboard.appointment')}
                    </h2>
                    <BreadcrumbList
                        basePath='/'
                        key={1}
                        items={breadcrumbs}
                    />
                </Col>
                <Row>
                    <Col md={4}>
                        {
                            types && types.length > 0
                                ?
                                <Nav
                                    className='row'
                                    variant="tabs"
                                    activeKey={tabKey}
                                    onSelect={(key) => handleTabChange(key)}
                                >
                                    {
                                        types.map(type => {
                                            return (
                                                <Col key={"type_" + type.id} className='p-0'>
                                                    <Nav.Item className='text-center'>
                                                        <Nav.Link eventKey={type.id} className='fs-14'>{type.name}</Nav.Link>
                                                    </Nav.Item>
                                                </Col>
                                            )
                                        })
                                    }
                                </Nav>
                                : null
                        }
                        <Row>
                            <Col lg={12} className='p-0 pt-3'>
                                {renderTab()}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8}>
                        {/* Datatable start */}
                        <Row>
                            <Col lg={12} className='pe-0'>
                                <Card className='no-border-radius'>
                                    <Card.Body>

                                        <Row className='py-5'>
                                            <Col md={3}></Col>
                                            <Col md={6} className='text-center text-info font-pinnacle-demibold fs-16'>
                                                {
                                                    gridType == "MONTH" &&
                                                    <>
                                                        <Button className='calendar-btn' onClick={() => handlePrevMonthClick()}>{"<"}</Button>
                                                        {currentDate.getFullYear() + ", " + ("00" + (currentDate.getMonth() + 1)).slice(-2) + ' сар'}
                                                        <Button className='calendar-btn' onClick={() => handleNextMonthClick()}>{">"}</Button>
                                                    </>
                                                }
                                                {
                                                    gridType == "WEEK" &&
                                                    <>
                                                        <Button className='calendar-btn' onClick={() => handlePrevWeekClick()}>{"<"}</Button>
                                                        {firstDayOfWeek.getFullYear() + "." + ("00" + (firstDayOfWeek.getMonth() + 1)).slice(-2) + "." + ("00" + firstDayOfWeek.getDate()).slice(-2)}
                                                        -
                                                        {lastDayOfWeek.getFullYear() + "." + ("00" + (lastDayOfWeek.getMonth() + 1)).slice(-2) + "." + ("00" + lastDayOfWeek.getDate()).slice(-2)}
                                                        <Button className='calendar-btn' onClick={() => handleNextWeekClick()}>{">"}</Button>
                                                    </>
                                                }
                                                {
                                                    gridType == "DAY" &&
                                                    <>
                                                        <Button className='calendar-btn' onClick={() => handlePrevDayClick()}>{"<"}</Button>
                                                        {currentDate.getFullYear() + "." + ("00" + (currentDate.getMonth() + 1)).slice(-2) + "." + ("00" + currentDate.getDate()).slice(-2)}
                                                        <Button className='calendar-btn' onClick={() => handleNextDayClick()}>{">"}</Button>
                                                    </>
                                                }
                                            </Col>
                                            <Col md={3} className='d-flex justify-content-end'>
                                                <select className='custom-dropdown' onChange={handleGridTypeDropdownChange}>
                                                    {
                                                        gridTypeOptions && gridTypeOptions.length > 0 &&
                                                        gridTypeOptions.map((param, i) => (
                                                            <option key={i} value={param.value} style={{ padding: 10 }}>{param.text}</option>
                                                        ))
                                                    }
                                                </select>
                                            </Col>
                                        </Row>
                                        {
                                            gridType == "MONTH" &&
                                            <FullCalendar
                                                ref={calendarRef}
                                                // headerToolbar={{
                                                //     left: '',
                                                //     center: 'prev title next',
                                                //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                                //     // right: 'custom'
                                                // }}
                                                //custom button turshilt dropdown bolgoj chadsangui
                                                // customButtons={{
                                                //     custom: {
                                                //         text: 'aaa',
                                                //         click: () => { alert('haha')},

                                                //     }
                                                // }}
                                                headerToolbar={false}
                                                buttonText={{
                                                    today: 'Өнөөдөр',
                                                    month: 'Сараар',
                                                    week: '7 хоног',
                                                    day: 'Өдөр',
                                                }}
                                                allDayText='Бүтэн өдөр'
                                                titleFormat={{
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                }}
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                initialView='dayGridMonth'
                                                weekends="true"
                                                eventContent={renderEvent}
                                                events={schedule}
                                                eventClick={handleEventClick}
                                                editable="true"
                                                droppable="true"
                                                eventDurationEditable={false}
                                                eventDrop={handleDrop}
                                            />
                                        }
                                        {
                                            gridType == "WEEK" &&
                                            <FullCalendar
                                                ref={calendarRef}
                                                // headerToolbar={{
                                                //     left: '',
                                                //     center: 'prev title next',
                                                //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                                //     // right: 'custom'
                                                // }}
                                                //custom button turshilt dropdown bolgoj chadsangui
                                                // customButtons={{
                                                //     custom: {
                                                //         text: 'aaa',
                                                //         click: () => { alert('haha')},

                                                //     }
                                                // }}
                                                headerToolbar={false}
                                                buttonText={{
                                                    today: 'Өнөөдөр',
                                                    month: 'Сараар',
                                                    week: '7 хоног',
                                                    day: 'Өдөр',
                                                }}
                                                allDayText='Бүтэн өдөр'
                                                titleFormat={{
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                }}
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                initialView='timeGridWeek'
                                                weekends="true"
                                                eventContent={renderEvent}
                                                events={schedule}
                                                eventClick={handleEventClick}
                                                editable="true"
                                                droppable="true"
                                                eventDurationEditable={false}
                                                eventDrop={handleDrop}
                                            />
                                        }
                                        {
                                            gridType == "DAY" &&
                                            <FullCalendar
                                                ref={calendarRef}
                                                // headerToolbar={{
                                                //     left: '',
                                                //     center: 'prev title next',
                                                //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                                //     // right: 'custom'
                                                // }}
                                                //custom button turshilt dropdown bolgoj chadsangui
                                                // customButtons={{
                                                //     custom: {
                                                //         text: 'aaa',
                                                //         click: () => { alert('haha')},

                                                //     }
                                                // }}
                                                headerToolbar={false}
                                                buttonText={{
                                                    today: 'Өнөөдөр',
                                                    month: 'Сараар',
                                                    week: '7 хоног',
                                                    day: 'Өдөр',
                                                }}
                                                allDayText='Бүтэн өдөр'
                                                titleFormat={{
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                }}
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                initialView='timeGridDay'
                                                weekends="true"
                                                eventContent={renderEvent}
                                                events={schedule}
                                                eventClick={handleEventClick}
                                                editable="true"
                                                droppable="true"
                                                eventDurationEditable={false}
                                                eventDrop={handleDrop}
                                            />
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {/* Datatable end */}
                        {/* Modals start */}
                        {showResponseAppointment &&
                            <ResponseAppointment
                                newRequest={selectedRequest}
                                show={showResponseAppointment}
                                setShow={setShowResponseAppointment}
                                onSubmit={onResponseAppointmentSubmitHandler}
                            />
                        }
                        {showViewAppointment &&
                            <ViewAppointment
                                newRequest={selectedRequest}
                                show={showViewAppointment}
                                setShow={setShowViewAppointment}
                            />
                        }
                        {showAcceptAppointment && selectedId && (
                            <DeleteModal
                                onClose={onModalClose}
                                onDelete={onAccpetAppointmentHandler}
                                title={t('appointment.accept')}
                                modalSize='md'
                                btnClass='success'
                                btnText={t('appointment.accept')}
                            >
                                <br />
                                {t('warning.approve_appointment_time')}
                                <br />
                            </DeleteModal>
                        )}
                        {/* Modals end */}
                    </Col>
                </Row>
            </Row>
        </>
    );
};

export default index;
