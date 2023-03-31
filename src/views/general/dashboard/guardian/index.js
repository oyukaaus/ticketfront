
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import { Chart as ChartJS, ArcElement, Tooltip, Legend,  Title, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Select from '../../../../modules/Form/Select';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const tempStyle = { color: 'rgba(88,103,221,255)'}
const tempStyle2 = { color: 'rgba(178,179,178,255)'}
const tempStyle3= { color: 'rgba(2,117,216,255)'}

const index = () => {

    const { t } = useTranslation();
    const selectedSchoolNames = []
    const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
    const [dataTeacher, setDataTeacher] = useState(0);
    const [dataFather, setDataFather] = useState(0);
    const [dataMother, setDataMother] = useState(0);
    const [dataGuardian, setDataGuardian] = useState (0);
    const [guardianPercentage, setGuardianPercentage] = useState(0)
    const labelFather = (t('managementDashboard.parentMale').toUpperCase())
    const labelMother = (t('managementDashboard.parentFemale').toUpperCase())
    const labelGuardian = (t('managementDashboard.guardian').toUpperCase())

    const breadcrumbs = [
        { to: '', text: t('menu.home') },
        { to: 'dashboard/teacher', text: t('managementDashboard.teacher') },
    ];

    const schoolOptions = [
        {value : '13', text: 'Orchlon'},
        {value : 222, text: 'Selbe'},
        {value : 'testplace', text: 'School 1'},
        {value : 432, text: 'International school of Canada'},
        {value : 'temporary', text: 'School 115'},
        {value : 612, text: 'School 6'}
    ]

//pie

    const pieDataRelation=[dataFather,dataMother,dataGuardian]
    const pieLabels = [labelFather,labelMother,labelGuardian]
    const pieOptions = {
        backgroundColor: 'white',
        backgroundShadowColor: 'black',
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 40,
                bottom: 2,
            },
        },
        maintainAspectRatio: false,
        plugins:{
        shadow: {
            enabled: true,
            color: 'rgba(0, 0, 0, 1)',
            blur: 20,
            offsetY: 5,
            offsetX: 5
            },
            backgroundColor: 'white',
            legend:{
                position: 'bottom',
                labels:{
                    font: {
                        size: 12,
                        weight: '300',
                        family: 'Mulish',
                    },
                    boxHeight: 20,
                    boxWidth: 20,
                    padding: 30
                }
            },
        }
    }
    const pieData = {
        labels: pieLabels,
        datasets: [
            {
                label: "common.teacher",
                data: pieDataRelation,
                backgroundColor: [
                'rgba(62,191,163,255)',
                'rgba(244,81,107,255)',
                'rgba(88,103,221,255)'
                ],
                borderWidth: 0,
            },
        ],
    };
    
