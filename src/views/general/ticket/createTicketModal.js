import React, { useRef, useState } from 'react';
import { Modal, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
// import { userChangeAvatar } from '../../utils/fetchRequest/Urls';
import CollectionsIcon from '@mui/icons-material/Collections';
import { setLoading } from 'utils/redux/action';
import { useDispatch } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketCreate } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const createTicketModal = ({
    show,
    setShow,
    onSubmit,
    // props
}) => {
    const { t } = useTranslation();
    const formRef = useRef();
    const dispatch = useDispatch();
    const history = useHistory();

    const [isError, setIsError] = useState(true);
    const [selectedSystem, setSelectedSystem] = useState(null);
    // const [systems, setSystems] = useState([]);
    const systems = [{value: 1, text:'ERP'}, { value: 2, text:'d'}];
    const [selectedMenu, setSelectedMenu] = useState(null);
    // const [menus, setMenu] = useState([]);
    const menus = [{value: 1, text:'Нүүр хуудас'}, { value: 2, text:'Санал хүсэлт'}];
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    // const [subMenus, setSubMenus] = useState([]);
    const subMenus = [{value: 1, text:'Нүүр хуудас'}, { value: 2, text:'Санал хүсэлт'}];
    const [file, setFile] = React.useState();

    const onSystemChange = (e) => {
        console.log('e: ', e)
        setSelectedSystem(e)
    }
    const fields = [
        {
            key: 'system',
            value: selectedSystem,
            label: `${t('ticket.system')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            options: systems,
            onChange: onSystemChange,
        },
        {
            key: 'menus',
            value: selectedMenu,
            label: `${t('ticket.menu')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            searchable: true,
            multiple: false,
            options: menus,
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
            options: subMenus,
        },
        {
            key: 'description',
            value: '',
            label: `${t('ticket.issue')}*`,
            type: 'textArea',
            required: true,
            labelBold: true,
        },
        {
            key: 'example',
            value: '',
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
            altImageClass:'d-none',
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
              }
            },
          },
    ];
    
    const onSaveClick = () => {
        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            dispatch(setLoading(true));
            const postData = {
                systemId: values.system,
                menuId: values.menus,
                submenuId: values.subMenu,
                title: 'sadas',
                description: values.description,
                typeId: 1,
                statusId: 1,
                example: values.example
            };
            console.log('postData: ', postData)
            fetchRequest(ticketCreate, 'POST', postData)
                .then((res) => {
                    console.log('response: ', res)
                    const { success = false, message = null } = res;
                    if (success) {
                        history.replace(`/ticket/index`);                 
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

    return (
        <Modal
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
                                className={isError ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsError(true)}
                            >
                                {t('ticket.ticket')}
                            </ListGroup.Item>
                            <ListGroup.Item
                                className={!isError ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsError(false)}
                            >
                                {t('ticket.ticket')}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                <Forms ref={formRef} fields={fields} />
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