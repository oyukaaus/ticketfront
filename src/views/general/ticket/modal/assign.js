import React, { useRef, useState } from 'react';
import { Modal, Button} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Forms from 'modules/Form/Forms';
import { setLoading } from 'utils/redux/action';
import { useDispatch } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketAssign } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const AssignTicket = ({
    selectedId,
    show,
    setShow,
    userlist
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const formRef = useRef();
    const [selectedAssignee, setSelectedAssignee] = useState(null);
    const assignees = userlist&&userlist.map(user => ({ value: user.id, text: user.firstname }));

    const onAssigneeChange = (e) => {
        setSelectedAssignee(e)
    }

    const requestFields = [
        {
            key: 'assignee',
            value: selectedAssignee,
            label: `${t('ticket.assignee')}*`,
            type: 'dropdown',
            required: true,
            errorMessage: t('errorMessage.enterValue'),
            labelBold: true,
            options: assignees,
            onChange: onAssigneeChange,
        },
        {
            key: 'description',
            value: '',
            label: `${t('ticket.comment')}*`,
            type: 'textArea',
            required: true,
            labelBold: true,
        },
    ];
    const onCancelClick =() => {
        setShow(false);
        window.location.reload();
    }
    const onSaveClick = () => {
        const [isValid, values] = formRef.current.validate();
        if (isValid) {
            dispatch(setLoading(true));
            const postData = {
                ticketId: selectedId,
                assignee: selectedAssignee,
                statusId: 2,
                description: values.description
            };
            console.log('postData: ', postData)
            fetchRequest(ticketAssign, 'POST', postData)
                .then((res) => {
                    console.log('response: ', res)
                    const { success = false, message = null } = res;
                    if (success) {
                        history.replace(`/admin/view/${selectedId}`);
                        showMessage(message, true);
                        window.location.reload();
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
                    {t('ticket.selectAssignee')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Forms ref={formRef} fields={requestFields} />
              </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button
                    onClick={onCancelClick}
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

export default AssignTicket;