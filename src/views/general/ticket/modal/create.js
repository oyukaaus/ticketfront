import React, { useRef, useState } from 'react';
import { Modal, Button, Row, Col, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import CollectionsIcon from '@mui/icons-material/Collections';
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
    const formRefRequest = useRef();
    const { person } = useSelector((state) => state.auth);
    const { schools } = useSelector((state) => state.schoolData);
    const schoolData = [];
    schools.map((param) =>
        schoolData.push({
            value: param?.id,
            text: param?.name,
        })
    )
    const [isIssue, setIsIssue] = useState(true);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [description, setDescription] = useState('');
    const [example, setExample] = useState('');
    const [menuList, setMenuList] = useState([]);
    const [subMenus, setSubMenus] = useState([]);
    const [file, setFile] = React.useState();
    const [fileData, setFileData] = useState([]);
    const [systemErrorMsg, setSystemErrorMsg] = useState(false);
    const [menuErrorMsg, setMenuErrorMsg] = useState(false);
    const [subMenuErrorMsg, setSubMenuErrorMsg] = useState(false);
    const [schoolErrorMsg, setSchoolErrorMsg] = useState(false);
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState(false);

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
        setSchoolErrorMsg(false);
    }
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
        setDescriptionErrorMsg(false)
    }

    const onChangeExample = (e) => {
        setExample(e.target.value);
    }

    const requestFields = [
        {
            key: 'image',
            label: 'Файл хавсаргах',
            value: '',
            type: 'fileUpload',
            required: false,
            fileName: '',
            multiple: true,
            isExtendedButton: true,
            isExtendedButtonText: (
                <>
                    <CollectionsIcon /> {t('survey.selectImage')}
                </>
            ),
            isExtendedButtonClass: 'btn btn-outline-warning mr-5',
            altImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
            altImageClass: 'd-none',
            accept: 'image/*',
            fileType: 'image',
            clearButton: true,
            isClearButtonText: (
                <>
                    <CollectionsIcon style={{ opacity: 0, width: 0 }} /> {t('foodManagement.deletePhoto')}
                </>
            ),
            isClearButtonClass: 'btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28',
            onChange: (files) => {
                const [image] = !files ? [] : files;
                if (image) {
                    const reader = new FileReader();
                    reader.addEventListener(
                        'load',
                        () => {
                            setFile(reader.result);
                        },
                        false
                    );
                    reader.readAsDataURL(image);
                    setFileData(image);
                    console.log('image: ', image);
                }
            },
        },
    ];

    const onSaveClick = () => {
        const [isValid] = formRefRequest.current.validate();
        if (isValid) {
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
                    schoolId: selectedSchool
                };
                if (fileData && fileData.name) {
                    postData.file = {
                        name: fileData.name,
                        type: fileData.type,
                        size: fileData.size,
                        path: '/',
                        content: file,
                    };
                }
                console.log('postData: ', postData);
                fetchRequest(ticketCreate, 'POST', postData)
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
        }
    };

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
                    <label className='modal-label'>
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
                    <label className='modal-label'>
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
                <div className='d-flex mt-08'>
                    <label className='modal-label'>
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
            </>
        )
    }


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
            // key={formKey}
            centered
            show={show}
            onHide={() => setShow(false)}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
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
                <Forms ref={formRefRequest} fields={requestFields} />
                {/* {
                    isIssue
                        ?

                        <div>
                             <Select
                                            value={selectedMenu}
                                            searchable="true"
                                            options={menuList}
                                            placeholder={t('common.chooseClass')}
                                            className='fs-14'
                                            onChange={onChangeMenu}
                                        />
                            <Forms  ref={formRefIssue} fields={issueFields} />
                        </div>
                        :
                        <Forms ref={formRefRequest} fields={requestFields} />
                } */}
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
                    onClick={onSaveClick}
                >
                    {t('common.send')}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default createTicketModal;