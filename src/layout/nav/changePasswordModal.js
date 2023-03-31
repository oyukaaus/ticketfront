import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from '../../modules/Form/Forms';
import '../../css/addInvoice.css';


const changePasswordModal = ({
    show,
    setShow,
    onSubmit
}) => {
    const { t } = useTranslation();
    const formRef = useRef();
    // const [studentData, setStudentData] = useState([]);

    const fields = [
        {
            key: 'old',
            value: '',
            label: `${t('user.oldPassword')}*`,
            type: 'password',
            required: true,
            placeHolder: t('user.errorMessage.oldPassword'),
            errorMessage: t('user.errorMessage.oldPassword'),
            labelBold: true,
        },
        {
            key: 'new',
            value: '',
            label: `${t('user.newPassword')}*`,
            type: 'password',
            required: true,
            placeHolder: t('user.errorMessage.newPassword'),
            errorMessage: t('user.errorMessage.newPassword'),
            labelBold: true,
        },
        {
            key: 'newRepeat',
            value: '',
            label: `${t('user.repeatNewPassword')}*`,
            type: 'password',
            required: true,
            placeHolder: t('user.repeatNewPassword'),
            errorMessage: t('user.errorMessage.repeatNewPassword'),
            labelBold: true,
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
                    {t('user.changePassword')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Forms ref={formRef} fields={fields} />
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

export default changePasswordModal;