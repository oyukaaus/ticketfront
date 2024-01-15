import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import 'css/addInvoice.css';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketEdit, ticketInfo, ticketMenu, ticketSubMenu } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import Select from 'modules/Form/Select';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const editTicket = ({
    selectedData,
    show,
    setShow,
    systemList
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const fileInputRef = useRef(null);
    const { schools } = useSelector((state) => state.schoolData);
    const schoolData = [];
    schools.map((param) =>
        schoolData.push({
            value: param?.id,
            text: param?.name,
        })
    )
    const [isIssue, setIsIssue] = useState(true);
    const selectedOne = selectedData[0];
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [description, setDescription] = useState(selectedOne?.description);
    const [example, setExample] = useState(selectedOne?.example);
    const [menuList, setMenuList] = useState([]);
    const [subMenus, setSubMenus] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [existedData, setExistedData] = useState([]);
    const [systemErrorMsg, setSystemErrorMsg] = useState(false);
    const [menuErrorMsg, setMenuErrorMsg] = useState(false);
    const [subMenuErrorMsg, setSubMenuErrorMsg] = useState(false);
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState(false);
    const [schoolErrorMsg, setSchoolErrorMsg] = useState(false);
    const [imageError, setImageError] = useState({});

    const fetchMenu = async (item) => {
        fetchRequest(ticketMenu, 'POST', {
            systemId: item
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setMenuList(res?.menus);
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
            })
            .catch((e) => {
                console.log('e', e)
                showMessage(t('errorMessage.title'));
            });
    };

    const fetchSubMenu = async (item, item2) => {
        fetchRequest(ticketSubMenu, 'POST', {
            systemId: item,
            menuId: item2
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setSubMenus(res?.subMenus);
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
            })
            .catch((e) => {
                console.log('e', e)
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

    const onChangeSchool = (e) => {
        setSelectedSchool(e);
        setSchoolErrorMsg(false);
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

    const onChangeDescription = (e) => {
        setDescription(e.target.value);
        setDescriptionErrorMsg(false)
    }

    const onChangeExample = (e) => {
        setExample(e.target.value);
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
                            fileName: image.name
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

    console.log('fileData: ', fileData)
    const onFileUploadButtonHandler = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageRemoval = (item) => {
        if (Array.isArray(fileData)) {
            const updatedFileData = fileData.filter((file1) => file1.fileName !== item.name);
            setFileData(updatedFileData);
        } else {
            console.error('fileData is not an array');
        }
    };

    const handleExistedImageRemoval = (item) => {
        console.log('item: ', item)
        if (Array.isArray(existedData)) {
            const updatedFileData = existedData.filter((file1) => file1.id !== item.id);
            setExistedData(updatedFileData);
        } else {
            console.error('fileData is not an array');
        }
    };

    const onSaveClick = () => {
        let hasError = false;
        if (isIssue) {
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
        } else {
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
                ticketId: selectedOne.id,
                systemId: selectedSystem,
                menuId: selectedMenu,
                subMenuId: selectedSubMenu,
                // title: 'Title',
                description: description,
                typeId: isIssue ? 1 : 2,
                statusId: 1,
                example: example,
                schoolId: selectedSchool
            };
            if (fileData) {
                console.log('fileData: ', fileData)
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
            if (existedData) {
                const rawFile = [];
                existedData.forEach(item3 => {
                    rawFile.push(
                        item3.id

                    )
                })
                postData.existedFile = rawFile;
            }

            console.log('postDatas: ', postData);
            fetchRequest(ticketEdit, 'POST', postData)
                .then((res) => {
                    console.log('response: ', res)
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
        // }
    };

    const loadInfo = () => {
        dispatch(setLoading(true));
        fetchRequest(ticketInfo, 'POST', {
            ticketId: selectedOne?.id,
        }).then((res) => {
            if (res?.success) {
                console.log('es: ', res)
                fetchMenu(selectedOne?.systemId);
                fetchSubMenu(selectedOne?.systemId, selectedOne?.menuId);
                setIsIssue(res?.ticket[0].type === "Алдаа" ? true : false);
                setSelectedSystem(res?.ticket[0].systemId);
                setSelectedMenu(res?.ticket[0].menuId);
                setSelectedSubMenu(res?.ticket[0].subMenuId);
                setSelectedSchool(res?.ticket[0].schoolId);
                setExistedData(res?.ticket[0].files);
            } else {
                showMessage(res?.message || t('errorMessage.title'));
            }
            dispatch(setLoading(false));
        }).catch(() => {
            dispatch(setLoading(false));
            showMessage(t('errorMessage.title'));
        })
    }

    useEffect(() => {
        loadInfo()
    }, []);


    const renderIssue = () => {
        return (
            <>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
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
                    <label className='modal-label'>
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
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end' }} >
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
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end' }} >
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
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end' }} >
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
                    <label className='modal-label'>
                        {t('ticket.example')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col className='pe-2'>
                                <Form.Control
                                    type='text'
                                    onInput={(e) => onChangeExample(e)}
                                    placeholder={t('ticket.example')}
                                    value={example}
                                />
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
            </>
        )
    }

    const openImageInNewWindow = (path) => {
        window.open(path, '_blank');
    };

    const renderIdea = () => {
        return (
            <>
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
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
                    <label className='modal-label'>
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
                    <label className='modal-label'>
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



    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
                    {t('ticket.ticketEdit')}
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
                <div className='d-flex'>
                    <label className='modal-label' style={{ textOverflow: 'ellipsis', textAlign: 'end', color: '#575962' }} >
                        {t('ticket.attachment')}*
                    </label>
                    <div className='modal-content-container'>
                        <table className='w-100'>
                            <thead>
                                <tr style={{ display: 'flex' }}>
                                    {existedData && existedData.map((item) => (
                                        <div key={item.id} className="d-flex align-items-start" style={{ marginLeft: 10 }}>
                                            <div className="text-center">
                                                {item.type === 'image/png' ? (
                                                    <div style={{ display: 'flex', marginTop: '0.8rem', justifyContent: 'flex-start' }} >
                                                        <img
                                                            style={{ marginLeft: 10 }}
                                                            src={item.path}
                                                            alt={`Image ${item.name}`}
                                                            width="100"
                                                            height="100"
                                                            onClick={() => openImageInNewWindow(item.path)}
                                                        />
                                                        <img
                                                            src='../img/ticket/icon/delete.png'
                                                            alt='delete-icon'
                                                            className='color-info me-1'
                                                            onClick={() => handleExistedImageRemoval(item)}
                                                            style={{ width: '20px', height: '20px', position: 'absolute', cursor: 'pointer', transform: 'translate(90px, -10px' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <p>{item.name}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {fileData && Array.isArray(fileData) && fileData.map((fileD, index) => (
                                        <th key={index}>
                                            <div style={{ display: 'flex', marginTop: '0.8rem', justifyContent: 'flex-start' }} >
                                                <img
                                                    style={{ marginLeft: 10 }}
                                                    src={URL.createObjectURL(fileD.file)}
                                                    width="100"
                                                    height="100"
                                                    alt='empty'
                                                />
                                                <img
                                                    src='../img/ticket/icon/delete.png'
                                                    alt='delete-icon'
                                                    className='color-info me-1'
                                                    onClick={() => handleImageRemoval(fileD.file)}

                                                    style={{ width: '20px', height: '20px', position: 'absolute', cursor: 'pointer', transform: 'translate(90px, -10px' }}
                                                />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    <th className='width-equal pe-2  d-flex align-items-center text-right'>
                                        <div style={{ display: 'flex', marginTop: '0.8rem' }}>
                                            <input
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                type='file'
                                                // multiple={true}
                                                placeholder='test'
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
                {/* <Forms ref={formRefRequest} fields={requestFields}  fileData={existingImage} /> */}
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

export default editTicket;