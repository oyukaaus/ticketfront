import React, { useState, useEffect } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import { homeFacts } from 'utils/fetchRequest/Urls';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, PointElement, LinearScale, LineElement, BarElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { generateColor, priceFormat } from 'utils/utils';
import 'css/dashboard.css';

const index = () => {
    ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // const current = new Date();
    // const dateTimeToday = current.getFullYear() + "-" + ("00" + (current.getMonth() + 1)).slice(-2) + "-" + ("00" + (current.getDate())).slice(-2) + " " + current.getHours() + ":" + ("00" + (current.getMinutes())).slice(-2) + ":" + ("00" + (current.getSeconds())).slice(-2);
    const [tabIndex] = useState('dashboard_tab_index');
    const [tabKey, setTabKey] = useState(null);
    const [tabs, setTabs] = useState([
        {
            id: 'ERP',
            text: 'ERP',
            totalStudentCount: 0,
            totalUser: 0,
            userCard: 0,
        },
        {
            id: 'ADMIN',
            text: 'ADMIN',
            totalStudentCount: 0,
            totalUser: 0,
            userCard: 0,
        },
        {
            id: 'LXP',
            text: 'LXP',
            totalStudentCount: 0,
            totalUser: 0,
            userCard: 0,
        },
    ]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalInactiveStudents, setTotalInactiveStudents] = useState(0);

    const [totalInvoices, setTotalInvoices] = useState(0);
    const [totalActiveInvoices, setTotalActiveInvoices] = useState(0);
    const [totalCompleteInvoices, setTotalCompleteInvoices] = useState(0);
    const [totalIncompleteInvoices, setTotalIncompleteInvoices] = useState(0);
    const [totalQpays, setTotalQpays] = useState(0);
    const [totalQpaysAmount, setTotalQpaysAmount] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [totalCashAmount, setTotalCashAmount] = useState(0);

    const [foodLastTenDaysInfo, setFoodLastTenDaysInfo] = useState([]);
    const [totalActiveFoodSales, setTotalActiveFoodSales] = useState(0);
    const [totalLoanFoodSales, setTotalLoanFoodSales] = useState(0);

    const [busLastTenDaysInfo, setBusLastTenDaysInfo] = useState([]);
    const [totalActiveBusSales, setTotalActiveBusSales] = useState(0);
    const [totalLoanBusSales, setTotalLoanBusSales] = useState(0);

    const [shopLastTenDaysInfo, setShopLastTenDaysInfo] = useState([]);
    const [totalActiveShopSales, setTotalActiveShopSales] = useState(0);
    const [totalLoanShopSales, setTotalLoanShopSales] = useState(0);

    useEffect(() => {
        dispatch(setLoading(true));
        const postData = {
        }
        fetchRequest(homeFacts, 'POST', postData)
            .then(res => {
                console.log('res', res);
                const {
                    cashTotalCount = 0,
                    cashAmount = 0,
                    qpayPayments = 0,
                    qpayPaymentsAmount = 0,
                    activeInvoices = 0,
                    completeInvoices = 0,
                    incompleteInvoices = 0,
                    invoices = 0,
                    foodLastTenDaysSaleDetails = [],
                    activeFoodSales = 0,
                    loanFoodSales = 0,
                    activeBusSales = 0,
                    loanBusSales = 0,
                    busLastTenDaysSaleDetails = 0,
                    activeShopSales = 0,
                    loanShopSales = 0,
                    shopLastTenDaysSaleDetails = 0,
                    users = 0,
                    userCards = 0,
                    students = 0,
                    activeStudents = 0,
                    message = null,
                    success = false
                } = res

                if (!success) {
                    showMessage(message || t('errorMessage.title'));
                } else {
                    const clone = [...tabs];
                    clone.find((p) => p.id === 'ERP').totalStudentCount = students
                    clone.find((p) => p.id === 'ERP').totalUser = users
                    clone.find((p) => p.id === 'ERP').userCard = userCards
                    setTotalStudents(students)
                    setTotalInactiveStudents(activeStudents)

                    setTotalInvoices(invoices)
                    setTotalIncompleteInvoices(incompleteInvoices)
                    setTotalCompleteInvoices(completeInvoices)
                    setTotalActiveInvoices(activeInvoices)
                    setTotalQpays(qpayPayments)
                    setTotalQpaysAmount(qpayPaymentsAmount)
                    setTotalCashAmount(cashAmount)
                    setTotalCash(cashTotalCount)

                    setTotalActiveFoodSales(activeFoodSales)
                    setTotalLoanFoodSales(loanFoodSales)
                    setFoodLastTenDaysInfo(foodLastTenDaysSaleDetails)

                    setTotalActiveBusSales(activeBusSales)
                    setTotalLoanBusSales(loanBusSales)
                    setBusLastTenDaysInfo(busLastTenDaysSaleDetails)

                    setTotalActiveShopSales(activeShopSales)
                    setTotalLoanShopSales(loanShopSales)
                    setShopLastTenDaysInfo(shopLastTenDaysSaleDetails)
                    setTabs(clone)
                }
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
        dispatch(setLoading(false));
    }, []);

    const onTabChangeHandler = (val) => {
        localStorage.setItem(tabIndex, val);
        setTabKey(val)
    }

    const foodLineData = {
        labels: foodLastTenDaysInfo?.map(p => p?.date),
        datasets: [
            {
                label: t('foodManagement.ateStudents'),
                data: foodLastTenDaysInfo?.map(p => {
                    return p.count
                }),
                borderColor: 'rgb(255, 91, 29)',
                backgroundColor: 'rgba(255, 91, 29, 0.5)',
            },
        ],
    };

    const busLineData = {
        labels: busLastTenDaysInfo?.map(p => p?.date),
        datasets: [
            {
                label: t('busManagement.sat'),
                data: busLastTenDaysInfo?.map(p => {
                    return p.count
                }),
                borderColor: 'rgb(255, 91, 29)',
                backgroundColor: 'rgba(255, 91, 29, 0.5)',
                tension: 0.3
            },
        ],
    };

    const shopLineData = {
        labels: shopLastTenDaysInfo?.map(p => p?.date),
        datasets: [
            {
                label: t('foodManagement.ateFoodStudents'),
                data: shopLastTenDaysInfo?.map(p => {
                    return p.count
                }),
                borderColor: 'rgb(255, 91, 29)',
                backgroundColor: 'rgba(255, 91, 29, 0.5)',
            },
        ],
    };

    const lineOptions = {
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
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

    const generalPieData = {
        labels: [t('foodManagement.ateStudents'), t('foodManagement.otherStudents')],
        datasets: [
            {
                label: '# of Votes',
                data: [totalInactiveStudents, totalStudents - totalInactiveStudents],
                backgroundColor: [
                    '#ed595a',
                    '#868aa8',
                ],
                borderWidth: 0,
            },
        ],
    };

    const foodSalePieData = {
        // labels: [t('foodManagement.loan'), t('action.active'), t('busManagement.noTicket')],
        labels: [t('foodManagement.loan'), t('action.active')],
        datasets: [
            {
                label: '# of Votes',
                // data: [totalLoanFoodSales, totalActiveFoodSales, totalStudents - (totalActiveFoodSales + totalLoanFoodSales)],
                data: [totalLoanFoodSales, totalActiveFoodSales],
                backgroundColor: [
                    generateColor(),
                    generateColor(),
                ],
                borderWidth: 0,
            },
        ],
    };

    const busSalePieData = {
        // labels: [t('foodManagement.loan'), t('action.active'), t('busManagement.noTicket')],
        labels: [t('foodManagement.loan'), t('action.active')],
        datasets: [
            {
                label: '# of Votes',
                // data: [totalLoanBusSales, totalActiveBusSales, totalStudents - (totalActiveBusSales + totalLoanBusSales)],
                data: [totalLoanBusSales, totalActiveBusSales],
                backgroundColor: [
                    generateColor(),
                    generateColor(),
                ],
                borderWidth: 0,
            },
        ],
    };

    const shopSalePieData = {
        // labels: [t('foodManagement.loan'), t('action.active'), t('busManagement.noTicket')],
        labels: [t('foodManagement.loan'), t('action.active')],
        datasets: [
            {
                label: '# of Votes',
                // data: [totalLoanShopSales, totalActiveShopSales, totalStudents - (totalActiveShopSales + totalLoanShopSales)],
                data: [totalLoanShopSales, totalActiveShopSales],
                backgroundColor: [
                    generateColor(),
                    generateColor(),
                ],
                borderWidth: 0,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'bottom',
                maxWidth: 10,
                labels: {
                    boxWidth: 15,
                    boxHeight: 15,
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    color: '#575962',
                    borderRadius: 5
                },
                title: {
                    color: '#fff',
                    padding: 100
                },
            },
            tooltip: {
                displayColors: false,
            },
        },
    };

    return (
        <>
            <Nav activeKey={tabKey || tabs?.find((e, i) => i == 0)?.id} className='row'>
                {
                    tabs && tabs.length > 0 &&
                    tabs.map(tab => {
                        return (
                            <Col lg={4} key={tab.id}>
                                <Nav.Item className='h-100'>
                                    <Nav.Link
                                        eventKey={tab.id}
                                        className='card-btn w-100 h-100 p-0'
                                        onClick={() => onTabChangeHandler(tab.id)}
                                    >
                                        <Row className='font-mulish border br-10 bg-white p-3 pt-2 mx-2 h-100' id='card-btn'>
                                            <Col xs={12} className='font-pinnacle-demibold fs-20 text-center mb-3'>
                                                {
                                                    tab?.text
                                                }
                                            </Col>
                                            {/* Style 1 */}
                                            <Col>
                                                <Row>
                                                    <Col className='p-0 text-center'>
                                                        <span className='fs-18 font-weight-bold'>
                                                            {
                                                                priceFormat(tab.totalStudentCount)
                                                            }
                                                        </span>
                                                        <br />
                                                        {t('dashboard.totalStudentCount')}
                                                    </Col>
                                                    <Col className='p-0 text-center'>
                                                        <span className='fs-18 font-weight-bold'>
                                                            {
                                                                priceFormat(tab.totalUser)
                                                            }
                                                        </span>
                                                        <br />
                                                        {t('dashboard.totalUser')}
                                                    </Col>
                                                    {
                                                        tab.id !== 'LXP' &&
                                                        <Col className='p-0 text-center'>
                                                            <span className='fs-18 font-weight-bold'>
                                                                {
                                                                    priceFormat(tab.userCard)
                                                                }
                                                            </span>
                                                            <br />
                                                            {t('dashboard.userCard')}
                                                        </Col>
                                                    }
                                                </Row>
                                            </Col>
                                            {/* Style 2 dooshoogoo tsuvsan*/}
                                            {/* <Col xs={6} className='fs-14 text-right'>
                                                    {t('dashboard.totalStudentCount')}
                                                </Col>
                                                <Col xs={6} className='fs-14 font-weight-bold'>
                                                    {
                                                        priceFormat(tab.totalStudentCount)
                                                    }
                                                </Col>
                                                <Col xs={6} className='fs-14 text-right'>
                                                    {t('dashboard.totalUser')}
                                                </Col>
                                                <Col xs={6} className='fs-14 font-weight-bold'>
                                                    {
                                                        priceFormat(tab.totalUser)
                                                    }
                                                </Col>
                                                <Col xs={6} className='fs-14 text-right'>
                                                    {t('dashboard.userCard')}
                                                </Col>
                                                <Col xs={6} className='fs-14 font-weight-bold'>
                                                    {
                                                        priceFormat(tab.userCard)
                                                    }
                                                </Col> */}
                                        </Row>
                                    </Nav.Link>
                                </Nav.Item>
                            </Col>
                        )
                    })
                }
            </Nav>
            <Row className='mt-4'>
                {
                    (tabKey == 'ERP' || tabKey == null) &&
                    <>
                        <>
                            <Col xs={12} className='font-pinnacle-demibold fs-15 color-info mb-3'>
                                {t('dashboard.generalInformation')}
                            </Col>
                            <Col md={4} className='bg-white me-3 text-center'>
                                <Row className='py-3'>
                                    <Col xs={6}>
                                        <Doughnut height={50} options={pieChartOptions} data={generalPieData} />
                                    </Col>
                                    <Col xs={4} className='d-flex align-items-center text-left'>
                                        <span className='d-flex flex-column'>
                                            <span className='active-text'>
                                                {
                                                    priceFormat(totalInactiveStudents)
                                                }
                                            </span>
                                            <span className='active-text-description'>
                                                {
                                                    t('common.active')
                                                }
                                            </span>
                                            <span className='inactive-text'>
                                                {
                                                    priceFormat(totalStudents - totalInactiveStudents)
                                                }
                                            </span>
                                            <span className='active-text-description'>
                                                {
                                                    t('foodManagement.otherStudents')
                                                }
                                            </span>
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='bg-white text-center gx-0 p-3'>
                                <Row className='gx-0'>
                                    <Col className='custom-active-tab mx-2 text-center'>
                                        <div className='custom-erp-title'>
                                            <span className='fs-18 font-weight-bold'>
                                                {
                                                    priceFormat(totalInvoices)
                                                }
                                            </span>
                                            <br />
                                            {t('dashboard.invoiceTotalCount')}
                                        </div>
                                        <Row className='w-100 gx-0 px-3 border-top-info pt-2'>
                                            <Col xs={12} className='p-0 text-center'>
                                                <span className='fs-18 font-weight-bold inactive-text'>
                                                    {
                                                        priceFormat(totalActiveInvoices)
                                                    }
                                                </span>
                                                <br />
                                                <span className='active-text-description'>
                                                    {t('finance.notPaid')}
                                                </span>
                                            </Col>
                                            <Col xs={12} className='p-0 text-center'>
                                                <span className='fs-18 font-weight-bold inactive-text'>
                                                    {
                                                        priceFormat(totalIncompleteInvoices)
                                                    }
                                                </span>
                                                <br />
                                                <span className='active-text-description'>
                                                    {t('dashboard.unpaid')}
                                                </span>
                                            </Col>
                                            <Col xs={12} className='p-0 text-center'>
                                                <span className='fs-18 font-weight-bold inactive-text'>
                                                    {
                                                        priceFormat(totalCompleteInvoices)
                                                    }
                                                </span>
                                                <br />
                                                <span className='active-text-description'>
                                                    {t('finance.paid')}
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className='custom-active-tab me-2 text-center'>
                                        <div className='custom-erp-title fs-18 d-flex align-items-center justify-content-center font-weight-bold'>
                                            {t('dashboard.qPay')}
                                        </div>
                                        <Row className='w-100 gx-0 px-3 border-top-info pt-2'>
                                            <Col xs={12} className='p-0 text-center'>
                                                <span className='fs-18 font-weight-bold inactive-text'>
                                                    {
                                                        priceFormat(totalQpays)
                                                    }
                                                </span>
                                                <br />
                                                <span className='active-text-description'>
                                                    {t('finance.netPayment')}
                                                </span>
                                            </Col>
                                            <Col xs={12} className='p-0 text-center'>
                                                <span className='fs-18 font-weight-bold inactive-text'>
                                                    {
                                                        priceFormat(totalQpaysAmount)
                                                    }
                                                </span>
                                                <br />
                                                <span className='active-text-description'>
                                                    {t('busManagement.totalAmount')}
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className='custom-active-tab me-2 text-center'>
                                        <div className='custom-erp-title fs-18 d-flex align-items-center justify-content-center font-weight-bold'>
                                            {t('dashboard.cashAccount')}
                                        </div>
                                        <Row className='w-100 gx-0 px-3 border-top-info pt-2'>
                                            <Col xs={12} className='p-0 text-center'>
                                                <span className='fs-18 font-weight-bold inactive-text'>
                                                    {
                                                        priceFormat(totalCash)
                                                    }
                                                </span>
                                                <br />
                                                <span className='active-text-description'>
                                                    {t('finance.netPayment')}
                                                </span>
                                            </Col>
                                            <Col xs={12} className='p-0 text-center'>
                                                <span className='fs-18 font-weight-bold inactive-text'>
                                                    {
                                                        priceFormat(totalCashAmount)
                                                    }
                                                </span>
                                                <br />
                                                <span className='active-text-description'>
                                                    {t('busManagement.totalAmount')}
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </>
                        <>
                            <Col xs={12} className='font-pinnacle-demibold fs-15 color-info my-3'>
                                {t('foodManagement.ticket')}
                            </Col>
                            <Col md={4} className='bg-white d-flex align-items-center justify-content-center'>
                                {
                                    totalLoanFoodSales != 0 && totalActiveFoodSales != 0
                                        ?
                                        <Row className='py-3 w-100'>
                                            <Col md={6}>
                                                <Doughnut height={50} options={pieChartOptions} data={foodSalePieData} />
                                            </Col>
                                            <Col md={6} className='d-flex align-items-center text-left'>
                                                <span className='d-flex flex-column'>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalActiveFoodSales)
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('action.active')
                                                        }
                                                    </span>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalLoanFoodSales)
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('discount.loan')
                                                        }
                                                    </span>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalStudents - (totalActiveFoodSales + totalLoanFoodSales))
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('busManagement.noTicket')
                                                        }
                                                    </span>
                                                </span>
                                            </Col>
                                        </Row>
                                        :
                                        t('system.noData')
                                }
                            </Col>
                            <Col md={8} className='bg-white text-center'>
                                {
                                    foodLastTenDaysInfo && foodLastTenDaysInfo.length > 0
                                        ?
                                        <Row className='py-3'>
                                            <Col>
                                                <Line height={90} options={lineOptions} data={foodLineData} />
                                            </Col>
                                        </Row>
                                        :
                                        t('system.noData')
                                }
                            </Col>
                        </>
                        <>
                            <Col xs={12} className='font-pinnacle-demibold fs-15 color-info my-3'>
                                {t('busManagement.busSale')}
                            </Col>
                            <Col md={4} className='bg-white d-flex align-items-center justify-content-center'>
                                {
                                    totalLoanBusSales != 0 && totalActiveBusSales != 0
                                        ?
                                        <Row className='py-3 w-100'>
                                            <Col md={6}>
                                                <Doughnut height={50} options={pieChartOptions} data={busSalePieData} />
                                            </Col>
                                            <Col md={6} className='d-flex align-items-center text-left'>
                                                <span className='d-flex flex-column'>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalActiveBusSales)
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('action.active')
                                                        }
                                                    </span>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalLoanBusSales)
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('discount.loan')
                                                        }
                                                    </span>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalStudents - (totalActiveBusSales + totalLoanBusSales))
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('busManagement.noTicket')
                                                        }
                                                    </span>
                                                </span>
                                            </Col>
                                        </Row>
                                        :
                                        t('system.noData')
                                }
                            </Col>
                            <Col md={8} className='bg-white text-center'>
                                {
                                    busLastTenDaysInfo && busLastTenDaysInfo.length > 0
                                        ?
                                        <Row className='py-3'>
                                            <Col>
                                                <Line height={90} options={lineOptions} data={busLineData} />
                                            </Col>
                                        </Row>
                                        :
                                        t('system.noData')
                                }
                            </Col>
                        </>
                        <>
                            <Col xs={12} className='font-pinnacle-demibold fs-15 color-info my-3'>
                                {t('shopManagement.sale')}
                            </Col>
                            <Col md={4} className='bg-white d-flex align-items-center justify-content-center'>
                                {
                                    totalLoanShopSales != 0 && totalActiveShopSales != 0
                                        ?
                                        <Row className='py-3 w-100'>
                                            <Col md={6}>
                                                <Doughnut height={50} options={pieChartOptions} data={shopSalePieData} />
                                            </Col>
                                            <Col md={6} className='d-flex align-items-center text-left'>
                                                <span className='d-flex flex-column'>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalActiveShopSales)
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('action.active')
                                                        }
                                                    </span>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalLoanShopSales)
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('discount.loan')
                                                        }
                                                    </span>
                                                    <span className='active-text'>
                                                        {
                                                            priceFormat(totalStudents - (totalActiveShopSales + totalLoanShopSales))
                                                        }
                                                    </span>
                                                    <span className='active-text-description'>
                                                        {
                                                            t('busManagement.noTicket')
                                                        }
                                                    </span>
                                                </span>
                                            </Col>
                                        </Row>
                                        :
                                        t('system.noData')
                                }
                            </Col>
                            <Col md={8} className='bg-white text-center'>
                                {
                                    shopLastTenDaysInfo && shopLastTenDaysInfo.length > 0
                                        ?
                                        <Row className='py-3'>
                                            <Col>
                                                <Line height={90} options={lineOptions} data={shopLineData} />
                                            </Col>
                                        </Row>
                                        :
                                        t('system.noData')
                                }
                            </Col>
                        </>
                    </>
                }
                {
                    (tabKey == 'ADMIN') &&
                    <>
                        <Col xs={12} className='font-pinnacle-demibold fs-15 color-info mb-3'>
                            {t('dashboard.generalInformation')}
                        </Col>
                        <Col sm={4} className='bg-white me-3 text-center'>
                            <Row className='py-3'>
                                <Col xs={6}>
                                    <Doughnut height={50} options={pieChartOptions} data={generalPieData} />
                                </Col>
                                <Col xs={4} className='d-flex align-items-center text-left'>
                                    <span className='d-flex flex-column'>
                                        <span className='active-text'>
                                            {
                                                priceFormat(100000)
                                            }
                                        </span>
                                        <span className='active-text-description'>
                                            {
                                                t('common.active')
                                            }
                                        </span>
                                        <span className='inactive-text'>
                                            {
                                                priceFormat(totalStudents - 10)
                                            }
                                        </span>
                                        <span className='active-text-description'>
                                            {
                                                t('foodManagement.otherStudents')
                                            }
                                        </span>
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                        <Col className='bg-white text-center'>
                            {
                                foodLastTenDaysInfo && foodLastTenDaysInfo.length > 0
                                    ?
                                    <Row className='py-3'>
                                        <Col>
                                            <Line height={90} options={lineOptions} data={foodLineData} />
                                        </Col>
                                    </Row>
                                    :
                                    t('system.noData')
                            }
                        </Col>
                    </>
                }
                {
                    (tabKey == 'LXP') &&
                    <>
                        <Col xs={12} className='font-pinnacle-demibold fs-15 color-info mb-3'>
                            {t('dashboard.generalInformation')}
                        </Col>
                        <Col sm={4} className='bg-white me-3 text-center'>
                            <Row className='py-3'>
                                <Col xs={6}>
                                    <Doughnut height={50} options={pieChartOptions} data={generalPieData} />
                                </Col>
                                <Col xs={4} className='d-flex align-items-center text-left'>
                                    <span className='d-flex flex-column'>
                                        <span className='active-text'>
                                            {
                                                priceFormat(100000)
                                            }
                                        </span>
                                        <span className='active-text-description'>
                                            {
                                                t('common.active')
                                            }
                                        </span>
                                        <span className='inactive-text'>
                                            {
                                                priceFormat(totalStudents - 100)
                                            }
                                        </span>
                                        <span className='active-text-description'>
                                            {
                                                t('foodManagement.otherStudents')
                                            }
                                        </span>
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                        <Col className='bg-white text-center'>
                            {
                                foodLastTenDaysInfo && foodLastTenDaysInfo.length > 0
                                    ?
                                    <Row className='py-3'>
                                        <Col>
                                            <Line height={90} options={lineOptions} data={foodLineData} />
                                        </Col>
                                    </Row>
                                    :
                                    t('system.noData')
                            }
                        </Col>
                    </>
                }
            </Row >
        </>
    );
};

export default index;