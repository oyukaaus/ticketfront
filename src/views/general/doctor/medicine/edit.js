import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import 'css/addInvoice.css';


const editMedicine = ({
    selectedData,
    show,
    setShow,
    onSubmit
}) => {
    const { t } = useTranslation();
    const formRef = useRef();

    const fields = [
        {
            key: 'code',
            value: selectedData?.code,
            label: `${t('common.code')}*`,
            type: 'nonCryllic',
            upperCase: true,
            required: true,
            placeHolder: t('errorMessage.enterCode'),
            errorMessage: t('errorMessage.enterCode'),
            labelBold: true,
            isCustomBtn: true,
            customBtnText: t('doctorsCorner.enterBarCode'),
            customBtnEvent: () => console.log('write to db') //reminder: ene field ee validate hiijiigaad value g avaad yvah
        },
        {
            key: 'name',
            value: selectedData?.name,
            label: `${t('common.name')}*`,
            type: 'text',
            required: true,
            placeHolder: t('errorMessage.enterName'),
            errorMessage: t('errorMessage.enterName'),
            labelBold: true,
        },
        {
            key: 'isActive',
            label: t('action.active'),
            labelBold: true,
            value: selectedData?.isActive,
            type: 'checkbox',
            required: false,
            controlVisible: false,
        },
    ];

    const onSaveClick = () => {
        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            onSubmit(values);
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
                    {t('doctorsCorner.editMedicineRegistration')}
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

export default editMedicine;