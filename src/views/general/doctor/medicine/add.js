import React, { useRef, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import Checkbox from "modules/Form/Checkbox";
import 'css/addInvoice.css';


const addMedicine = ({
    show,
    setShow,
    onSubmit
}) => {
    const { t } = useTranslation();
    const formRef = useRef();
    const [registerAgain, setRegisterAgain] = useState(false);

    const fields = [
        {
            key: 'code',
            value: '',
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
            value: '',
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
            value: true,
            type: 'checkbox',
            required: false,
            controlVisible: false,
        },
    ];

    const handleRegisterAgainChange = (value) => {
        if (value) {
            setRegisterAgain(false);
        } else {
            setRegisterAgain(true);
        }
    };

    const onSaveClick = () => {
        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            onSubmit(
                {
                    ...values,
                    registerAgain
                }
            );
            formRef.current.updateFields(fields)
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
                    {t('doctorsCorner.registerMedicine')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Forms ref={formRef} fields={fields} />
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col xs={3}>
                        <Checkbox
                            checked={registerAgain}
                            className='custom-cbox'
                            label={t('doctorsCorner.registerMedicineAgain')}
                            onChange={handleRegisterAgainChange}
                        />
                    </Col>
                    <Col xs={2}></Col>
                    <Col>
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
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal >
    );
};

export default addMedicine;