import React, { useEffect, useState } from 'react';
import { Modal, Button, Col, Row, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import DTable from 'modules/DataTable/DTable';
import TreeView from 'modules/TreeView';
import { fetchRequest } from 'utils/fetchRequest';
import { surveyResultClassname, surveyResultList, surveyResultReport } from 'utils/fetchRequest/Urls';
import { setLoading } from 'utils/redux/action';
import showMessage from 'modules/message';
import CustomPieChart from 'survey/components/PieChart';

const STATUS = {
    SENT: 'Илгээсэн',
    IN_PROGRESS: 'Бөглөж байгаа',
    NEW: 'Шинэ',
    CLOSED: 'Хаагдсан',
};

const Report = () => {
    const [data, setData] = useState();
    const { id } = useParams();
    const { t } = useTranslation();
    const { selectedSchool } = useSelector((state) => state.schoolData);
    const current = new Date();

    const [selectedTreeId, setSelectedTreeId] = React.useState('');

    const handleTreeClick = (array) => {
        console.log('a:', array);
        const [itemId] = array;
        setSelectedTreeId(itemId);
    };

    const dateTimeToday =
        current.getFullYear() +
        '-' +
        ('00' + (current.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + current.getDate()).slice(-2) +
        ' ' +
        current.getHours() +
        ':' +
        ('00' + current.getMinutes()).slice(-2) +
        ':' +
        ('00' + current.getSeconds()).slice(-2);

    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: false,
        showPagination: true,
        showFilter: true,
        footer: false,
        excelFileName: data?.survey?.name + ' ' + dateTimeToday,
    };

    const studentColumn = [
        {
            dataField: 'student_code',
            text: t('dashboard.studentCode'),
            sort: true,
        },
        {
            dataField: 'student_lastname',
            text: t('dashboard.studentLastname'),
            sort: true,
        },
        {
            dataField: 'student_firstname',
            text: t('dashboard.studentFirstname'),
            sort: true,
        },
        {
            dataField: 'status_code',
            text: t('common.status'),
            sort: true,
            formatter: (cell, row, rowIndex) => {
                return (
                    <div className="text-center">
                        <div className={`custom-status ${cell}`}>{STATUS[cell]}</div>
                    </div>
                );
            },
        },
        {
            dataField: 'created_date',
            text: t('survey.sentDate'),
            sort: true,
            formatter: (cell, row, rowIndex) => {
                return cell ? format(new Date(cell), 'yyyy-MM-dd HH:mm') : '-';
            },
        },
    ];

    const dispatch = useDispatch();

    const fetchTable = () => {
        dispatch(setLoading(true));
        fetchRequest(surveyResultList, 'POST', {
            survey_id: id,
            class_id: selectedTreeId,
        })
            .then((res) => {
                setData({ ...data, results: res?.results });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const fetchData = async (surveyId) => {
        dispatch(setLoading(true));
        try {
            // surveyResultClassname
            const [res, res2, res3] = await Promise.all([
                fetchRequest(surveyResultReport, 'POST', {
                    survey_id: surveyId,
                }),
                fetchRequest(surveyResultList, 'POST', {
                    survey_id: surveyId,
                }),
                fetchRequest(surveyResultClassname, 'POST', {
                    survey_id: surveyId,
                }),
            ]);
            setData({
                report: res?.results,
                results: res2?.results,
                classess: res3?.results,
                participant_count: res3?.participant_count,
                participants: res3?.participants,
                survey: res?.survey,
            });
        } catch (e) {
            showMessage(e.message || t('errorMessage.title'));
        }
        dispatch(setLoading(false));
    };

    useEffect(() => {
        if (id) fetchData(id);
    }, [id]);

    useEffect(() => {
        if (selectedTreeId && selectedTreeId !== '') {
            fetchTable();
        }
    }, [selectedTreeId]);

    const percent =
        data?.classess?.reduce((sum, next) => {
            return sum + next.result_count;
        }, 0) / data?.participant_count;

    return (
        <Modal fullscreen show={true} size="xl" animation={false} backdropClassName="full-page-bg" dialogClassName="custom-full-page-modal">
            <Modal.Header>
                <Modal.Title className="fs-16 d-flex justify-content-between w-100 align-items-center">
                    <span>
                        {data?.survey?.code} - {data?.survey?.name}
                    </span>
                    <Link to="/survey/index">
                        <Button size="sm" variant="link">
                            {t('common.back')}
                        </Button>
                    </Link>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
                <div className="d-flex gap-3 mb-2">
                    <div className="custom-container text-center w-25">
                        <div
                            className="pie animate no-round"
                            // style="--p:80;--c:orange;"
                            style={{
                                '--p': percent || 0,
                                '--c': '#47c6ad',
                            }}
                        >
                            {(percent || 0)?.toFixed(2)}%
                        </div>
                    </div>
                    <div className="custom-container w-25">
                        <div className="d-flex gap-3 align-items-center">
                            <div style={{ width: 150 }}>
                                <CustomPieChart
                                    data={data?.report?.map((r) => ({
                                        color: r.status_color,
                                        label: STATUS[r.status_code],
                                        value: r.result_count,
                                    }))}
                                />
                            </div>
                            <div>
                                {data?.report
                                    ?.map((r) => ({
                                        color: r.status_color,
                                        label: STATUS[r.status_code],
                                        value: r.result_count,
                                    }))
                                    .map((r, i) => (
                                        <div key={`r-${i}`} className="fw-bold">
                                            <span style={{ width: 13, height: 13, backgroundColor: r.color, display: 'inline-block', marginRight: 10 }}></span>
                                            <span>
                                                {r.label}: {r.value}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="custom-container w-50">
                        {data?.classess
                            ?.filter((c) => {
                                return !!c.student_classname;
                            })
                            .map((c, i) => {
                                const total = data?.participants?.find((p) => p.class_id === c?.student_class_id)?.participant_count || 0;
                                return (
                                    <div className="d-flex fw-bold align-items-center gap-3" key={`classes-${i}`}>
                                        <span style={{ minWidth: 30 }}>{c?.student_classname}</span>
                                        <div style={{ width: 125 }}>
                                            <span
                                                className="line"
                                                style={{
                                                    width: `${(100 * c.result_count) / total}%`,
                                                }}
                                            ></span>
                                        </div>
                                        <span>
                                            {c?.result_count || 0} | {total || 0}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                <div className="d-flex gap-3">
                    <div className="custom-container" style={{ width: '20%' }}>
                        <TreeView
                            defaultExpandAll={true}
                            selectedNodes={[selectedTreeId]}
                            onSelect={(e) => handleTreeClick(e)}
                            treeData={[
                                {
                                    title: 'Бүгд',
                                    key: '',
                                    children: data?.classess
                                        ?.filter((c) => !!c.student_class_id)
                                        .map((c) => ({
                                            title: c?.student_classname,
                                            key: c?.student_class_id,
                                        })),
                                },
                                // {
                                //   title: 'Багш',
                                //   value: '1',
                                // },
                                // {
                                //   title: 'Санхүүч',
                                //   value: '2',
                                // },
                                // {
                                //   title: 'Хоолны газар',
                                //   value: '3',
                                // },
                            ]}
                        />
                    </div>
                    <div className="custom-container" style={{ flex: 1 }}>
                        <DTable
                            currentPage={1}
                            // checkable="false"
                            // onCheckable={handlerCheckable}
                            remote
                            // onInteraction={onInteraction}
                            // selectMode="radio"
                            config={config}
                            columns={studentColumn}
                            data={data?.results?.results}
                            individualContextMenus="true"
                            // contextMenus={contextMenuArray}
                            totalDataSize={data?.results?.count}
                            // onContextMenuItemClick={handleContextMenuClick}
                            excelExportUrl="url"
                            exportExportParams={{
                                school: selectedSchool?.id,
                                sortBy: sortKey,
                                order: sortOrder,
                            }}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button size="sm" variant="alternate" style={{ marginRight: 5 }}>
                        Асуумжаар эксель татах
                    </Button>
                    <Button size="sm" variant="alternate">
                        Хэрэглэгч тус бүрээр эксель татах
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default Report;