//bar

    const barLabels = [t('common.primary'), t('common.secondary'), t('common.highSchool')];
    const barOptions = {
        maintainAspectRatio: false,
        indexAxis: 'y',
        responsive: true,
        barThickness: 38,
        scales: {
            xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  gridLines: {
                    lineWidth: 2, // set the thickness of the x axis lines
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  gridLines: {
                    lineWidth: 5, // set the thickness of the y axis lines
                  },
                },
              ],
            x: {
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            },
            y: {
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 15,
                        weight: '700',
                        family: 'Mulish',
                        color: '#575962',
                    }
                }
            },
        },
        plugins: {
            legend:{
                position: 'bottom',
                labels: {
                    font: {
                        size: 12,
                        weight: '300',
                        family: 'Mulish',
                        color: '#575962',
                    },
                    boxHeight: 20,
                    boxWidth: 20,
                    padding: 30
                    }
                },
        },
    };
    const barData = {
        labels: barLabels,
        datasets: [
            {
                label: labelFather,
                data: [200, 300, 500, 600],
                backgroundColor: 'rgba(62,191,163,255)',
            },
            {
                label: labelMother,
                data: [21, 533, 692, 929],
                backgroundColor: 'rgba(244,81,107,255)',
            },
            {
                label: labelGuardian,
                data: [21, 533, 692, 929],
                backgroundColor: 'rgba(88,103,221,255)',
            },
        ],
    };

    const schoolFind = (value) =>{
        for (let i=0; i<schoolOptions.length;i++)
        {
            if (schoolOptions[i].value==value)
            {
                selectedSchoolNames.push(schoolOptions[i].text);
            }
        }
    }

    useEffect(() => {
        setDataTeacher(selectedSchoolIds.length * 11);
        setDataFather(selectedSchoolIds.length * 82);
        setDataMother(selectedSchoolIds.length * 40);
        setDataGuardian(selectedSchoolIds.length*29);
    }, [selectedSchoolIds]);

    useEffect(() => {
        setGuardianPercentage((dataGuardian/(dataGuardian + dataMother + dataFather)*100).toFixed(1))
    }, [dataGuardian])
    
    const handleDropdownChange = (value) => {
        setSelectedSchoolIds(value)
    }

    const handleReset = () => {
        setSelectedSchoolIds([])
    }

    const handleSelectAll = () => {
        const ids = [];
        for (let i = 0; i < schoolOptions.length; i++)
        {
            ids.push(schoolOptions[i].value)
        }
        setSelectedSchoolIds(ids)
    }

    const checkIfSelected = () => {
        if (selectedSchoolIds.length > 0)
        {
            return (
                <Col>
                    <Col sm={12} className='d-flex justify-content-between align-items-center mt-3 mb-2'>
                        <div className='ms-12 fs-15 font-pinnacle-bold text-uppercase text-info '>
                            {t('common.total')}
                        </div>
                        <Button
                            style={{
                            backgroundColor: '#ff5b1d',
                            boxShadow: '0 2px 10px 0 #ff5b1d',
                            border: 'none',
                            width: '33px',
                            height: '33px',
                            alignItems: 'center',
                            borderRadius: '3px',
                        }}
                            className='m-btn m-btn--icon m-btn--icon-only p-1 mx-2'
                        >
                            <i
                                className="la-old la-file-excel-o m-0 p-0"
                                style={{
                                fontSize: '22px',
                                color: '#ffffff',
                                }}
                            />
                        </Button>
                    </Col>
                    {console.log(dataGuardian)}
                    {console.log(dataMother)}
                    {
                        console.log(dataFather)
                    }
                    <Card className = 'mb-2 no-border-radius d-flex'>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col className='text-info mt-2 font-weight-bold d-flex ms-09 fs-16' md={2}>{dataTeacher}</Col>
                                        <Col className='font-weight-bold mt-2 d-flex fs-16' style={tempStyle3} md={4}>{dataGuardian + ' | ' + guardianPercentage + '%'}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='font-weight-bold text-uppercase d-flex ms-09 fs-12' md={2} style={tempStyle2}>{t('common.student')}</Col>
                                        <Col className='font-weight-bold text-uppercase d-flex fs-12' md={5} style={tempStyle2}>{t('managementDashboard.guardian')}</Col>
                                    </Row>
                                </Col>
                                <Col>
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={5}>
                                    <span className = 'mt-5'>
                                        <Pie options={pieOptions} data={pieData} height="400%"/>
                                    </span>
                                </Col>
                                <Col className='font-pinnacle-demibold fs-16 text-info mt-5'>
                                    <span className='fs-18 font-weight-bold'>
                                        <br/>
                                        <Bar options={barOptions} data={barData} height="340%" />
                                    </span>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            )
        }
        else{
            return null
        }
    }
    return (
        <>
            <Col lg={12} className="mb-3">
                <h2 className='fs-18 mb-0'>
                    {t('managementDashboard.guardian')}
                </h2>
                <BreadcrumbList
                    basePath='/'
                    items={breadcrumbs}
                />
            </Col>
            <Col lg={12}>
                <Card className='mb-3 no-border-radius'>
                    <Card.Body>
                        <Select
                            multiple
                            clearable={false}
                            options={schoolOptions}
                            value={selectedSchoolIds}
                            onChange={(value) => handleDropdownChange(value)}
                        />
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={12} className='mb-3'>
                <Button
                    className='m-0 font-weight-bold'
                    onClick={() => handleReset()}
                    size='sm'
                    variant="link"
                >
                    {t('common.clearAll')}
                </Button>
                <Button
                    className='m-0 font-weight-bold align-items-center text-uppercase'
                    onClick={() => handleSelectAll()}
                    size='sm'
                    variant="outline-info"
                >
                    {t('common.selectAll')}
                </Button>
            </Col>
            {checkIfSelected()}
            <Row>
                {selectedSchoolIds.map((value, mapindex) => (
                    <Col xs={12} key={value}>
                        <Col sm={12} className='d-flex justify-content-between align-items-center mb-2'>
                            <div className='ms-12 fs-15 font-pinnacle-bold text-info '>
                                {schoolFind(value)}
                                {
                                    selectedSchoolNames[mapindex]
                                }
                            </div>
                            <Button
                                style={{
                                backgroundColor: '#ff5b1d',
                                boxShadow: '0 2px 10px 0 #ff5b1d',
                                border: 'none',
                                width: '33px',
                                height: '33px',
                                alignItems: 'center',
                                borderRadius: '3px',
                            }}
                                className='m-btn m-btn--icon m-btn--icon-only p-1 mx-2'
                            >
                                <i
                                    className="la-old la-file-excel-o m-0 p-0"
                                    style={{
                                    fontSize: '22px',
                                    color: '#ffffff',
                                    }}
                                />
                            </Button>
                        </Col>
                        <Col>
                            <Card className='mb-3 no-border-radius'>
                                <Card.Body>
                                    <Row>
                                        <Col xs={5}>
                                            <span className='mt-5 mb-5'>
                                                <Pie options={pieOptions} data={pieData} height="400%"/>
                                            </span>
                                        </Col>
                                        <Col className='mt-5 mb-4'>
                                            <span>
                                                <br/>
                                                <Bar options={barOptions} data={barData} height="340%" />
                                            </span>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Col>
                ))}
            </Row>
        </>
    );
};
export default index;