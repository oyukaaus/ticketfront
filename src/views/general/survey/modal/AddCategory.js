import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';

const AddModal = ({ show, setShow, onSubmit, categories = [] }) => {
    const { t } = useTranslation();
    const formRef = useRef();

    const fields = [
        {
            key: 'name',
            value: '',
            label: `${t('survey.category')}*`,
            type: 'text',
            required: true,
            placeHolder: t('survey.enterCategory'),
            errorMessage: t('survey.enterCategory'),
            labelBold: true,
        },
        {
            key: 'parentCategory',
            value: '',
            label: `${t('survey.parentCategory')}`,
            type: 'dropdown',
            required: false,
            placeHolder: t('survey.parentCategoryPlaceholder'),
            labelBold: true,
            searchable: true,
            options: categories,
        },
    ];

    useEffect(() => {
        formRef?.current?.updateFields(fields);
    }, [categories])

    const onSaveClick = () => {
        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            onSubmit({
                ...values,
            });
            formRef.current.updateFields(fields);
        }
    };

    return (
        <Modal centered show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="fs-16">{t('survey.surveyCategory')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-0">
                <Forms ref={formRef} fields={fields} />
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button onClick={() => setShow(false)} size="sm" variant="link">
                        {t('common.back')}
                    </Button>
                    <Button variant="success" className="text-uppercase fs-12 br-8 ps-4 pe-4" size="sm" onClick={onSaveClick}>
                        {t('common.save')}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default AddModal;
