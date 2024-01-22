import React, { useRef, useState } from 'react';
import { Modal, Button, Row, Col, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setLoading } from 'utils/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketCreate, ticketMenu, ticketSubMenu } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import Select from 'modules/Form/Select';

const createTicketModal = ({
    show,
    setShow,
    systemList
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const fileInputRef = useRef(null);
    const { person } = useSelector((state) => state.auth);
    console.log('person: ', person)
    const { schools } = useSelector((state) => state.schoolData);
    const schoolData = [];
    console.log('school: ', schools)
    schools.map((param) =>
        schoolData.push({
            value: param?.id,
            text: param?.name,
            userTitle: param?.userTitle
        })
    )

    const [isIssue, setIsIssue] = useState(true);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [schoolName, setSchoolName] = useState(schoolData.length === 1 ? schoolData[0].text : null);
    const [selectedSchool, setSelectedSchool] = useState(schoolData.length === 1 ? schoolData[0].value : null);
    const [userTitle, setUserTitle] = useState(schoolData.length === 1 ? schoolData[0].userTitle : null);
    const [description, setDescription] = useState('');
    const [example, setExample] = useState('');
    const [menuList, setMenuList] = useState([]);
    const [subMenus, setSubMenus] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [systemErrorMsg, setSystemErrorMsg] = useState(false);
    const [menuErrorMsg, setMenuErrorMsg] = useState(false);
    const [subMenuErrorMsg, setSubMenuErrorMsg] = useState(false);
    const [schoolErrorMsg, setSchoolErrorMsg] = useState(false);
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState(false);
    const [exampleErrorMsg, setExampleErrorMsg] = useState(false);
    const [imageError, setImageError] = useState({});

    const fetchMenu = async (item) => {
        fetchRequest(ticketMenu, 'POST', {
            systemId: item
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setMenuList([...res?.menus]);
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                console.log(e);
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    const fetchSubMenu = async (item) => {
        fetchRequest(ticketSubMenu, 'POST', {
            systemId: selectedSystem,
            menuId: item
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setSubMenus(res?.subMenus);
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                console.log(e);
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    const onSystemChange = (e) => {
        setSelectedSystem(e);
        setSystemErrorMsg(false)
        if (isIssue) {
            fetchMenu(e);
        }

    }
    const onChangeMenu = (e) => {
        setSelectedMenu(e);
        setMenuErrorMsg(false);
        fetchSubMenu(e);

    }
    const onChangeSubMenu = (e) => {
        setSelectedSubMenu(e);
        setSubMenuErrorMsg(false);
    }

    const onChangeSchool = (e) => {
        setSelectedSchool(e);
        const school = schoolData.filter((file1) => file1.value === selectedSchool);
        setSchoolName(school.text || '');
        setUserTitle(school.userTitle  || '');
        setSchoolErrorMsg(false);
    }
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
        setDescriptionErrorMsg(false)
    }

    const onChangeExample = (e) => {
        setExample(e.target.value);
        setExampleErrorMsg(false)
    }

    const verifyFile = (files) => {
        const acceptedType = [
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
        ];
        const acceptedSize = 52428800;

        if (files && files.length > 0) {
            let isFalse = true;
            for (let i = 0; i < files.length; i++) {
                const imageSize = files[i].size;
                const imageType = files[i].type;
                if (imageSize > acceptedSize) {
                    setImageError({ status: true, text: t('newsfeed.fileSizeWarning') })
                    isFalse = false;
                }

                if (!acceptedType.includes(imageType)) {
                    setImageError({ status: true, text: t('newsfeed.imageTypeError') });
                    isFalse = false;
                }
            }
            return isFalse;
        }
        return undefined
    };

    const onFileInputChange = (e) => {
        const files = e.target.files;
        const verified = verifyFile(files);

        if (verified) {
            const [image] = !files ? [] : files;
            const updatedFileData = [...fileData];
            if (image) {
                const reader = new FileReader();
                reader.addEventListener(
                    'load',
                    () => {
                        const fileObject = {
                            content: reader.result,
                            file: image,
                            fileName: image.name,
                            lastModified: image.lastModified
                        };
                        updatedFileData.push(fileObject);
                        setFileData(updatedFileData);
                    },
                    false
                );
                reader.readAsDataURL(image);
            }
        }
    };
    const onFileUploadButtonHandler = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageRemoval = (item, index) => {
        const updatedFileData = [...fileData];
        if (Array.isArray(fileData)) {
            updatedFileData.splice(index, 1);
            setFileData(updatedFileData);
            if (item.onChange) {
                item.onChange(null, null, 'clear');
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } else {
            console.error('fileData is not an array');
        }
    };

    const onSaveClick = () => {
        let hasError = false;
        if (isIssue) {
            if (selectedSchool === null) {
                setSchoolErrorMsg(true);
                hasError = true;
            }
            if (selectedSystem === null) {
                setSystemErrorMsg(true);
                hasError = true;
            }
            if (selectedMenu === null) {
                setMenuErrorMsg(true);
                hasError = true;
            }
            if (selectedSubMenu === null) {
                setSubMenuErrorMsg(true);
                hasError = true;
            }
            if (description === '') {
                setDescriptionErrorMsg(true);
                hasError = true;
            }
            if (example === '') {
                setExampleErrorMsg(true);
                hasError = true;
            }
            // if (fileData.length === 0) {
            //     setImageError(true);
            //     hasError = true;
            // }
        } else {
            if (selectedSchool === null) {
                setSchoolErrorMsg(true);
                hasError = true;
            }
            if (selectedSystem === null) {
                setSystemErrorMsg(true);
                hasError = true;
            }
            if (description === '') {
                setDescriptionErrorMsg(true);
                hasError = true;
            }
        }
        if (!hasError) {

            const postData = {
                systemId: selectedSystem,
                menuId: selectedMenu,
                submenuId: selectedSubMenu,
                title: 'Title',
                description: description,
                typeId: isIssue ? 1 : 2,
                statusId: 1,
                example: example,
                userData: person,
                createdBy: person.id,
                schoolId: selectedSchool,
                schoolName: schoolName,
                userTitle: userTitle
            };

            if (fileData) {
                const rawFile = [];
                fileData.forEach(item2 => {
                    rawFile.push({
                        name: item2.file.name,
                        type: item2.file.type,
                        size: item2.file.size,
                        path: '/',
                        content: item2.content,
                    })
                })
                postData.file = rawFile;
            }
            console.log('postData: ', postData);
            dispatch(setLoading(true));
            fetchRequest(ticketCreate, 'POST', postData)
                .then((res) => {
                    const { success = false, message = null } = res;
                    if (success) {
                        history.replace(`/ticket/index`);
                        window.location.reload();
                        showMessage(message, true);
                    } else {
                        console.log('res: ', res);
                        showMessage(message || t('errorMessage.title'));
                    }
                    dispatch(setLoading(false));
                })
                .catch((e) => {
                    console.log('e', e)
                    dispatch(setLoading(false));
                    showMessage(t('errorMessage.title'));
                });
        }

    };

    const renderIssue = () => {
        return (
            <>
                <div className='d-flex mt-08'>
                    <label className='modal-label' style={{ color: '#575962' }}>
                        {t('ticket.school')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'>
                                        <Select
                                            value={selectedSchool}
                                            searchable="true"
                                            options={schoolData}
                                            placeholder={t('ticket.school')}
                                            required
                                            className={schoolErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={onChangeSchool}
                                        />
                                        {
                                            schoolErrorMsg ?
                                                <div className='invalid-feedback d-block'>
                                                    {t('errorMessage.schoolErrorMsg')}
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
                    <label className='modal-label' style={{ color: '#575962' }}>
                        {t('ticket.system')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'>
                                        <Select
                                            value={selectedSystem}
                                            searchable="true"
                                            options={systemList}
                                            placeholder={t('ticket.system')}
                                            required
                                            className={systemErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={onSystemChange}
                                        />   {
                                            systemErrorMsg ?
                                                <div className='invalid-feedback d-block'>
                                                    {t('errorMessage.systemErrorMsg')}
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
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end', color: '#575962' }} >
                        {t('ticket.menu')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'>
                                        <Select
                                            value={selectedMenu}
                                            searchable="true"
                                            options={menuList}
                                            placeholder={t('ticket.menu')}
                                            required
                                            className={menuErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={onChangeMenu}
                                        />
                                        {
                                            menuErrorMsg ?
                                                <div className='invalid-feedback d-block'>
                                                    {t('errorMessage.menuErrorMsg')}
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
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end', color: '#575962' }} >
                        {t('ticket.subMenu')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'>
                                        <Select
                                            value={selectedSubMenu}
                                            searchable="true"
                                            options={subMenus}
                                            required
                                            placeholder={t('ticket.subMenu')}
                                            className={subMenuErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={onChangeSubMenu}
                                        />
                                        {
                                            subMenuErrorMsg ?
                                                <div className='invalid-feedback d-block'>
                                                    {t('errorMessage.subMenuErrorMsg')}
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
                <div className='d-flex flex-wrap mt-08'>
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end', color: '#575962' }} >
                        {t('ticket.issue')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col className='pe-2'>
                                <Form.Control
                                    className={descriptionErrorMsg && 'is-invalid form-control'}
                                    as="textarea" rows="3"
                                    onChange={onChangeDescription}
                                    placeholder={t('ticket.issue')}
                                    value={description}
                                    required
                                />
                                {
                                    descriptionErrorMsg ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.descriptionErrorMsg')}
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
                    <label className='modal-label' style={{ color: '#575962' }}>
                        {t('ticket.example')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col className='pe-2'>
                                <Form.Control
                                    className={exampleErrorMsg && 'is-invalid form-control'}
                                    type='text'
                                    onInput={(e) => onChangeExample(e)}
                                    placeholder={t('ticket.example')}
                                    value={example}
                                    required
                                />
                                {
                                    exampleErrorMsg ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.exampleErrorMsg')}
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
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col className='pe-2' style={{ color: '#000000', fontSize: 14, fontFamily: 'Mulish' }}>
                                Жишээ болгож алдаа гарч байгаа хэрэглэгчийн мэдээллийг оруулна уу.
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>

                <span></span>
            </>
        )
    }

    const renderIdea = () => {
        return (
            <>
                <div className='d-flex mt-08'>
                    <label className='modal-label' color={{ color: '#575962' }}>
                        {t('ticket.school')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'>
                                        <Select
                                            value={selectedSchool}
                                            searchable="true"
                                            options={schoolData}
                                            placeholder={t('ticket.school')}
                                            required
                                            className={schoolErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={onChangeSchool}
                                        />
                                        {
                                            schoolErrorMsg ?
                                                <div className='invalid-feedback d-block'>
                                                    {t('errorMessage.schoolErrorMsg')}
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
                    <label className='modal-label' color={{ color: '#575962' }}>
                        {t('ticket.system')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr>
                                    <th className='width-equal pe-2'>
                                        <Select
                                            value={selectedSystem}
                                            searchable="true"
                                            options={systemList}
                                            placeholder={t('ticket.system')}
                                            required
                                            className={systemErrorMsg ? 'fs-14 is-invalid' : 'fs-14'}
                                            onChange={onSystemChange}
                                        />   {
                                            systemErrorMsg ?
                                                <div className='invalid-feedback d-block'>
                                                    {t('errorMessage.systemErrorMsg')}
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
                    <label className='modal-label' color={{ color: '#575962' }}>
                        {t('ticket.idea')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col className='pe-2'>
                                <Form.Control
                                    className={descriptionErrorMsg && 'is-invalid form-control'}
                                    as="textarea" rows="3"
                                    onChange={onChangeDescription}
                                    placeholder={t('ticket.idea')}
                                    value={description}
                                    required
                                />
                                {
                                    descriptionErrorMsg ?
                                        <div className='invalid-feedback d-block'>
                                            {t('errorMessage.descriptionErrorMsg')}
                                        </div>
                                        :
                                        null
                                }
                            </Col>
                        </Row>
                    </div>
                    <div className='modal-end'></div>
                </div>

            </>
        )
    }

    console.log('fileData: ', fileData)
    return (
        <Modal
            // key={formKey}
            centered
            show={show}
            onHide={() => setShow(false)}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {t('common.requestSend')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <ListGroup horizontal>
                            <ListGroup.Item
                                className={isIssue ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsIssue(true)}
                            >
                                {t('ticket.error')}
                            </ListGroup.Item>
                            <ListGroup.Item
                                className={!isIssue ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsIssue(false)}
                            >
                                {t('ticket.ticket')}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                {
                    isIssue
                        ?
                        renderIssue()
                        :
                        renderIdea()
                }
                <div className='d-flex mt-08'>
                    <label className='modal-label' style={{ textOverflow: 'ellipsis', textAlign: 'end', color: '#575962' }} >
                        {t('ticket.attachment')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr style={{ display: 'flex' }}>
                                    {fileData && Array.isArray(fileData) && fileData.map((fileD, index) => (
                                        <th key={index}>
                                            <div style={{ display: 'flex', marginTop: '0.8rem', justifyContent: 'flex-start' }} >
                                                <img
                                                    style={{ marginLeft: 10, alignItems: 'left' }}
                                                    src={URL.createObjectURL(fileD.file)}
                                                    width="100"
                                                    height="100"
                                                    alt='empty'
                                                />
                                                <img
                                                    src='../img/ticket/icon/delete.png'
                                                    alt='delete-icon'
                                                    className='color-info me-1'
                                                    onClick={() => handleImageRemoval(fileD.file, index)}
                                                    style={{ width: '20px', height: '20px', position: 'absolute', cursor: 'pointer', transform: 'translate(90px, -10px' }}
                                                />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    <th className='width-equal pe-2  align-content-center align-items-center  text-right'>
                                        <div style={{ display: 'flex' }} >
                                            <input
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                type='file'
                                                onChange={(e) => onFileInputChange(e)}
                                            />
                                            <Button
                                                className="btn btn-outline-warning mr-5"
                                                type='button'
                                                onClick={() => onFileUploadButtonHandler()}
                                            >
                                                Зураг оруулах
                                            </Button>
                                        </div>
                                    </th>
                                    {
                                        imageError && imageError.status === true ?
                                            <div className='invalid-feedback d-block'>
                                                {imageError.text}
                                            </div>
                                            :
                                            null
                                    }
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className='modal-end'></div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button
                    onClick={() => setShow(false)}
                    size='sm'
                    variant="link"
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    variant="success"
                    className='text-uppercase fs-12 br-8 ps-4 pe-4'
                    size='sm'
                    style={{ backgroundColor: '#5DD75C', color: "#000000", opacity: 1 }}
                    onClick={onSaveClick}
                >
                    {t('common.send')}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default createTicketModal;