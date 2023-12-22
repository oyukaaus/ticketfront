import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import 'css/addInvoice.css';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useDispatch } from 'react-redux';
import { setLoading } from 'utils/redux/action';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketEdit, ticketInfo, ticketMenu, ticketSubMenu } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';

const editTicket = ({
    selectedData,
    show,
    setShow,
    systemList
}) => {
    const { t } = useTranslation();
    const formRefIssue = useRef();
    const formRefRequest = useRef();
    const dispatch = useDispatch();
    const [isIssue, setIsIssue] = useState(true);
    const selectedOne = selectedData[0];
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [file, setFile] = React.useState();
    const [fileData, setFileData] = useState();
    const [menuList, setMenuList] = useState([]);
    const [subMenus, setSubMenus] = useState([]);
    const [formKey, setFormKey] = useState(Date.now());
    
    const fetchMenu = async (item) => {
        console.log('item: ', item)
        dispatch(setLoading(true));
        fetchRequest(ticketMenu, 'POST', {
            systemId: selectedOne.systemId
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setMenuList(res?.menus);
                    setFormKey(Date.now());
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                console.log('e', e)
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    const fetchSubMenu = async (item, item2) => {
        dispatch(setLoading(true));
        fetchRequest(ticketSubMenu, 'POST', {
            systemId: item,
            menuId: item2
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    setSubMenus(res?.subMenus);
                    setFormKey(Date.now());
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                console.log('e', e)
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    const onSystemChange = (e) => {
        setSelectedSystem(e);
        if(isIssue){
            fetchMenu(e);
        }

    }
    const onChangeMenu = (e) => {
        setSelectedMenu(e);
        fetchSubMenu(e);

    }
    const onChangeSubMenu = (e) => {
        setSelectedSubMenu(e);
    }


    const issueFields = [
        {
            key: 'system',
            value:  selectedSystem,
            label: `${t('ticket.system')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            options: systemList,
            onChange: onSystemChange,
        },
        {
            key: 'menu',
            value:  selectedMenu,
            label: `${t('ticket.menu')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            searchable: true,
            multiple: false,
            options: menuList.map(menu => ({ value: menu.value, text: menu.text })),
            onChange: onChangeMenu,
        },
        {
            key: 'subMenu',
            value: selectedSubMenu,
            label: `${t('ticket.subMenu')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            searchable: true,
            multiple: false,
            options: subMenus.map(menu => ({ value: menu.value, text: menu.text })),
            onChange: onChangeSubMenu
        },
        {
            key: 'description',
            value: selectedOne?.description,
            label: `${t('ticket.issue')}*`,
            type: 'textArea',
            required: true,
            labelBold: true,
        },
        {
            key: 'example',
            value: selectedOne?.title,
            label: `${t('ticket.example')}*`,
            type: 'text',
            required: true,
            labelBold: true,
            placeHolder: 'Жишээ болгож алдаа гарч байгаа хэрэглэгчийн мэдээллийг оруулна уу.'
        },
        {
            key: 'image',
            label: 'Файл хавсаргах',
            value: '',
            type: 'fileUpload',
            required: false,
            fileName: '',
            multiple: false,
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
                console.log('files: ', files)
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
                }
            },
        },
    ];
    const requestFields = [
        {
            key: 'system',
            value: selectedOne?.systemId,
            label: `${t('ticket.system')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            options: systemList,
            onChange: onSystemChange,
        },
        {
            key: 'description',
            value: selectedOne?.description,
            label: `${t('ticket.idea')}*`,
            type: 'textArea',
            required: true,
            labelBold: true,
        },
        {
            key: 'image',
            label: 'Файл хавсаргах',
            value: '',
            type: 'fileUpload',
            required: false,
            fileName: '',
            multiple: false,
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
                }
            },
        },
    ];
    const onSaveClick = () => {
        const formRef = isIssue ? formRefIssue : formRefRequest;
        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            dispatch(setLoading(true));
            const postData = {
                ticketId: selectedOne.id,
                systemId: values.system,
                menuId: selectedMenu,
                subMenuId: selectedSubMenu,
                title: 'Title',
                description: values.description,
                typeId: isIssue === true ? 1 : 2,
                statusId: 1,
                example: values.example,
              };
          
              if (fileData) {
                postData.file = {
                  name: fileData.name,
                  type: fileData.type,
                  size: fileData.size,
                  path: '/',
                  content: file
                };
              }
          
            console.log('postData: ', postData);
            fetchRequest(ticketEdit, 'POST', postData)
                .then((res) => {
                    const { success = false, message = null } = res;
                    if (success) {
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

    const loadInfo = () => {
        dispatch(setLoading(true));
        fetchRequest(ticketInfo, 'POST', {
            ticketId: selectedOne?.id,
        }).then((res) => {
            if (res?.success) {
                fetchMenu(selectedOne?.systemId);
                fetchSubMenu(selectedOne?.systemId, selectedOne?.menuId);
                setIsIssue(res?.ticket[0].type === "Алдаа" ? true : false);
                setSelectedSystem(res?.ticket[0].systemId);
                setSelectedMenu(res?.ticket[0].menuId);
                setSelectedSubMenu(res?.ticket[0].subMenuId);
                setFile(res?.ticket?.files)
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

    return (
        <Modal
        key={formKey}
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
                        <div>
                            <Forms ref={formRefIssue} fields={issueFields} />
                        </div>
                        :
                        <Forms ref={formRefRequest} fields={requestFields} />
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

export default editTicket;