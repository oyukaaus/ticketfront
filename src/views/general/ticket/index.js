import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { ticketIndex } from 'utils/fetchRequest/Urls';
import { PlaylistAddCheckCircleOutlined } from '@mui/icons-material';
import CreateTicket from './modal/create';
import CancelRequest from './modal/cancel';
import EditTicket from './modal/edit'

const TicketPage = (props) => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [itemId, setItemId] = useState();
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
                return { backgroundColor: 'green', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'eSchool хүлээж авсан':
                return { backgroundColor: 'blue', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'Хаагдсан':
                return { backgroundColor: 'grey', color: '#FFFFFF', fontFamily: 'Mulish' };
            case 'Цуцласан':
                return { backgroundColor: 'red', color: '#FFFFFF', fontFamily: 'Mulish' };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'Mulish' }; // Default button color
        }
    };
    const [value, setValue] = React.useState();
    const [dropdownStates, setDropdownStates] = useState(Array(data.length).fill(false));

    const handleDropdownToggle = (i) => {
        const updatedDropdownStates = [...dropdownStates];
        updatedDropdownStates[i] = !updatedDropdownStates[i];
        setDropdownStates(updatedDropdownStates);
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

    const createRequest = () => {
        setShowCreateTicket(true);
    };

    const cancelTicket = (id) => {
        setItemId(id);
        setShowCancel(true);
    };

    const editTicket = (id) => {
        const filteredData = data.filter(item => item.id === id);
        setSelectedData(filteredData);
        setShowEdit(true);
    };

    const cancelFetch = () => {
        console.log(itemId, 'cancelled')
    }
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
                                            <img src='../img/ticket/request.png' alt='school-icon'  className='color-info me-1' /></Col>
                                        <Col lg={4} className='d-flex align-items-center justify-content-center' style={{ color: '#000000', display: 'flex' }}>
                                            <Row className='d-flex align-items-center'>
                                                <div style={{ textAlign: 'center', color: '#000000', fontFamily: 'Mulish' }}>
                                                    Системтэй холбоотой санал хүсэлт, алдааны мэдээллээ бидэнд илгээнэ үү.
                                                </div>
                                                <div className='ml-auto' style={{ marginTop: 20, textAlign: 'center', fontFamily: 'Mulish' }}>
                                                    <Button style={{ backgroundColor: '#FD7845', fontWeight: 'normal', fontFamily: 'Mulish' }} onClick={createRequest}>Санал хүсэлт илгээх</Button>
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
                    <Col style={{ color: '#FD7845', fontSize: 16, fontWeight: 'bolder', fontFamily: 'Mulish' }}>Миний илгээсэн санал хүсэлтүүд</Col>
                    <Col lg={2}>
                        <input
                            className="form-control datatable-search"
                            value={value || ''}
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            placeholder="Хайх..."
                            style={{ fontFamily: 'Mulish' }}
                        />
                    </Col>
                </Row>
                {data.map((item, i) => (
                    <Row key={i} style={{ marginTop: 10 }}>
                        <Card className="mb-3">
                            <Card.Body className="d-flex flex-row align-content-center align-items-center position-relative mb-3">
                                <Col lg={1} className="text-center flex-row">
                                    <Row style={{ display: 'flex' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <img src="../img/ticket/avatar.png" alt="school-icon" className="color-info me-1"/>
                                        </div>
                                        <div style={{ textAlign: 'center', color: '#FD7845', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}>
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
                                        <Dropdown style={{ width: 20 }}>
                                            <Dropdown.Toggle 
                                            className="btn-icon btn-icon-only " size="sm" onClick={() => handleDropdownToggle(i)} style={{ color: '#FD7845', border: '1px solid' }}
                                            >
                                            {/* <img src="../img/ticket/icon/dot.png" alt="dot-icon" width={10} className="color-info me-1"/> */}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu show={dropdownStates[i]}>
                                                <Dropdown.Item onClick={() => history.push(`/ticket/view/${item.id}`)}>
                                                        <PlaylistAddCheckCircleOutlined className="w-19" /> Дэлгэрэнгүй харах
                                                </Dropdown.Item>
                                                <Dropdown.Item  onClick={() => editTicket(item.id)}>
                                                        <PlaylistAddCheckCircleOutlined className="w-19" />Хүсэлтээ засах
                                                </Dropdown.Item >
                                                <Dropdown.Item onClick={() => cancelTicket(item.id)} >
                                                    <PlaylistAddCheckCircleOutlined className="w-19" />Хүсэлтээ цуцлах
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Row>

                                    <div style={{ color: 'black', fontSize: 15, fontWeight: 'semibold', fontFamily: 'Mulish' }}>
                                        {item.createdDate?.date} | {item.type} | {item.systemId} | {item.createdUser}
                                    </div>
                                    <div style={{ color: 'black', fontSize: 14, fontWeight: 'bold', fontFamily: 'Mulish' }}>
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
                    <CreateTicket
                        show={showCreateTicket}
                        setShow={setShowCreateTicket}
                    // onSubmit={onChangeCreateTicketSubmit}
                    />
                }
            </Row>
            <Row>
                {
                    showEdit &&
                    <EditTicket
                        selectedData={selectedData}
                        show={showEdit}
                        setShow={setShowEdit}
                        // onSubmit={editFetch}
                    />
                }
            </Row>
            <Row>
                {
                    showCancel &&
                    <CancelRequest
                        show={showCancel}
                        id={itemId}
                        setShow={setShowCancel}
                        onSubmit={cancelFetch}
                    />
                }
            </Row>
        </>
    );
};

export default TicketPage;
