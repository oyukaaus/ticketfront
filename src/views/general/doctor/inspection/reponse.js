import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import {
    doctorInspectionInit
} from 'utils/fetchRequest/Urls';
import Select from 'modules/Form/Select';
import 'css/addInvoice.css';
import "react-image-crop/dist/ReactCrop.css";

const addTicket = ({
    show,
    setShow,
    onSubmit,
    newRequest
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [medicine, setMedicine] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [pain, setPain] = useState('');
    const [treatment, setTreatment] = useState('');
    const [medicineOptions, setMedicineOptions] = useState([]);

    const [medicineErrorMsg,] = useState(false); //setMedicineErrorMsg
    const [diagnosisErrorMsg, setDiagnosisErrorMsg] = useState(false);
    const [treatmentErrorMsg, setTreatmentErrorMsg] = useState(false);
    const [painErrorMsg, setPainErrorMsg] = useState(false);

    useEffect(() => {
        dispatch(setLoading(true));
        const postData = {
            school: selectedSchool.id
        }
        fetchRequest(doctorInspectionInit, 'POST', postData)
            .then(res => {
                const { success = false, message = null, list = [] } = res
                if (success) {
                    const formatedData = []
                    if (list && list.length > 0) {
                        list.map((med) => formatedData?.push({ value: med.id, text: med.name }))
                    }
                    setMedicineOptions(formatedData)
                } else {
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }, [])



    const handleDiagnosisChange = (e) => {
        setDiagnosis(e.target.value);
    };

    const handleInputPainChange = (e) => {
        setPain(e.target.value)
    };

    const handleInputTreatmentChange = (e) => {
        setTreatment(e.target.value)
    };

    const handleMedicineDropdownChange = (value) => {
        setMedicine(value)
    }

    const onSaveClick = () => {
        let errorCount = 0;
        if (diagnosis == null || diagnosis == '') {
            setDiagnosisErrorMsg(true)
            errorCount++
        } else {
            setDiagnosisErrorMsg(false)
        }
        if (pain == null || pain == '') {
            setPainErrorMsg(true)
            errorCount++
        } else {
            setPainErrorMsg(false)
        }
        if (treatment == null || treatment == '') {
            setTreatmentErrorMsg(true)
            errorCount++
        } else {
            setTreatmentErrorMsg(false)
        }
        if (errorCount == 0) {
            const postData = {
                diagnosis,
                pain,
                treatment,
                medicine,
                appointment: newRequest.id,
                user: newRequest.userId,
                student: newRequest.studentId,
            }
            onSubmit(postData)
        }
    };

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
                    {t('doctorsCorner.registerInspection')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Row className='gx-0 mx-3'>
                    <Col md={6}>
                        <div className='ps-3 p-2 br-8 border-custom-orange h-100'>
                            <Row>
                                <Col xs={2} className='d-flex align-items-center justify-content-center'>
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
                            </Row>
                            <Row className='absolute-black mt-2'>
                                <Col>
                                    {newRequest?.content}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='h-100 ms-2 ps-3 p-2 br-8 border-custom-orange'>
                            <Row>
                                <Col xs={1}></Col>
                                <Col xs={3} className='p-0 d-flex align-items-center justify-content-end font-pinnacle-demibold fs-12'>
                                    {t('doctorsCorner.diagnosis')}*
                                </Col>
                                <Col xs={7}>
                                    <Form.Control
                                        className={diagnosisErrorMsg && 'is-invalid form-control'}
                                        type='text'
                                        onInput={(e) => handleDiagnosisChange(e)}
                                        placeholder={t('doctorsCorner.diagnosis')}
                                        value={diagnosis}
                                    />
                                    {
                                        diagnosisErrorMsg ?
                                            <div className='invalid-feedback d-block'>
                                                {t('errorMessage.enterDiagnosis')}
                                            </div>
                                            :
                                            null
                                    }
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={1}></Col>
                                <Col xs={3} className='p-0 d-flex align-items-center justify-content-end font-pinnacle-demibold fs-12'>
                                    {t('doctorsCorner.pain')}*
                                </Col>
                                <Col xs={7}>
                                    <textarea
                                        className={painErrorMsg ? 'is-invalid form-control' : 'form-control'}
                                        type='text'
                                        placeholder={t('doctorsCorner.pain')}
                                        onChange={(e) => { handleInputPainChange(e) }}
                                        value={pain}
                                    />
                                    {
                                        painErrorMsg ?
                                            <div className='invalid-feedback d-block'>
                                                {t('errorMessage.enterPain')}
                                            </div>
                                            :
                                            null
                                    }
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={1}></Col>
                                <Col xs={3} className='p-0 d-flex align-items-center justify-content-end font-pinnacle-demibold fs-12'>
                                    {t('doctorsCorner.treatment')}*
                                </Col>
                                <Col xs={7}>
                                    <textarea
                                        className={treatmentErrorMsg ? 'is-invalid form-control' : 'form-control'}
                                        type='text'
                                        placeholder={t('doctorsCorner.treatment')}
                                        onChange={(e) => { handleInputTreatmentChange(e) }}
                                        value={treatment}
                                    />
                                    {
                                        treatmentErrorMsg ?
                                            <div className='invalid-feedback d-block'>
                                                {t('errorMessage.enterTreatment')}
                                            </div>
                                            :
                                            null
                                    }
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={1}></Col>
                                <Col xs={3} className='p-0 d-flex align-items-center justify-content-end font-pinnacle-demibold fs-12'>
                                    {t('doctorsCorner.givenMedicine')}
                                </Col>
                                <Col xs={7}>
                                    <Select
                                        value={medicine}
                                        searchable="true"
                                        multiple
                                        options={medicineOptions}
                                        placeholder={t('doctorsCorner.givenMedicine')}
                                        className={medicineErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                        onChange={handleMedicineDropdownChange}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button
                    onClick={() => setShow(false)}
                    size='sm'
                    variant="link"
                >
                    {t('common.back')}
                </Button>
                <Button
                    variant="success"
                    className='text-uppercase fs-12 br-8 ps-4 pe-4'
                    size='sm'
                    onClick={onSaveClick}
                >
                    {t('common.save')}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default addTicket;