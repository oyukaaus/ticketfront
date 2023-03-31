
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import { Chart as ChartJS, ArcElement, Tooltip, Legend,  Title, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Select from '../../../../modules/Form/Select';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const tempStyle2 = { color: 'rgba(178,179,178,255)'}

const index = () => {

    const { t } = useTranslation();
    const selectedSchoolNames = []
    const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
    const [dataStudent, setDataStudent] = useState(0);
    const [dataMale, setDataMale] = useState(0);
    const [dataFemale, setDataFemale] = useState(0);
    const labelMale = (t('common.male').toUpperCase())
    const labelFemale = (t('common.female').toUpperCase())

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

    const pieDataGender=[dataMale,dataFemale]
    const pieLabels = [labelMale, labelFemale]
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
                        color: '#575962',
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
                data: pieDataGender,
                backgroundColor: [
                'rgba(62,191,163,255)',
                'rgba(244,81,107,255)'
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
            x: {
                width: 3,
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
                label: labelMale,
                data: [200, 300, 500, 600],
                backgroundColor: 'rgba(62,191,163,255)',
            },
            {
                label: labelFemale,
                data: [21, 533, 692, 929],
                backgroundColor: 'rgba(244,81,107,255)',
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
        setDataStudent(selectedSchoolIds.length * 11);
        setDataMale(selectedSchoolIds.length * 82);
        setDataFemale(selectedSchoolIds.length * 40);
    }, [selectedSchoolIds]);
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
            return(
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
                    <Card className='mb-2 no-border-radius d-flex'>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col className='text-info mt-2 font-weight-bold d-flex ms-09 fs-16' md={2}>{dataStudent}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='font-weight-bold text-uppercase d-flex ms-09 fs-12' md={2} style={tempStyle2}>{t('common.student')}</Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={5}>
                                    <span className='mt-5'>
                                        <Pie options={pieOptions} data={pieData} height="400%"/>
                                    </span>
                                </Col>
                                <Col className='mt-5'>
                                    <span>
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
                    {t('managementDashboard.students')}
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
                    <Col xs={12} className='text-info justify-content-between align-items-center mt-2' key={value}>
                        <div className='fs-15 ms-12 ps-2 mb-3 font-pinnacle-bold'>
                            {schoolFind(value)}
                            {
                                selectedSchoolNames[mapindex]
                            }
                        </div>
                        <Col>
                            <Card className='mb-3 no-border-radius'>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Row>
                                                <Col className='text-info mt-2 font-weight-bold d-flex ms-09 fs-16' md={2}>{dataStudent}</Col>
                                            </Row>
                                            <Row>
                                                <Col className='font-weight-bold text-uppercase d-flex ms-09 fs-12' md={2} style={tempStyle2}>{t('common.student')}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
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