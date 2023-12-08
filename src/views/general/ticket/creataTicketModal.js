import React, { useRef, useState } from 'react';
import { Modal, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
// import { userChangeAvatar } from '../../utils/fetchRequest/Urls';
import CollectionsIcon from '@mui/icons-material/Collections';

const createTicketModal = ({
    show,
    setShow,
    onSubmit,
    // props
}) => {
    const { t } = useTranslation();
    const formRef = useRef();
    const [isStudent, setIsStudent] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    // const [types, setTypes] = useState([]);
    const types = [{id:1, value: 'АЛДАА'}, {id:2, value:'САНАЛ ХҮСЭЛТ'}];
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [systems, setSystems] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [menus, setMenu] = useState([]);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [subMenus, setSubMenus] = useState([]);
    const [file, setFile] = React.useState();
    // const { selectedData } = props;

    const fields = [
        {
            key: 'systems',
            value: selectedSystem,
            label: 'Систем*',
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            searchable: true,
            multiple: true,
            options: systems,
        },
        {
            key: 'menus',
            value: selectedMenu,
            label: 'Үндсэн меню*',
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            searchable: true,
            multiple: true,
            options: menus,
        },
        {
            key: 'subMenu',
            value: selectedSubMenu,
            label: 'Туслах меню',
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            searchable: true,
            multiple: true,
            options: subMenus,
        },
        {
            key: 'issue',
            value: '',
            label: 'Гарч байгаа асуудал*',
            type: 'textArea',
            required: true,
            labelBold: true,
        },
        {
            key: 'example',
            value: '',
            label:'Жишээ*',
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
            const params = {
                ...values,
            };
            onSubmit(params);
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
                                className={isStudent ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsStudent(true)}
                            >
                                АЛДАА
                                {/* {t('student.title')} */}
                            </ListGroup.Item>
                            <ListGroup.Item
                                className={!isStudent ? 'active text-uppercase' : 'text-uppercase'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsStudent(false)}
                            >
                                САНАЛ ХҮСЭЛТ
                                {/* {t('menu.teacherStaff')} */}
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