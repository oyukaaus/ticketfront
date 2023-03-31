import React, { useState } from 'react';
import { Modal, Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ReactCrop from 'react-image-crop';
import '../../css/addInvoice.css';
import "react-image-crop/dist/ReactCrop.css";
import showMessage from "../../modules/message";


const changeProfilePicModal = ({
    show,
    setShow,
    onSubmit
}) => {
    const { t } = useTranslation();

    const [isCroped, setIsCroped] = useState(false)
    const [photo, setPhoto] = useState()
    const [photoReal, setPhotoReal] = useState()
    // const [imageType, setImageType] = useState(null)
    const [imageWidth, setImageWidth] = useState(null)
    const [imageHeight, setImageHeight] = useState(null)
    const [imageCroped, setImageCroped] = useState(null)
    const [crop, setCrop] = useState({
        unit: 'px',
        height: 1,
        width: 1,
        x: 0,
        y: 0,
        aspect: 1,
    })

    // const fields = [
    //     {
    //         label: '',
    //         value: '',
    //         type: 'fileUpload',
    //         required: true,
    //         key: 'profilePic',
    //         fileName: '',
    //         multiple: false,
    //         isExtendedButton: true,
    //         isExtendedButtonText: t('newsfeed.chooseImg'),
    //         isExtendedButtonClass: 'btn btn-outline-alternate',
    //         altImage: '../img/system/default-profile.png',
    //         accept: 'image/*',
    //         fileType: 'image',
    //         errorMessage: t('user.errorMessage.oldPassword'),
    //         clearButton: true,
    //         isClearButtonText: t('foodManagement.deletePhoto'),
    //         isClearButtonClass: 'btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28 mt-2'
    //     },
    // ];



    const verifyFile = (file) => {
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
        ];
        const acceptedSize = 10485760;
        if (file) {
            const fileSize = file.size;
            const fileType = file.type;
            if (fileSize > acceptedSize) {
                showMessage(t('person.fileError'));
                return false;
            }
            if (!acceptedType.includes(fileType)) {
                showMessage(t('person.fileTypeError'));
                return false;
            }
            return true;
        }
        return false;
    };

    const onSaveClick = () => {
        if (isCroped) {
            onSubmit(photo);
        } else {
            showMessage(t('user.profile.useCrop'));
        }
        // const [isValid, states, values] = formRef.current.validate();
        // if (states && states.length > 0 && states[0]?.fileNames) {
        //     if (verifyFile(states[0]?.fileData)) {
        //         onSubmit(states[0]?.fileData);
        //     } else {
        //         showMessage(t('person.fileError'));
        //     }
        // }
    };

    const onImageLoaded = image => {
        setImageHeight(image?.height)
        setImageWidth(image?.width)
    };

    const handleOnCropChange = cropData => {
        setCrop(cropData)
    };

    const onPhotoChange = value => {
        setIsCroped(false)
        if (value) {
            const image = value;
            const verified = verifyFile(image);
            if (verified) {
                const reader = new FileReader();
                // const imageType2 = image.type;
                reader.addEventListener('load', () => {
                    setPhotoReal(reader.result)
                    setPhoto(reader.result)
                    // setImageType(imageType2)
                }, false);
                reader.readAsDataURL(image);
                onImageLoaded(image);
                handleOnCropChange(crop);
            }
        }
    };

    const cropImage = () => {
        const cr = crop
        if (cr.height > 1 && cr.width > 1) {
            cr.x = 0
            cr.y = 0
            if (imageCroped && imageCroped.length > 6) {
                setPhoto(imageCroped)
                setImageCroped(null)
                setIsCroped(true)
                setCrop(cr)
            }
        }
    };

    const remove = () => {
        setPhoto(null)
        setImageCroped(null)
        setPhotoReal(null)
        setIsCroped(false)
        setCrop({
            x: 0,
            y: 0,
            aspect: 1
        })
    };

    const undo = () => {
        setPhoto(photoReal)
        setImageCroped(null)
        setIsCroped(false)
        setCrop({
            x: 0,
            y: 0,
            aspect: 1
        })
    };

    const getCroppedImage = (image64, cropData) => {
        const image = new Image();
        image.src = image64;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / imageWidth;
        const scaleY = image.naturalHeight / imageHeight;
        canvas.width = cropData.width;
        canvas.height = cropData.height;
        const ctx = canvas.getContext('2d');
        image.onload = () => {
            ctx.drawImage(
                image,
                cropData.x * scaleX,
                cropData.y * scaleY,
                cropData.width * scaleX,
                cropData.height * scaleY,
                0,
                0,
                cropData.width,
                cropData.height,
            );
            setImageCroped(canvas.toDataURL())
        }
    };

    const handleOnCropComplete = cropData => {
        if (cropData) {
            getCroppedImage(photo, cropData);
        }
    };

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
                    {t('user.uploadProfilePic')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Row>
                    <Col md={4}></Col>
                    <Col md={3} className='text-center'>
                        {
                            photo
                            &&
                            <div
                                className='text-center ms-2'
                                key='cropphoto'
                            >
                                <ReactCrop
                                    src={photo}
                                    crop={crop}
                                    onImageLoaded={onImageLoaded}
                                    onChange={handleOnCropChange}
                                    onComplete={handleOnCropComplete}
                                />
                            </div>
                        }
                        <label
                            htmlFor="imageInput"
                            className="btn btn-outline-alternate m-btn m-btn--icon m-btn--icon-only m-btn--circle-28 w-100"
                        >
                            {t('newsfeed.chooseImg')}
                        </label>
                        <input
                            style={{ display: 'none' }}
                            id="imageInput"
                            onChange={e => onPhotoChange(e.target.files[0])}
                            type="file"
                            accept="image/x-png, image/png, image/jpg, image/jpeg"
                        />
                        {
                            photo
                                ? [
                                    <div
                                        key='imageActions'
                                        className='d-flex justify-content-between mt-2'
                                    >
                                        <Button
                                            size='sm'
                                            variant='outline-alternate'
                                            className="br-8"
                                            onClick={cropImage}
                                        >
                                            {t('action.crop')}
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='outline-alternate'
                                            className="br-8"
                                            onClick={undo}
                                        >
                                            {t('action.undo')}
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='outline-danger'
                                            className="br-8"
                                            onClick={remove}
                                        >
                                            {t('action.delete')}
                                        </Button>
                                    </div>
                                ]
                                : null
                        }

                        {/* <Forms ref={formRef} fields={fields} /> */}
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

export default changeProfilePicModal;