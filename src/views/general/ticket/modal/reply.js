import React, { useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import CollectionsIcon from '@mui/icons-material/Collections';
import { setLoading } from 'utils/redux/action';
import { useDispatch } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketDtlCreate } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const ReplyTicket = ({
    selectedId,
    tag,
    show,
    setShow,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const formRef = useRef();
    const [file, setFile] = React.useState();
    const [fileData, setFileData] = useState([]);

    const requestFields = [
        {
            key: 'description',
            value: '',
            label: `${t('ticket.reply')}*`,
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
        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            dispatch(setLoading(true));
            const postData = {
                ticketId: selectedId,
                description: values.description,
                statusId: 1,
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
            console.log('postData: ', postData)
            fetchRequest(ticketDtlCreate, 'POST', postData)
                .then((res) => {
                    console.log('response: ', res)
                    const { success = false, message = null } = res;
                    if (success) {
                        if (tag && tag === 'admin') {
                            history.replace(`/admin/view/${selectedId}`);
                        } else {
                            history.replace(`/ticket/view/${selectedId}`);
                        }
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
    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
                    {t('ticket.reply')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Forms ref={formRef} fields={requestFields} />
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

export default ReplyTicket;