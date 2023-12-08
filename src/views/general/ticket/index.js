import React, { useState, useEffect,  } from 'react';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import {  useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { userChangePassword, ticketIndex } from 'utils/fetchRequest/Urls';
import 'css/dashboard.css';
import 'css/fullcalendar-custom.css'
import CreateTicketModal from './createTicketModal'

const index = (onChange) => {
    const [data, setData] = useState([]);
    const dumpFiles = [
        {
          id: 5849405,
          type: 'Алдаа',
          status: 'Шинэ',
          createdDate: '2023.02.02 12:02',
          system: 'LXP',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor'
        },
        {
          id: 123456,
          type: 'Санал хүсэлт',
          status: 'Шинэ',
          createdDate: '2023.03.15 09:45',
          system: 'CRM',
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'
        },
        {
          id: 789012,
          type: 'Санал хүсэлт',
          status: 'Хаасан',
          createdDate: '2023.05.20 17:30',
          system: 'ERP',
          description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
        },
        {
          id: 345678,
          type: 'Санал хүсэлт',
          status: 'Шинэ',
          createdDate: '2023.07.10 14:20',
          system: 'HRM',
          description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
        }
      ];
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: '/ticket/index', text: 'Санал хүсэлт' },

    ];
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
    const [value, setValue] = React.useState();
    const [dropdownStates, setDropdownStates] = useState(Array(dumpFiles.length).fill(false));

    const handleDropdownToggle = (i) => {
        const updatedDropdownStates = [...dropdownStates];
        updatedDropdownStates[i] = !updatedDropdownStates[i];
        setDropdownStates(updatedDropdownStates);
    };

    const [showCreateTicket, setShowCreateTicket] = useState(false);

    const onChangeCreateTicketSubmit = (param) => {
        dispatch(setLoading(true));
        const postData = {
            ...param
        }
        fetchRequest(userChangePassword, 'POST', postData)
            .then(response => {
                const { message = null, success = false } = response
                if (response.success) {
                    setShowCreateTicket(false)
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

       const createRequest = () => {
        setShowCreateTicket(true);

        console.log('called')
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
                        <Row>
                            <Card>
                                <Card.Body>
                                    <Row className='center'>
                                        <Col lg={3}></Col>
                                        <Col lg={2}>
                                            <img src='../img/system/dashboard-light-icon.png' alt='school-icon' width={200} className='color-info me-1' /></Col>
                                        <Col lg={4} className='d-flex align-items-center justify-content-center' style={{ color: '#000000', display: 'flex' }}>
                                            <Row className='d-flex align-items-center'>
                                                <div style={{ textAlign: 'center', color: '#000000'}}>
                                                    Системтэй холбоотой санал хүсэлт, алдааны мэдээллээ бидэнд илгээнэ үү.
                                                </div>
                                                <div className='ml-auto' style={{ marginTop: 20, textAlign: 'center' }}>
                                                    <Button style={{ backgroundColor: '#FD7845', fontWeight:'normal' }} onClick={createRequest}>Санал хүсэлт илгээх</Button>
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col lg={3}></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col style={{ color: '#FD7845', fontSize: 16, fontWeight:'bolder' }}>Миний илгээсэн санал хүсэлтүүд</Col>
                    <Col lg={2}>
                        <input
                            className="form-control datatable-search"
                            value={value || ''}
                            onChange={(e) => {
                                setValue(e.target.value);
                                onChange(e.target.value);
                            }}
                            placeholder="Хайх..."
                        />
                    </Col>
                </Row>
                {data.map((item, i) => (
                <Row  key={i} style={{ marginTop: 10 }}>
                    <Card className="mb-3">
                        <Card.Body className="d-flex flex-row align-content-center align-items-center position-relative mb-3">
                        <Col lg={1} className="text-center flex-row">
                            <Row style={{ display: 'flex' }}>
                                <div style={{ textAlign: 'center'}}>
                                <img src="../img/system/default-profile.png" alt="school-icon" className="color-info me-1" style={{ maxWidth: '80%', height: 'auto' }} />
                                </div>
                                <div style={{ textAlign: 'center', color: '#FD7845', fontSize: 14, fontWeight: 'bold' }}>
                                #{item.id}
                                </div>
                            </Row>
                        </Col>

                            <Col>
                            <Row>
                                <Col>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled
                                    style={getButtonColor(item.status)}
                                >
                                    {item.status}
                                </Button>
                                </Col>
                                <Dropdown style={{width: 20}}>
                                    <Dropdown.Toggle className="btn-icon btn-icon-only " size="sm"  onClick={() => handleDropdownToggle(i)} style={{ color: '#FD7845', border: '1px solid' }}>
                                    {/* <CsLineIcons icon="more-vertical" /> */}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu  show={dropdownStates[i]}>
                                        <Dropdown.Item><img src='../img/system/menu.png' alt='school-icon' width={15} className='color-info me-1' />Дэлгэрэнгүй харах</Dropdown.Item>
                                        <Dropdown.Item><img src='../img/system/settings.png' alt='school-icon' width={15} className='color-info me-1' />Хүсэлтээ засах</Dropdown.Item>
                                        <Dropdown.Item><img src='../img/system/service.png' alt='school-icon' width={15} className='color-info me-1' />Хүсэлтээ цуцлах</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>

                                <div  style={{ color: 'black', fontSize: 15, fontWeight: 'semibold' }}>
                                    {item.createdDate?.date} | {item.type} | {item.systemId} | {item.createdUser}
                                </div>
                                <div   style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
                                    {item.description}
                                </div>
                            </Col>
                        </Card.Body>
                    </Card>
                </Row>
                       ))}
            </Row>
            <Row>
            {
                showCreateTicket &&
                <CreateTicketModal
                    show={showCreateTicket}
                    setShow={setShowCreateTicket}
                    onSubmit={onChangeCreateTicketSubmit}
                />
            }
            </Row>
        </>
    );
};

export default index;
