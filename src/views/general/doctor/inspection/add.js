import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import showMessage from "modules/message";
import { fetchRequest } from 'utils/fetchRequest';
import {
    doctorInspectionClassInit,
    doctorInspectionStudentInit,
    doctorInspectionStudentSearchName,
    doctorInspectionStudentSearchCode,
    doctorInspectionUserSearchName
} from 'utils/fetchRequest/Urls';
import Select from 'modules/Form/Select';
import DatePicker from "modules/Form/DatePicker";
import 'css/addInvoice.css';

const addInspection = ({
    show,
    setShow,
    onSubmit,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { selectedSchool } = useSelector(state => state.schoolData);
    const [classId, setClassId] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [isStudent, setIsStudent] = useState(true);

    const [studentCode, setStudentCode] = useState('');
    const [studentName, setStudentName] = useState('');
    const [inspectionDate, setInspectionDate] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [pain, setPain] = useState('');
    const [treatment, setTreatment] = useState('');
    const [medicine, setMedicine] = useState('');

    const [studentOptions, setStudentOptions] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    const [studentNameOptions, setStudentNameOptions] = useState([]);
    const [medicineOptions, setMedicineOptions] = useState([]);

    const [studentIdErrorMsg, setStudentIdErrorMsg] = useState(false);
    const [studentNameErrorMessage, setStudentNameErrorMessage] = useState(false);
    const [studentCodeErrorMsg, setStudentCodeErrorMsg] = useState(false);

    const [inspectionDateErrorMsg, setInspectionDateErrorMsg] = useState(false);
    const [diagnosisErrorMsg, setDiagnosisErrorMsg] = useState(false);
    const [painErrorMsg, setPainErrorMsg] = useState(false);
    const [treatmentErrorMsg, setTreatmentErrorMsg] = useState(false);

    const [staffId, setStaffId] = useState(null);
    const [staffCode, setStaffCode] = useState('');
    const [staffName, setStaffName] = useState('');
    const [staffNameOptions, setStaffNameOptions] = useState([]);

    const [staffIdErrorMessage, setStaffIdErrorMessage] = useState(false);
    const [staffNameErrorMessage, setStaffNameErrorMessage] = useState(false);
    const [staffCodeErrorMsg, setStaffCodeErrorMsg] = useState(false);

    const onSaveClick = () => {
        let errorCount = 0;
        if (isStudent) {
            if (studentId == null || studentId.length == 0) {
                setStudentIdErrorMsg(true);
                errorCount++
            } else {
                setStudentIdErrorMsg(false);
            }
        } else if (!isStudent) {
            if (staffId == null || staffId.length == 0) {
                setStaffIdErrorMessage(true);
                errorCount++
            } else {
                setStaffIdErrorMessage(false);
            }
        }
        if (inspectionDate != null && inspectionDate != '' && inspectionDate != 0) {
            setInspectionDateErrorMsg(false);
        } else {
            errorCount++
            setInspectionDateErrorMsg(true);
        }
        if (diagnosis != null && diagnosis != '' && diagnosis != 0) {
            setDiagnosisErrorMsg(false);
        } else {
            errorCount++
            setDiagnosisErrorMsg(true);
        }
        if (pain != null && pain != '' && pain != 0) {
            setPainErrorMsg(false);
        } else {
            errorCount++
            setPainErrorMsg(true);
        }
        if (treatment != null && treatment != '' && treatment != 0) {
            setTreatmentErrorMsg(false);
        } else {
            errorCount++
            setTreatmentErrorMsg(true);
        }
        if (errorCount == 0) {
            let postData = null;
            if (isStudent) {
                const chosenStudent = studentNameOptions?.find(e => e.value == studentId)?.data
                postData = {
                    student: studentId,
                    inspectionDate,
                    diagnosis,
                    pain,
                    treatment,
                    medicine,
                    code: chosenStudent?.code,
                    firstName: chosenStudent?.firstName,
                    lastName: chosenStudent?.lastName,
                }
            } else {
                const chosenStaff = staffNameOptions?.find(e => e.value == staffId)?.data
                postData = {
                    user: staffId,
                    inspectionDate,
                    diagnosis,
                    pain,
                    treatment,
                    medicine,
                    code: chosenStaff?.code,
                    firstName: chosenStaff?.firstName,
                    lastName: chosenStaff?.lastName,
                }
            }
            onSubmit(postData)
        }
    };

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

    const handleStudentIdChange = (e) => {
        const re = /[А-Яа-яЁёӨөҮү№₮]/;
        let value = '';
        if (!re.test(e.target.value)) {
            value = e.target.value.toUpperCase();
            setStudentCode(value);
        }
    };

    const handleStaffIdChange = (e) => {
        const re = /[А-Яа-яЁёӨөҮү№₮]/;
        let value = '';
        if (!re.test(e.target.value)) {
            value = e.target.value.toUpperCase();
            setStaffCode(value);
        }
    };

    const handlerSearchStudentWithCode = () => {
        dispatch(setLoading(true));
        fetchRequest(doctorInspectionStudentSearchCode, 'POST', { school: selectedSchool?.id, code: studentCode })
            .then(res => {
                const { student = null, message = '', success = false } = res
                if (success && student) {
                    fetchRequest(doctorInspectionStudentInit, 'POST', { school: selectedSchool?.id, selectedClassId: student?.classId })
                        .then(resp => {
                            const { students = [] } = resp

                            const studentOption = [];
                            students.map((param) =>
                                studentOption.push({
                                    value: param?.id,
                                    text: param?.firstName + ' - ' + param?.lastName + " (" + param?.code + ")",
                                    student: param
                                })
                            )
                            setStudentOptions(studentOption)
                        })
                        .catch(() => {
                            showMessage(t('errorMessage.title'))
                        });
                    setClassId(student?.classId || null)
                    setStudentName(student.firstName || null)
                    setStudentNameOptions([{
                        value: student.id,
                        text: student?.firstName + ' - ' + student?.lastName + " (" + student?.code + ")",
                        data: student
                    }])
                    setStudentId(student.id || null)
                } else {
                    setClassId(null)
                    setStudentName('')
                    setStudentNameOptions([])
                    setStudentId(null)
                    setStudentNameErrorMessage(false)
                    setStudentCodeErrorMsg(true)
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    const handleSearchStaffWithCode = () => {

        setStaffCodeErrorMsg(false)
        dispatch(setLoading(true));
        fetchRequest(doctorInspectionUserSearchName, 'POST', { school: selectedSchool?.id, code: staffCode })
            .then(res => {
                const { users = [], message = '', success = false } = res
                if (success) {
                    console.log('Users', users)
                    if (users && users.length > 0) {
                        if (users.length === 1) {
                            setStaffId(users[0]?.value)
                        }
                        setStaffNameOptions(users)
                    } else {
                        setStaffId(null)
                        setStaffCodeErrorMsg(true)
                    }
                } else {
                    setStaffCode('')
                    setStaffId(null)
                    setStaffCodeErrorMsg(true)
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    useEffect(() => {
        if (studentId == '' || classId == null) {
            setStudentCode('')
            setStudentName('')
            setClassId(null)
            setStudentNameOptions([])
            setStudentId(null)
            setStudentNameErrorMessage(false)
            setStudentCodeErrorMsg(false)
        }
    }, [studentId, classId])

    const handleDateChange = (value) => {
        setInspectionDate(value);
    }

    const handleStudentNameChange = (e) => {
        setStudentName(e.target.value)
    };

    const handleStudentNameDropdownChange = (value) => {
        if (value == null) {
            setClassId(null);
            setStudentCode('');
            setStudentName('');
            setStudentNameOptions([]);
        } else {
            const selectedStudent = studentNameOptions?.find(p => p.value == value)?.data
            if (selectedStudent?.classId != classId) {
                dispatch(setLoading(true));
                fetchRequest(doctorInspectionStudentInit, 'POST', { school: selectedSchool?.id, selectedClassId: selectedStudent?.classId })
                    .then(resp => {
                        const { students = [] } = resp

                        const studentOption = [];
                        students.map((param) =>
                            studentOption.push({
                                value: param.id,
                                text: param.firstName + " - " + param.lastName + " (" + param?.code + ")",
                                student: param
                            })
                        )
                        setStudentId(value);
                        setClassId(selectedStudent?.classId);
                        setStudentCode(selectedStudent?.code);
                        setStudentName(selectedStudent?.firstName);
                        setStudentOptions(studentOption)
                    })
                    .catch(() => {
                        showMessage(t('errorMessage.title'))
                    });
                dispatch(setLoading(false));
            } else {
                setStudentId(value);
                setClassId(selectedStudent?.classId);
                setStudentCode(selectedStudent?.code);
                setStudentName(selectedStudent?.firstName);
            }
        }
    };

    const handleStaffNameChange = (e) => {
        setStaffName(e.target.value)
    };

    const handleStaffNameDropdownChange = (value) => {
        if (value == null) {
            setStaffId(null);
            setStaffName('')
            setStaffNameOptions([]);
        } else {
            setStaffId(value)
        }
    };

    const handlerSearchStudentWithName = () => {
        dispatch(setLoading(true));
        fetchRequest(doctorInspectionStudentSearchName, 'POST', { school: selectedSchool?.id, query: studentName })
            .then(res => {
                const { list = [], message = '', success = false } = res
                if (success) {
                    if (list && list.length == 0) {
                        setClassId(null)
                        setStudentCode('')
                        setStudentId(null)
                        setStudentNameErrorMessage(true)
                    } else {
                        const studentNameOption = []
                        list.map((param) => (
                            studentNameOption.push({
                                value: param.id,
                                text: param.firstName + " - " + param.lastName + " (" + param?.code + ")",
                                data: param
                            })
                        ))
                        fetchRequest(doctorInspectionStudentInit, 'POST', { school: selectedSchool?.id, selectedClassId: list[0]?.classId })
                            .then(resp => {
                                const { students = [] } = resp

                                const studentOption = [];
                                students.map((param) =>
                                    studentOption.push({
                                        value: param.id,
                                        text: param.firstName + " - " + param.lastName + " (" + param?.code + ")",
                                        student: param
                                    })
                                )
                                setStudentOptions(studentOption)
                            })
                            .catch(() => {
                                showMessage(t('errorMessage.title'))
                            });
                        setClassId(list[0]?.classId || null)
                        setStudentCode(list[0]?.code || null)
                        setStudentId(list[0]?.id || null)
                        setStudentNameOptions(studentNameOption)
                        setStudentNameErrorMessage(false)
                    }
                } else {
                    setClassId(null)
                    setStudentCode('')
                    setStudentId(null)
                    setStudentCodeErrorMsg(false)
                    setStudentNameErrorMessage(true)
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    const handleClassDropdownChange = (value) => {
        setClassId(value);
        setStudentCode('');
        setStudentName('')
        setStudentIdErrorMsg(false);
        setStudentCodeErrorMsg(false);
        setStudentNameErrorMessage(false);
        dispatch(setLoading(true));
        fetchRequest(doctorInspectionStudentInit, 'POST', { school: selectedSchool?.id, selectedClassId: value })
            .then(res => {
                const { students = [] } = res

                const studentOption = [];
                students.map((param) =>
                    studentOption.push({
                        value: param.id,
                        text: param.firstName + ' - ' + param?.lastName + " (" + param?.code + ")",
                        student: param
                    })
                )
                setStudentOptions(studentOption)
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    const handleStudentDropdownChange = (value) => {
        if (value == null) {
            setStudentCode('');
            setStudentId('');
            setStudentName('');
            setStudentNameOptions([]);
        } else {
            dispatch(setLoading(true));
            // fetchRequest('url', 'POST', { school: selectedSchool?.id, student: value })
            //     .then(resp => {
            //     })
            //     .catch(() => {
            //         showMessage(t('errorMessage.title'))
            //     });
            studentOptions?.map((param) => {
                if (param?.value == value) {
                    setStudentCode(param?.student?.code)
                    setStudentName(param?.student?.firstName)
                    setStudentNameOptions([{ value: param?.student?.id, text: param?.student?.firstName + ' - ' + param?.student?.lastName + " (" + param?.student?.code + ")", data: param }])
                }
                return ''
            })
            setStudentId(value);
            dispatch(setLoading(false));
        }
    };

    const handlerSearchStaffWithName = () => {
        dispatch(setLoading(true));
        setStaffNameErrorMessage(false)
        fetchRequest(doctorInspectionUserSearchName, 'POST', { school: selectedSchool?.id, name: staffName })
            .then(res => {
                const { users = [], message = '', success = false } = res
                if (success) {
                    if (users && users.length > 0) {
                        if (users.length === 1) {
                            setStaffId(users[0]?.value)
                        }
                        setStaffNameOptions(users)
                    } else {
                        setStaffId(null)
                        setStaffNameErrorMessage(true)
                    }
                    // if (list && list.length == 0) {
                    //     setStaffCode('')
                    //     setStaffId(null)
                    //     setStaffNameErrorMessage(true)
                    // } else {
                    //     const staffNameOption = []
                    //     list.map((param) => (
                    //         staffNameOption.push({
                    //             value: param.id,
                    //             text: param.firstName + " - " + param.lastName + " (" + param?.code + ")",
                    //             data: param
                    //         })
                    //     ))
                    //     setStaffCode(list[0]?.code || null)
                    //     setStaffId(list[0]?.id || null)
                    //     setStaffNameOptions(staffNameOption)
                    //     setStaffNameErrorMessage(false)
                    //     setStaffCodeErrorMsg(false)
                    // }
                } else {
                    setStaffCode('')
                    setStaffId(null)
                    setStaffNameErrorMessage(true)
                    showMessage(message || t('errorMessage.title'))
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    };

    useEffect(() => {
        dispatch(setLoading(true));
        const postData = { school: selectedSchool?.id }
        fetchRequest(doctorInspectionClassInit, 'POST', postData)
            .then(response => {
                const { classes = [], medicines = [], today = '' } = response.data
                const classOption = classes?.map(e => {
                    const returnVal = {
                        value: e.id,
                        text: e.class,
                    };
                    return returnVal;
                });
                const medicineOption = medicines?.map(e => {
                    const returnVal = {
                        value: e.id,
                        text: e.name,
                    };
                    return returnVal;
                })
                setInspectionDate(today)
                setClassOptions(classOption)
                setMedicineOptions(medicineOption)
                dispatch(setLoading(false));
            })
            .catch(() => {
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'))
            });
    }, []);

    const renderStudent = () => {
        return (
            <>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('dashboard.studentCode')}
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
                                <Form.Control
                                    className={studentCodeErrorMsg ? 'is-invalid form-control' : 'form-control'}
                                    type='text'
                                    onInput={(e) => handleStudentIdChange(e)}
                                    placeholder={t('dashboard.studentCode')}
                                    value={studentCode}
                                />
                                {
                                    studentCodeErrorMsg ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.studentCodeNotFound')}
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                            <Col>
                                <Button
                                    variant="outline-alternate"
                                    className='btn-outline-with-icon-36 p-1 search-btn-custom-color'
                                    onClick={handlerSearchStudentWithCode}
                                >
                                    <SearchOutlined />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('dashboard.studentFirstname')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
                                {
                                    studentNameOptions && studentNameOptions.length > 1
                                        ?
                                        <Select
                                            value={studentId}
                                            searchable="true"
                                            options={studentNameOptions}
                                            placeholder={t('dashboard.studentFirstname')}
                                            className={studentNameErrorMessage ? 'is-invalid' : null}
                                            onChange={handleStudentNameDropdownChange}
                                        />
                                        :
                                        <Form.Control
                                            value={studentName}
                                            placeholder={t('dashboard.studentFirstname')}
                                            className={studentNameErrorMessage ? 'is-invalid' : null}
                                            onChange={handleStudentNameChange}
                                        />
                                }
                                {
                                    studentNameErrorMessage ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.studentNameNotFound')}
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                            <Col>
                                <Button
                                    variant="outline-alternate"
                                    className='btn-outline-with-icon-36 p-1 search-btn-custom-color'
                                    onClick={handlerSearchStudentWithName}
                                >
                                    <SearchOutlined />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('common.className')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'>
                                        <Select
                                            value={classId}
                                            searchable="true"
                                            options={classOptions}
                                            placeholder={t('common.chooseClass')}
                                            className={studentIdErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={handleClassDropdownChange}
                                        />
                                    </th>
                                    <th className='width-equal'>
                                        <Select
                                            value={studentId}
                                            searchable="true"
                                            options={studentOptions}
                                            placeholder={t('common.chooseStudent')}
                                            className={studentIdErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={handleStudentDropdownChange}
                                        />
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex'>
                    <label className='modal-label'></label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'></th>
                                    <th className='width-equal'>
                                        {
                                            studentIdErrorMsg ?
                                                <div className='invalid-feedback d-block'>
                                                    {t('errorMessage.chooseStudent')}
                                                </div>
                                                :
                                                null
                                        }
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('doctorsCorner.inspectionDate')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
                                <DatePicker
                                    className={inspectionDateErrorMsg ? 'fs-14 is-invalid form-control' : 'form-control fs-14'}
                                    placeholderText={t('doctorsCorner.inspectionDate')}
                                    isCustomButton={false}
                                    value={inspectionDate}
                                    onChange={(date) => handleDateChange(date)}
                                />
                                {
                                    inspectionDateErrorMsg ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.enterInspectionDate')}
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('doctorsCorner.diagnosis')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
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
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label label-flex-start'>
                        {t('doctorsCorner.pain')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='8' className='pe-2'>
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
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label label-flex-start'>
                        {t('doctorsCorner.treatment')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='8' className='pe-2'>
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
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label label-flex-start'>
                        {t('doctorsCorner.givenMedicine')}
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='8' className='pe-2'>
                                <Select
                                    value={medicine}
                                    searchable="true"
                                    options={medicineOptions}
                                    placeholder={t('doctorsCorner.givenMedicine')}
                                    className='fs-14'
                                    multiple
                                    onChange={handleMedicineDropdownChange}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
            </>
        )
    }

    const renderStaff = () => {
        return (
            <>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('doctorsCorner.staffCode')}
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
                                <Form.Control
                                    className={staffCodeErrorMsg ? 'is-invalid form-control' : 'form-control'}
                                    type='text'
                                    onInput={(e) => handleStaffIdChange(e)}
                                    placeholder={t('doctorsCorner.staffCode')}
                                    value={staffCode}
                                />
                                {
                                    staffCodeErrorMsg ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.userCodeNotFound')}
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                            <Col>
                                <Button
                                    variant="outline-alternate"
                                    className='btn-outline-with-icon-36 p-1 search-btn-custom-color'
                                    onClick={handleSearchStaffWithCode}
                                >
                                    <SearchOutlined />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('common.name')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
                                {
                                    staffNameOptions && staffNameOptions.length > 0
                                        ?
                                        <Select
                                            value={staffId}
                                            searchable="true"
                                            clearable={true}
                                            options={staffNameOptions}
                                            placeholder={t('errorMessage.enterName')}
                                            className={staffNameErrorMessage || staffIdErrorMessage ? 'is-invalid' : null}
                                            onChange={handleStaffNameDropdownChange}
                                        />
                                        :
                                        <Form.Control
                                            value={staffName}
                                            placeholder={t('errorMessage.enterName')}
                                            className={staffNameErrorMessage || staffIdErrorMessage ? 'is-invalid' : null}
                                            onChange={handleStaffNameChange}
                                        />
                                }
                                {
                                    staffNameErrorMessage ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.userFirstNameNotFound')}
                                        </div>
                                        :
                                        null
                                }
                                {
                                    staffIdErrorMessage ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.enterUser')}
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                            <Col>
                                <Button
                                    variant="outline-alternate"
                                    className='btn-outline-with-icon-36 p-1 search-btn-custom-color'
                                    onClick={handlerSearchStaffWithName}
                                >
                                    <SearchOutlined />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('doctorsCorner.inspectionDate')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
                                <DatePicker
                                    className={inspectionDateErrorMsg ? 'fs-14 is-invalid form-control' : 'form-control fs-14'}
                                    placeholderText={t('doctorsCorner.inspectionDate')}
                                    isCustomButton={false}
                                    value={inspectionDate}
                                    onChange={(date) => handleDateChange(date)}
                                />
                                {
                                    inspectionDateErrorMsg ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.enterInspectionDate')}
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
                        {t('doctorsCorner.diagnosis')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='6' className='pe-2'>
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
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label label-flex-start'>
                        {t('doctorsCorner.pain')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='8' className='pe-2'>
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
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label label-flex-start'>
                        {t('doctorsCorner.treatment')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='8' className='pe-2'>
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
                    </div>
                    <div className='modal-end'></div>
                </div>
                <div className='d-flex mt-08'>
                    <label className='modal-label label-flex-start'>
                        {t('doctorsCorner.givenMedicine')}
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col md='8' className='pe-2'>
                                <Select
                                    value={medicine}
                                    searchable="true"
                                    options={medicineOptions}
                                    placeholder={t('doctorsCorner.givenMedicine')}
                                    className='fs-14'
                                    multiple
                                    onChange={handleMedicineDropdownChange}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>
            </>
        )
    }

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
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <ListGroup horizontal>
                            <ListGroup.Item
                                className={isStudent ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsStudent(true)}
                            >
                                {t('student.title')}
                            </ListGroup.Item>
                            <ListGroup.Item
                                className={!isStudent ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsStudent(false)}
                            >
                                {t('menu.teacherStaff')}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                {
                    isStudent
                        ?
                        renderStudent()
                        :
                        renderStaff()
                }
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

export default addInspection;