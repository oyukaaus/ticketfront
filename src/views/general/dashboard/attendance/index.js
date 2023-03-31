
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import { Chart as ChartJS, ArcElement, Tooltip, Legend,  Title, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import DatePicker from "modules/Form/DatePicker";
import Select from '../../../../modules/Form/Select';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const lateColor = { color: 'rgba(105,110,146,255)'}
const nonAttendanceColor = { color: 'rgba(224,32,32,255)'}
const sickColor = {color: 'rgba(64,55,215,255)'}
const absentColor = {color: 'rgba(255,47,25,255)'}
const noReportColor = {color: 'rgba(255,47,25,255)'}

const index = () => {
    const { t } = useTranslation();
    const lateNumber = 20
    const nonAttendanceNumber = 20
    const sickNumber = 20
    const absentNumber = 20
    const noReportNumber = 20
    const selectedSchoolNames = []
    const studentHour = t('common.student') + '|' + t('common.time')
    const student = t('common.time')
    const [selectedDate, setSelectedDate] = useState('');
    const [lateNumberTotal, setLateNumberTotal] = useState(0)
    const [nonAttendanceNumberTotal, setNonAttendanceNumberTotal] = useState(0)
    const [sickNumberTotal, setSickNumberTotal] = useState(0)
    const [absentNumberTotal, setAbsentNumberTotal] = useState(0)
    const [noReportNumberTotal, setNoReportNumberTotal] = useState(0)
    const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
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
    const data = {
    datasets: [
            {
            label: 'Poll',
            data: [90, 10],
            backgroundColor: ['rgba(62,191,163,255)', 'transparent'],
            borderWidth: 0,
            cutout: '70%',
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        tooltips: {
            enabled: false,
        },
        layout:{
            padding: 0
        },
        plugins: {
            legend:{
                position: 'bottom',
                title:{
                    display: true,
                    text: t('attendance.came'),
                    padding:{
                        top:5,
                    },
                    color: 'rgba(62,191,163,255)',
                    font:{
                        size:20,
                        family: 'Pinnacle-Bold',
                    }
                }
            },
        },
        rotation: 110,
    };

    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart){
            const {ctx} = chart;
            ctx.save();
            ctx.font = 'bolder 20px Pinnacle-Bold'
            ctx.fillStyle= 'rgba(62,191,163,255)'
            ctx.textBaseLine= 'middle'
            ctx.textAlign='center'
            ctx.fillText(data.datasets[0].data[0] + '%', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y)
        },
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
    const handleDateChange = (value) => {
        setSelectedDate(value);
    }
    useEffect(() => {
        setNoReportNumberTotal(20*selectedSchoolIds.length)
        setLateNumberTotal(20*selectedSchoolIds.length)
        setAbsentNumberTotal(20*selectedSchoolIds.length)
        setSickNumberTotal(20*selectedSchoolIds.length)
        setNonAttendanceNumberTotal(20*selectedSchoolIds.length)
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
    function attendanceCard(attendanceStatus, attendanceNumber, attendanceMisc, statusColor) {
        return (
            <Col className='ms-2' style={{ border: '1px solid rgba(255,238,232,255)', flex: 1.1, width: '200px', borderRadius: '10px'}}>
                <Row  className='font-pinnacle-bold mb-3 mt-3 ms-2 text-info fs-16 mr-1 d-flex' style={{maxHeight: '20px', wordWrap: 'break-word'}}>
                    {attendanceStatus}
                </Row>
                <Row  className='font-pinnacle-bold fs-35 mb-0 justify-content-end me-md-1' style={statusColor}>
                    {attendanceNumber}
                </Row>
                <Row  className='fs-16 justify-content-end font-weight-500 me-md-1' style={{maxHeight: '20px'}}>
                    {attendanceMisc}
                </Row>
            </Col>
        );
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
                    <Card className = 'mb-2 no-border-radius d-flex'>
                        <Card.Body>
                            <Row className = 'me-md-2'>
                                <Col>
                                    <Doughnut data={data} options={options} height = '160px' plugins ={[textCenter]} />
                                </Col>
                                {attendanceCard(t('attendance.late'), lateNumberTotal, studentHour, lateColor)}
                                {attendanceCard(t('attendance.nonAttendance'), nonAttendanceNumberTotal, studentHour, nonAttendanceColor)}
                                {attendanceCard(t('attendance.sick'), sickNumberTotal, studentHour, sickColor)}
                                {attendanceCard(t('attendance.absent'), absentNumberTotal, studentHour, absentColor)}
                                {attendanceCard(t('attendance.noReport'), noReportNumberTotal, student, noReportColor)}
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
                    {t('managementDashboard.attendance')}
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
            <Col lg={12} className = 'mb-3'>
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
            <Row  className='font-pinnacle-bold fs-25 mt-6 justify-content-end d-flex' xs='auto'>
                <Col>
                <label className = 'fs-15'>
                    {t('common.date')}
                </label>
                </Col>
                <Col >
                <DatePicker
                    placeholderText={t('Default-Today')}
                    isCustomButton={false}
                    value={selectedDate}
                    onChange={(date) => handleDateChange(date)}
                />
                </Col>
            </Row>
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
                            <Card className = 'mb-2 no-border-radius d-flex'>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Doughnut data={data} options={options} height = '160px' plugins ={[textCenter, options.plugins]}/>
                                        </Col>
                                        {attendanceCard(t('attendance.late'), lateNumber, studentHour, lateColor)}
                                        {attendanceCard(t('attendance.nonAttendance'), nonAttendanceNumber, studentHour, nonAttendanceColor)}
                                        {attendanceCard(t('attendance.sick'), sickNumber, studentHour, sickColor)}
                                        {attendanceCard(t('attendance.absent'), absentNumber, studentHour, absentColor)}
                                        {attendanceCard(t('attendance.noReport'), noReportNumber, student, noReportColor)}
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