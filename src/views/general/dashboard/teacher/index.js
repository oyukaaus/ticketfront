
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import { Chart as ChartJS, ArcElement, Tooltip, Legend,  Title, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Select from '../../../../modules/Form/Select';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const tempStyle = { color: 'rgba(88,103,221,255)'}
const tempStyle2 = { color: 'rgba(178,179,178,255)'}

const index = () => {

    const { t } = useTranslation();
    const selectedSchoolNames = []
    const labelMale = (t('common.male')).toUpperCase()
    const labelFemale = (t('common.female')).toUpperCase()
    const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
    const [dataTeacher, setDataTeacher] = useState(0);
    const [dataWorker, setDataWorker] = useState(0);
    const [dataMale, setDataMale] = useState(0);
    const [dataFemale, setDataFemale] = useState(0);

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

/*pie*/
    const pieDataGender = [dataMale,dataFemale]
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
                        family: 'Mulish',
                        weight: '300',
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
    const pieDataSchool = {
        labels: pieLabels,
        datasets: [
            {
            label: "common.teacher",
            data: [11, 30],
            backgroundColor: [
                'rgba(62,191,163,255)',
                'rgba(244,81,107,255)'
            ],
                borderWidth: 0,
            },
        ],
    }

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
        setDataWorker(selectedSchoolIds.length * 30);
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
                                className='la-old la-file-excel-o m-0 p-0'
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
                                        <Col className='text-info mt-2 font-weight-bold d-flex ms-09 fs-16' md={2}>{dataTeacher}</Col>
                                        <Col className='font-weight-bold mt-2 d-flex fs-16' style={tempStyle} md={2}>{dataWorker}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='font-weight-bold text-uppercase d-flex ms-09 fs-12' md={2} style={tempStyle2}>{t('common.teacher')}</Col>
                                        <Col className='font-weight-bold text-uppercase d-flex fs-12' md={2} style={tempStyle2}>{t('common.worker')}</Col>
                                    </Row>
                                </Col>
                                <Col className='font-weight-800 fs-14 text-info mt-2 mb-2 text-uppercase'>
                                    <br/>
                                    {t('common.teacher')}
                                </Col>
                                <Col className='font-weight-800 fs-14 mt-2 mb-2 color-blue text-uppercase' style={tempStyle}>
                                    <br/>
                                    {t('common.worker')}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <span className='mt-5 mb-5'>
                                        <Pie options={pieOptions} data={pieData} height="400%"/>
                                    </span>
                                </Col>
                                <Col>
                                    <span className='mt-5 mb-5'>
                                        <Pie options={pieOptions} data={pieData} height="400%"/>
                                    </span>
                                </Col>
                                <Col>
                                    <span className='mt-5 mb-5'>
                                        <Pie options={pieOptions} data={pieData} height="400%"/>
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
            <Col lg={12} className='mb-3'>
                <h2 className='fs-18 mb-0'>
                    {t('managementDashboard.teacher')}
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
                {selectedSchoolIds.map((value, iteration) => (
                    <Col xs={6} className='text-info justify-content-between align-items-center mt-2' key={value}>
                        <div className='fs-15 ms-12 ps-2 mb-3 font-pinnacle-bold'>
                            {schoolFind(value)}
                            {
                                selectedSchoolNames[iteration]
                            }
                        </div>
                        <Col xs={12}>
                            <Card className='mb-3 no-border-radius'>
                                <Card.Body>
                                    <Col className='text-info mt-2 mb-2'>
                                        <Row>
                                            <Col className='fs-16 font-weight-bold text-info mt-2 d-flex ms-12' md={1}>{pieDataSchool.datasets[0].data[0]}</Col>
                                            <Col className='fs-16 font-weight-bold mt-2 d-flex' style={tempStyle} md={2}>{pieDataSchool.datasets[0].data[1]}</Col>
                                        </Row>
                                        <Row>
                                            <Col className='fs-12 font-weight-bold text-uppercase d-flex ms-12' md={1} style={tempStyle2}>{t('common.teacher')}</Col>
                                            <Col className='fs-12 font-weight-bold text-uppercase d-flex' md={2} style={tempStyle2}>{t('common.worker')}</Col>
                                        </Row>
                                            <span>
                                            <Pie options={pieOptions} data={pieDataSchool} height="400%"/>
                                        </span>
                                    </Col>
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