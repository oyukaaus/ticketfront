import React, {  useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setLoading } from 'utils/redux/action';
import { useDispatch } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { ticketStatus } from 'utils/fetchRequest/Urls';
import showMessage from 'modules/message';
import DTable from 'modules/DataTable/DTable';

const ShowStatusLog = ({
    selectedId,
    show,
    setShow,
}) => {
    const { t } = useTranslation();
    const [pageNumber] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [tableTotalCount] = useState(0)
    const dispatch = useDispatch();

    const config = {
        excelExport: false,
        printButton: false,
        columnButton: false,
        showPagination: false,
        showFilter: false,
        footer: false,
    };
    const column = [
        {
            dataField: 'beforeStatusId',
            text: t('ticket.oldStatus'),
        },
        {
            dataField: 'afterStatusId',
            text: t('ticket.newStatus'),
        },
        {
            dataField: 'changedDate',
            text: t('ticket.changedDate'),
        },
        {
            dataField: 'createdUserId',
            text: t('ticket.changedBy'),
        },
    ];

    const onCancelClick = () => {
        setShow(false);
    }

    const fetchStatusLog = async () => {
        fetchRequest(ticketStatus, 'POST', {
            requestId: selectedId
        })
            .then((res) => {
                const { success = false, message = null } = res;
                if (success) {
                    console.log('res status: ', res)
                    setTableData(res?.statusLogs.map(obj => {
                        return {
                            beforeStatusId: obj?.beforeStatus,
                            afterStatusId: obj?.afterStatus,
                            changedDate: obj?.createdDate?.date&& (obj?.createdDate?.date).replace(/\.\d+$/, ''),
                            createdUserId: obj?.firstName
                        }
                    }))
                    
                } else {
                    showMessage(message || t('errorMessage.title'));
                }
                dispatch(setLoading(false));
            })
            .catch((e) => {
                console.log(e);
                dispatch(setLoading(false));
                showMessage(t('errorMessage.title'));
            });
    };

    useEffect(() => {
        fetchStatusLog()
    }, []);

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title className='fs-16'>
                    {t('ticket.statusLog')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="mb-3 br-10">
                <DTable
                    currentPage={pageNumber}
                    remote
                    // onInteraction={onInteraction}
                    selectMode='radio'
                    config={config}
                    columns={column}
                    data={tableData}
                    individualContextMenus='true'
                    // contextMenus={contextMenuArray}
                    totalDataSize={tableTotalCount}
                // onContextMenuItemClick={handleContextMenuClick}

                />
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button
                    onClick={onCancelClick}
                    size='sm'
                    variant="link"
                >
                    {t('ticket.closeModal')}
                </Button>
                {/* <Button
                    variant="success"
                    className='text-uppercase fs-12 br-8 ps-4 pe-4'
                    size='sm'
                >
                    {t('common.send')}
                </Button> */}
            </Modal.Footer>
        </Modal >
    );
};

export default ShowStatusLog;