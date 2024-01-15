import React, { useRef, useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setLoading } from 'utils/redux/action';
import { useDispatch, useSelector } from 'react-redux';
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
    const fileInputRef = useRef(null);
    const { person } = useSelector((state) => state.auth);
    const [fileData, setFileData] = useState([]);
    const [description, setDescription] = useState('');
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState(false);
    const [imageError, setImageError] = useState({});

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
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
        setDescriptionErrorMsg(false)
    }

    const onSaveClick = () => {
        dispatch(setLoading(true));
        const postData = {
            ticketId: selectedId,
            description: description,
            statusId: 1,
            createdBy: person.id
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
                <div className='d-flex flex-wrap mt-08'>
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end', color: '#575962' }} >
                        {t('ticket.reply')}*
                    </label>
                    <div className='modal-content-container'>
                        <Row className='gx-0'>
                            <Col className='pe-2'>
                                <Form.Control
                                    className={descriptionErrorMsg && 'is-invalid form-control'}
                                    as="textarea" rows="3"
                                    onChange={onChangeDescription}
                                    placeholder='Хариу'
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
                <div className='d-flex flex-wrap mt-08'>
                    <label className='modal-label mb-2 mt-2 mt-md-2' style={{ textOverflow: 'ellipsis', textAlign: 'end', color: '#575962' }} >
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
                                                    src='/img/ticket/icon/delete.png'
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