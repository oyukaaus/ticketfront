import React, { useState } from 'react';
import { Modal, Button, Col, Row, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DTable from 'modules/DataTable/DTable';
import TreeView from 'modules/TreeView';

const SurveyReportContainer = () => {
  const { t } = useTranslation();
  const { selectedSchool } = useSelector((state) => state.schoolData);
  const current = new Date();
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
    excelFileName: t('doctorsCorner.medicineRegistration') + ' ' + dateTimeToday,
  };

  const studentColumn = [
    {
      dataField: 'code',
      text: t('dashboard.studentCode'),
      sort: true,
    },
    {
      dataField: 'lastname',
      text: t('dashboard.studentLastname'),
      sort: true,
    },
    {
      dataField: 'firstname',
      text: t('dashboard.studentFirstname'),
      sort: true,
    },
    {
      dataField: 'status',
      text: t('common.status'),
      sort: true,
    },
    {
      dataField: 'sent_date',
      text: t('survey.sentDate'),
      sort: true,
    },
  ];

  return (
    <Modal fullscreen show={true} size="xl" animation={false} backdropClassName="full-page-bg" dialogClassName="custom-full-page-modal">
      <Modal.Header>
        <Modal.Title className="fs-16 d-flex justify-content-between w-100 align-items-center">
          <span>Судалгааны код & Судалгааны нэр</span>
          <Link to="/survey/index">
            <Button size="sm" variant="link">
              {t('common.back')}
            </Button>
          </Link>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <div className="d-flex space-x-4  mb-2">
          <div className="custom-container text-center w-25">
            <div
              className="pie animate no-round"
              // style="--p:80;--c:orange;"
              style={{
                '--p': '78',
                '--c': '#47c6ad',
              }}
            >
              78%
            </div>
          </div>
          <div className="custom-container w-25"></div>
          <div className="custom-container w-50"></div>
        </div>

        <div className="d-flex">
          <div className="custom-container w-25">
            <TreeView
              defaultExpandAll={true}
              selectedNodes={['1']}
              onSelect={(e) => {}}
              treeData={[
                {
                  title: 'Багш',
                  value: '1',
                },
                {
                  title: 'Санхүүч',
                  value: '2',
                },
                {
                  title: 'Хоолны газар',
                  value: '3',
                },
              ]}
            />
          </div>
          <div className="custom-container w-75">
            <DTable
              currentPage={1}
              checkable="false"
              // onCheckable={handlerCheckable}
              remote
              // onInteraction={onInteraction}
              // selectMode="radio"
              config={config}
              columns={studentColumn}
              data={[]}
              individualContextMenus="true"
              // contextMenus={contextMenuArray}
              totalDataSize={0}
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

export default SurveyReportContainer;
