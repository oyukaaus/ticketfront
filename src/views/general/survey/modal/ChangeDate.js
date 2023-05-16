import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { format } from 'date-fns';

const ChangeDate = ({ show, setShow, onSubmit, survey }) => {
    const { t } = useTranslation();
    const formRef = useRef();

    const fields = [
        {
            key: 'date',
            value: [{ startDate: survey?.startDate?.date.substring(0, 10), endDate: survey?.endDate?.date.substring(0, 10) }],
            label: `${t('survey.date')}*`,
            type: 'daterange',
            required: true,
            errorMessage: t('errorMessage.enterName'),
            labelBold: true,
            selectedStartDate: survey?.startDate?.date.substring(0, 10),
            selectedEndDate: survey?.endDate?.date.substring(0, 10),
        },
    ];

    const onSaveClick = () => {
        const [isValid, , values] = formRef.current.validate();
        if (isValid) {
            const [{ startDate, endDate }] = values?.date || {};
            const postData = {
                startDate: startDate ? format(new Date(startDate), 'Y-MM-dd') : format(new Date(survey?.startDate?.date.substring(0, 10)), 'Y-MM-dd'),
                endDate: endDate ? format(new Date(endDate), 'Y-MM-dd') : format(new Date(survey?.endDate?.date.substring(0, 10)), 'Y-MM-dd'),
            };
            onSubmit({
                ...postData,
                id: survey?.id,
            });
            formRef.current.updateFields(fields);
        }
    };

    return (
        <Modal
            show={show}
            onClose={() => {
                setShow(false);
            }}
            size="xl"
        >
            <Modal.Header>
                <Modal.Title className="fs-16 d-flex justify-content-between w-100 align-items-center">
                    <span>{survey?.name}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-0">
                <Forms key="change-date-range" ref={formRef} fields={fields} />
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button size="sm" variant="link" onClick={() => setShow(false)}>
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

export default ChangeDate;
