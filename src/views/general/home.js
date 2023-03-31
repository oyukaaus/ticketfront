import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { systemMain } from 'utils/fetchRequest/Urls';
import { fetchRequest } from 'utils/fetchRequest';
import 'css/dashboard.css';

const home = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { selectedSchool } = useSelector(state => state.schoolData);

    const [schoolInfo, setSchoolInfo] = useState(null);

    const breadcrumbs = [
        { to: '/', text: t('menu.home') }
    ];

    const loadData = () => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool?.id
        }
        fetchRequest(systemMain, 'POST', postData)
            .then(res => {
                dispatch(setLoading(false));
                if (!res?.success) {
                    showMessage(res?.message || t('errorMessage.title'));
                }

                setSchoolInfo(res?.school)
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }

    useEffect(() => {
        if (selectedSchool?.id) {
            loadData()
        }        
    }, []);

    return (
        <>
            <Row>
                <Col lg={12} className="mb-3">
                    <h2 className='font-standard mb-0'>
                        {t('menu.home')}
                    </h2>
                    <BreadcrumbList
                        basePath='/'
                        key={1}
                        items={breadcrumbs}
                    />
                </Col>
            </Row>
            <Row>
                {
                    selectedSchool?.id
                        ? <Card className='no-border-radius mt-2'>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <h4 className='text-center'>{t('home.totalStudent')}</h4>
                                        <h2 className='text-center header-title'>{schoolInfo?.studentCount || '-'}</h2>
                                    </Col>
                                    <Col>
                                        <h4 className='text-center'>{t('home.totalTeacher')}</h4>
                                        <h2 className='text-center header-title'>{schoolInfo?.teacherCount || '-'}</h2>
                                    </Col>
                                    <Col>
                                        <h4 className='text-center'>{t('home.totalStaff')}</h4>
                                        <h2 className='text-center header-title'>{schoolInfo?.staffCount || '-'}</h2>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        :
                        <Col>
                            <h3>{t('errorMessage.selectSchool')}</h3>
                        </Col>
                }
            </Row>
        </>
    );
};

export default home;