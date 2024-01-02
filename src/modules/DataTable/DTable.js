/* eslint-disable */
// https://react-bootstrap-table.github.io/react-bootstrap-table2/
// https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
// https://www.npmjs.com/package/react-bootstrap-table-next
import React, { useState, useRef, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { cloneDeep, isEqual } from 'lodash';
import ReactDOM from 'react-dom';
import { ClickAwayListener } from '@material-ui/core';
import ToolkitProvider, { CSVExport, ColumnToggle } from 'react-bootstrap-table2-toolkit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactToPrint from 'react-to-print';
import XLSX, { read } from 'xlsx';
import DragHandle from './DragHandle';
import Search from './Search';
import PaginationLinks from './PaginationLinks';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { styled } from "@mui/material/styles";
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import FormGroup from '@mui/material/FormGroup';
import MoreVert from '@mui/icons-material/MoreVert';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { numberFormat, numberReverseFormat, priceFormat } from '../../utils/utils';
import { fetchRequest } from '../../utils/fetchRequest';
import showMessage from "../../modules/message";
import { setLoading } from '../../utils/redux/action';
import DatePickerRange from "modules/Form/DatePickerRange";

import './datatable.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const defaultConfig = {
	showPagination: true,
	showFilter: true,
	showLeftButton: false,
	leftButtonClassName: '',
	leftButtonStyle: {},
	leftButtonIcon: '',
	leftButtonText: '',
	tableMarginLess: false,
	defaultSort: [
		{
			dataField: 'id',
			order: 'asc',
		},
	],
	showAllData: false,
	footer: false,
	footerStyle: '',
	headerFilter: false,
	isTableEdit: false,
	blurToSave: false,
};

const CustomToggleList = ({
	anchorRef,
	columns,
	onColToggle,
	handleToggle,
	open,
	handleClose,
}) => (
	<>
		<Button
			ref={anchorRef}
			size="small"
			aria-controls={open ? 'split-button-menu' : undefined}
			aria-expanded={open ? 'true' : undefined}
			aria-label="select merge strategy"
			aria-haspopup="menu"
			onClick={handleToggle}
			style={{
				backgroundColor: '#ff5b1d',
				border: 'none',
				width: '33px',
				height: '33px',
				minWidth: 'unset',
				alignItems: 'center',
				marginRight: '0.5rem',
				color: 'white',
				borderRadius: '3px'
			}}
		>
			<i className='la la-columns' style={{ fontSize: '22px' }} />
		</Button>
		<Popper
			open={open}
			anchorEl={anchorRef.current}
			transition
			style={{ zIndex: 1000 }}
		>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{
						transformOrigin:
							placement === 'bottom' ? 'center top' : 'center bottom',
					}}
				>
					<Paper style={{ padding: '12px 20px' }}>
						<ClickAwayListener onClickAway={handleClose}>
							<FormGroup id="split-button-menu">
								{columns
									.map((column, index) => (
										<FormControlLabel
											key={column.dataField}
											control={
												<Checkbox
													disabled={column.dataField == 'dt-row-order-number' ? true : false}
													className='me-2' size='small'
													checked={column.dataField == 'dt-row-order-number' ? true : column.colVisible || false}
												/>
											}
											label={column.text}
											onChange={() => onColToggle(column.dataField)}
											style={{
												whiteSpace: 'nowrap',
												height: 30,
											}}
										/>
									))}
							</FormGroup>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	</>
);

const exportUrlResponseHandler = (url) => {
	if (url) {
		switch (url) {
			default:
				return null;
		}
	} else {
		return null
	}
}

const checkSpecialChars = (specialChars, string) => {
	return specialChars.includes(string);
};

const buildExcelData = (header = [], filterRecords = [], filename = '', showOrdering = false, footer = false) => {
	let rowIndex = 1;
	let records = [];
	for (let record of filterRecords) {
		let recordCol = {};
		let colIndex = 1;
		for (let column of header) {

			if (!column.hide && column.colType !== 'image') {

				const isDateField = column.dataField?.endsWith(".date");

				let field = column.dataField;
				if (isDateField) {
					const dateFieldParams = field.split(".date");
					if (dateFieldParams && dateFieldParams.length > 0) {
						field = dateFieldParams[0];
					}
				}

				if (showOrdering) {
					recordCol['№'] = rowIndex;
					colIndex++;
				}

				if (field in record) {
					if (isDateField) {
						recordCol[column.text] = record[field]?.date?.substring(0, column.colType === 'date' ? 10 : 19);
						colIndex++;
					} else if (column.colType === 'status') {
						recordCol[column.text] = record[field] ? '+' : '-';
					} else {
						if (column.colType === 'number') {
							recordCol[column.text] = Number.parseFloat(record[field]);
						} else {
							recordCol[column.text] = record[field];
						}

						colIndex++;
					}

					// if (column.colType && column.colType === 'number') {
					// 	if (typeof (record[field]) === 'string' && record[field].includes("'")) {
					// 		recordCol['№'] = rowIndex;
					// 		recordCol[column.text] = parseInt(numberReverseFormat(record[field], "'", ''));
					// 		colIndex++;
					// 	} else if (typeof (record[field]) === 'string' && record[field].includes(',')) {
					// 		recordCol[column.text] = parseInt(numberReverseFormat(record[field], ',', ''));
					// 		colIndex++;
					// 	} else {
					// 		recordCol[column.text] = record[field];
					// 		colIndex++;
					// 	}
					// } else if (column.colType && column.colType === 'html') {
					// 	if (column.textValueKey) {
					// 		if (column.text !== undefined) {
					// 			recordCol[column.text] = record[column.textValueKey] || '-';
					// 		}
					// 	} else {
					// 		if (record[field].props && record[field].props.data) {
					// 			let cellText = record[field].props && record[field].props.data || '';
					// 			recordCol[column.text] = cellText;
					// 		} else {
					// 			let cellText = htmlDecode(record[field]);
					// 			recordCol[column.text] = cellText;
					// 		}
					// 	}
					// 	colIndex++;
					// } else if (column.colType && column.colType === 'qpay') {
					// 	recordCol[column.text] = record[field].toString();
					// 	colIndex++;
					// } else if (column.colType && column.colType === 'date' && isDateField) {
					// 	recordCol[column.text] = record[field]?.date?.substring(0, 19);
					// 	colIndex++;
					// } else {
					// 	recordCol['№'] = rowIndex;
					// 	recordCol[column.text] = record[field];
					// 	colIndex++;
					// }
				}
			}
		}
		rowIndex++;
		records.push(recordCol);
	}

	if (footer && rowIndex == (filterRecords.length + 1)) {
		let footerRecordCol = {};
		for (let i = 0; i < header.length; i++) {
			let column = header[i];

			if (column.footerType == 'sum') {
				let sum = 0;
				for (let c = 0; c < filterRecords.length; c++) {
					let amount = filterRecords[c][column.dataField];
					if (amount) {
						if (!Number.isInteger(amount)) {
							const specialChars = '\'"\\,./`';
							const isSpecChar = checkSpecialChars(specialChars, amount);

							if (isSpecChar) {
								amount = amount.replaceAll("'", '');
							}
						}

						sum += parseFloat(amount);
					}
				}
				footerRecordCol[column.text] = sum;
			} else {
				footerRecordCol[column.text] = '';
			}
		}
		records.push(footerRecordCol);
	}

	let ws = XLSX.utils.json_to_sheet(records);
	let wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "sheet");
	let buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }); // generate a nodejs buffer
	let str = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }); // generate a binary string in web browser
	XLSX.writeFile(wb, `${filename}.xlsx`);
}

const MyExportCSV = (props) => {

	const dispatch = useDispatch();
	const { t } = useTranslation();

	const handleClick = () => {
		const tableList = [];
		if (props.columns && props.columns.length > 0 && props.data && props.data.length > 0) {
			const header = props.columns;
			let filterRecords = props.data;

			if (props?.totalSize > props?.data?.length) {
				if (props?.url && props?.params) {
					dispatch(setLoading(true));
					fetchRequest(props?.url, 'POST', { ...props?.params, ...{ pageSize: props.totalSize, query: props?.query } })
						.then(res => {
							if (res.success) {
								let dataKey = exportUrlResponseHandler(props?.url);
								if (dataKey && (dataKey in res)) {
									filterRecords = res[dataKey];
								}
								buildExcelData(header, filterRecords, props?.filename, props?.showOrdering, props?.footer);
							} else {
								showMessage(res.message, res.success)
							}
							dispatch(setLoading(false));

						})
						.catch(() => {
							dispatch(setLoading(false));
							showMessage(t('errorMessage.title'))
						});
				} else {
					buildExcelData(header, filterRecords, props?.filename, props?.showOrdering, props?.footer);
				}
			} else {
				buildExcelData(header, filterRecords, props?.filename, props?.showOrdering, props?.footer);
			}

		}

	};

	return (
		<Button
			children={
				<i
					className="la-old la-file-excel-o m-0 p-0"
					style={{
						fontSize: '22px',
						color: '#ffffff',
					}}
				/>
			}
			style={{
				backgroundColor: '#ff5b1d',
				boxShadow: '0 2px 10px 0 #ff5b1d',
				border: 'none',
				maxWidth: '33px',
				minWidth: '33px',
				height: '33px',
				alignItems: 'center',
				borderRadius: '3px',
			}}
			className='m-btn m-btn--icon m-btn--icon-only p-1 mx-2'
			onClick={handleClick}
		/>
	);
};

const DTable = ({
	data = [],
	config: propsConfig = {},
	columns = [],
	currentPage = 1,
	defaultPageSize = 10,
	onInteraction,
	loading = false,
	remote = false,
	totalDataSize = 0,
	contextMenus = [],
	onContextMenuItemClick,
	onLeftButtonClick,
	wrapperClassName = '',
	className = '',
	draggable = false,
	isMore = false,
	onDragStart,
	onDrop,
	showOrdering = true,
	individualContextMenus = false,
	isSelect = false,
	selectMode = 'checkbox',
	selectPosition = 'left',
	onSelect,
	onSelectAll,
	locale,
	checkable = false,
	onColumnToggle,
	onCheckable,
	excelExportUrl = null,
	exportExportParams = {}
}) => {
	const { t } = useTranslation();
	const [initialData, setInitialData] = useState([]);
	const [pageNumber, setPageNumber] = useState(currentPage);
	const [sizePerPage, setSizePerPage] = useState(defaultPageSize);
	const [searchValue, setSearchValue] = useState('');
	const [date, setDate] = useState(null);
	const [open, setOpen] = useState(false);
	const [allCheckValue, setAllCheckValue] = useState(false);
	const config = { ...defaultConfig, ...propsConfig };
	const tableRef = useRef(null);
	const anchorRef = useRef(null);
	const excelRef = useRef(null);
	const { ExportCSVButton } = CSVExport;
	const { ToggleList } = ColumnToggle;

	const BpIcon = styled("span")(({ theme }) => ({
		borderRadius: 4,
		width: 18,
		height: 18,
		backgroundColor: "#fff",
		borderColor: "#ff5b1d",
		borderStyle: "solid",
		borderWidth: "2px",
		"input:hover ~ &": {
			backgroundColor: "#ebf1f5"
		},
		"input:disabled ~ &": {
			boxShadow: "none",
			background: "rgba(206,217,224,.5)"
		}
	}));

	const BpCheckedIcon = styled(BpIcon)({
		backgroundColor: "#ff5b1d",
		"&:before": {
			display: "block",
			width: 14,
			height: 15,
			backgroundImage:
				"url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
				" fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
				"1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
			content: '""'
		},
		"input:hover ~ &": {
			backgroundColor: "#ff5b1d"
		}
	});

	const unMountContextMenus = () => {
		const wrapper = getWrapper();
		if (wrapper) {
			ReactDOM.unmountComponentAtNode(wrapper);
		}
	};

	useEffect(() => {
		if (!isEqual(data, initialData)) {
			setInitialData(data);
		}
		if (config.showAllData) {
			setSizePerPage(data.length + 10);
		}
		return () => {
			unMountContextMenus();
		};
	}, [data]);

	const pgOptions = {
		custom: true,
		paginationSize: 5,
		sizePerPageList: [10, 25, 50, 100],
		totalSize: remote ? totalDataSize : data && data.length > 0 ? data.length : 0,
		page: currentPage,
		sizePerPage,
	};

	const getUserInteraction = (object, searchValue, dates) => {
		let tableState = {};
		if (tableRef.current) {
			const { page, sizePerPage: pageSize, sortField, sortOrder } = tableRef.current.getNewestState();
			tableState = {
				page: searchValue ? 1 : page,
				pageSize,
				sort: sortField,
				order: sortOrder,
				search: searchValue,
				filter: object,
				date: dates
			};
		}

		onInteraction?.({
			...tableState,
			...object,
		});
	};

	const handleTableChange = (type, newState) => {
		switch (type) {
			case 'filter': {
				break;
			}
			case 'pagination': {
				if (newState.page !== pageNumber) {
					setPageNumber(newState.page);
				}
				if (newState.sizePerPage !== sizePerPage) {
					setSizePerPage(newState.sizePerPage);
					// getUserInteraction({ pageSize: newState.sizePerPage });
				}
				getUserInteraction({
					page: newState.page ? newState.page : 1,
					pageSize: newState.sizePerPage,
				}, searchValue, date);
				break;
			}
			case 'sort': {
				getUserInteraction({
					sort: newState.sortField,
					order: newState.sortOrder,
				}, searchValue, date);
				break;
			}
			case 'cellEdit': {
				break;
			}
			default: {
				break;
			}
		}
	};

	const getNoDataText = () => {
		if (loading) {
			return '<div className="spinner-border text-primary" />';
		}

		return (
			<div style={{ textAlign: "center" }}>{t('action.emptyTable')}</div>
		);
	};

	const handleSearch = () => {
		if (remote) {
			setPageNumber(1)
			getUserInteraction({}, searchValue, date);
		}
	};

	const getTableData = () => {
		if (remote) {
			return data;
		}

		let clone = [];
		if (Array.isArray(initialData)) {
			clone = cloneDeep(initialData);
		} else {
			clone = cloneDeep(Object.values(initialData));
		}

		if (searchValue) {
			const val = searchValue.toLowerCase();
			return clone.filter((record) => {
				for (const column of columns) {
					if (record.hasOwnProperty(column.dataField)) {
						/// ignoring number type for now!!!.
						if (typeof record[column.dataField] === 'string' && record[column.dataField].toLowerCase().includes(val)) {
							return true;
						}
					}
				}
				return false;
			});
		}

		return clone;
	};

	const onContextMenu = (e, row) => {
		e.preventDefault();
		unMountContextMenus();

		let availableContextMenus = [];

		if (individualContextMenus) {
			if (contextMenus.length && row.contextMenuKeys?.length) {
				for (const menu of contextMenus) {
					if (row.contextMenuKeys.includes(menu.key)) {
						availableContextMenus.push(menu);
					}
				}
			}
		} else {
			availableContextMenus = contextMenus;
		}


		if (availableContextMenus.length) {
			const wrapper = getWrapper();
			const menu = (
				<ClickAwayListener onClickAway={unMountContextMenus}>
					<div className="dt-cm-wrapper" style={{ top: e.pageY, left: e.pageX }}>
						{availableContextMenus.map((menu) => {
							return (
								<div
									className="dt-cm-item"
									onClick={(event) => {
										event.stopPropagation();
										unMountContextMenus();
										onContextMenuItemClick?.(row.id, menu.key, row, event);
									}}
									key={menu.key}
								>
									<div>{menu.icon ? menu.icon : null}</div>
									<span className='grey-color'>{menu.title}</span>
								</div>
							);
						})}
					</div>
				</ClickAwayListener>
			);
			ReactDOM.render(menu, wrapper);
		}
	};

	const getWrapper = () => {
		const id = 'datatable-contextmenu-wrapper';
		const cmWrapper = document.getElementById(id);
		if (cmWrapper) {
			return cmWrapper;
		} else {
			const cmWrapper = document.createElement('div');
			cmWrapper.id = id;
			document.body.appendChild(cmWrapper);
			return cmWrapper;
		}
	};

	const onRowDragStart = (params) => {
		onDragStart?.(params);
	};

	const onRowDrop = (params) => {
		onDrop?.(params);
	};

	const onCheckableHandler = (e, id, rowIndex, allCheck) => {
		let clone = [...data];
		const selectedRows = [];

		if (clone && clone.length > 0 && id) {
			for (let i = 0; i < clone.length; i++) {
				if (id == clone[i].id) {
					clone[i].checkable = e.target.checked;
				}
			}
		}

		setInitialData(clone);
		if (allCheck == 'allCheck') {
			for (let i = 0; i < clone.length; i++) {
				clone[i].checkable = e.target.checked;
				selectedRows.push(i)
			}
			setAllCheckValue(e.target.checked);
			onCheckable?.('allCheck', rowIndex, e.target.checked, selectedRows)
		} else {
			if (e.target.checked == false) {
				setAllCheckValue(e.target.checked);
			}
			for (let i = 0; i < clone.length; i++) {
				if (clone[i].checkable == true) {
					selectedRows.push(i)
				}
			}
			onCheckable?.('row', rowIndex, e.target.checked, selectedRows)
		}
	}

	const getColumns = (isToolkit = false) => {
		const cols = [];
		if (draggable) {
			if (config.footer) {
				cols.push({
					isDummyField: true,
					text: '',
					dataField: 'dragHandle',
					formatter(cell, row, rowIndex) {
						return rowIndex + 1;
					},
					headerStyle: () => {
						return {
							width: 30,
						};
					},
					style: {
						verticalAlign: 'middle',
					},
					footer: '',
					footerStyle: config.footerStyle,
				});
			} else {
				cols.push({
					isDummyField: true,
					text: '',
					dataField: 'dragHandle',
					formatter: (cell, row) => {
						return <DragHandle rowClass={`dt-row-${row.id}`} data={row} onStart={onRowDragStart} onDrop={onRowDrop} />;
					},
					headerStyle: () => {
						return {
							width: 30,
						};
					},
					style: {
						verticalAlign: 'middle',
					},
				});
			}
		}

		if (showOrdering) {
			if (config.footer) {
				cols.push({
					isDummyField: true,
					text: '№',
					dataField: 'dt-row-order-number',
					formatter(cell, row, rowIndex) {
						return rowIndex + 1;
					},
					csvFormatter(cell, row, rowIndex) {
						return rowIndex + 1;
					},
					headerStyle: () => {
						return {
							width: 50,
						};
					},
					headerAlign: 'left',
					style: {
						textAlign: 'left',
						verticalAlign: 'middle',
					},
					footer: '',
					footerStyle: config.footerStyle,
				});
			} else {
				cols.push({
					isDummyField: true,
					text: '№',
					dataField: 'dt-row-order-number',
					formatter(cell, row, rowIndex) {
						return rowIndex + 1;
					},
					csvFormatter(cell, row, rowIndex) {
						return rowIndex + 1;
					},
					headerStyle: () => {
						return {
							width: 50,
						};
					},
					headerAlign: 'left',
					style: {
						textAlign: 'left',
						verticalAlign: 'middle',
					},
				});
			}
		}

		if (isMore) {
			if (config.footer) {
				cols.push({
					isDummyField: true,
					text: '',
					headerFormatter: (column, index, components) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 3 }}
								className="checkbox-light"
								checked={allCheckValue}
								onChange={(e) => onCheckableHandler(e, null, index, 'allCheck')}
							/>
						);
					},
					dataField: 'checkable',
					formatter: (cell, row, rowIndex) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 4 }}
								className="checkbox-light"
								checked={row.checkable || false}
								onChange={(e) => onCheckableHandler(e, row.id, rowIndex, '')}
							/>
						);
					},
					footer: '',
					headerStyle: () => {
						return {
							width: 50,
							verticalAlign: 'middle',
							textAlign: 'center',
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			} else {
				cols.push({
					isDummyField: true,
					text: '1',
					dataField: 'checkable',
					headerFormatter: (column, index, components) => {
						return null;
					},
					formatter: (cell, row, rowIndex) => {
						return (
							<Button
								style={{
									color: '#ff4900',
									boxShadow: '0 0 5px 0 rgb(0 0 0 / 5%) !important',
									border: 'solid 0.5px #ff4900',
									borderRadius: 6,
									height: 25,
									minWidth: 25
								}}
								onClick={onContextMenu}
							>
								<MoreVert className="w-15" />
							</Button>
						);
					},
					headerStyle: () => {
						return {
							width: 25,
							verticalAlign: 'middle',
							textAlign: 'center',
							paddingLeft: 0,
							paddingRight: 0,
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			}
		}

		if (checkable) {
			if (config.footer) {
				cols.push({
					isDummyField: true,
					text: '',
					headerFormatter: (column, index, components) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 3 }}
								className="checkbox-light"
								checked={allCheckValue}
								onChange={(e) => onCheckableHandler(e, null, index, 'allCheck')}
							/>
						);
					},
					dataField: 'checkable',
					formatter: (cell, row, rowIndex) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 4 }}
								className="checkbox-light"
								checked={row.checkable || false}
								onChange={(e) => onCheckableHandler(e, row.id, rowIndex, '')}
							/>
						);
					},
					footer: '',
					headerStyle: () => {
						return {
							width: 50,
							verticalAlign: 'middle',
							textAlign: 'center',
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			} else {
				cols.push({
					isDummyField: true,
					text: '1',
					dataField: 'checkable',
					headerFormatter: (column, index, components) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 3 }}
								className="checkbox-light"
								checked={allCheckValue}
								onChange={(e) => onCheckableHandler(e, null, index, 'allCheck')}
							/>
						);
					},
					formatter: (cell, row, rowIndex) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 4 }}
								className="checkbox-light"
								checked={row.checkable || false}
								onChange={(e) => onCheckableHandler(e, row.id, rowIndex, '')}
							/>
						);
					},
					headerStyle: () => {
						return {
							width: 50,
							verticalAlign: 'middle',
							textAlign: 'center',
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			}
		}

		for (const col of columns) {
			if (!isToolkit && col.colVisible === false) {
				//
			} else {
				if (config.headerFilter) {
					if (col.filterDisable) {
						cols.push({
							...col,
						});
					} else {
						cols.push({
							...col,
							filter: textFilter({
								placeholder: ' ',
								onFilter: (filterValue) => {
									getUserInteraction({
										filter: filterValue,
										field: col.dataField,
									}, searchValue, date);
								},
							}),
						});
					}
				} else {
					if (config.columnButton) {
						if (col.colVisible === true) {
							cols.push({
								...col,
							});
						}
					} else {
						cols.push({
							...col,
						});
					}
				}
			}
		}

		if (!config.footer) {
			if (cols && cols.length > 0) {
				for (let i = 0; i < cols.length; i++) {
					if (cols && cols[i].footer) {
						cols[i].footer = false;
					}
				}
			}
		} else if (cols && cols.length > 0) {
			for (let i = 0; i < cols.length; i++) {
				if (cols) {
					cols[i].footerStyle = config.footerStyle;
					if (cols[i].footerType == 'sum') {
						let sum = 0;
						if (data && data.length > 0) {
							for (let c = 0; c < data.length; c++) {
								let amount = data[c][cols[i].dataField];
								if (amount) {
									if (!Number.isInteger(amount)) {
										const specialChars = '\'"\\,./`';
										const isSpecChar = checkSpecialChars(specialChars, amount);

										if (isSpecChar) {
											amount = amount.replaceAll("'", '');
										}
									}

									sum += parseFloat(amount);
								}
							}
						}

						if (cols[i]?.isFooterRoundSum) {
							cols[i].footer = priceFormat(sum, cols[i]?.isFooterRoundSum) || '0';
						} else {
							cols[i].footer = priceFormat(sum) || '0';
						}
					}
				}
			}
		}

		return cols;
	};

	const getAllColumns = (isToolkit = false) => {
		const cols = [];
		if (draggable) {
			if (config.footer) {
				cols.push({
					isDummyField: true,
					text: '',
					dataField: 'dragHandle',
					formatter(cell, row, rowIndex) {
						return rowIndex + 1;
					},
					headerStyle: () => {
						return {
							width: 30,
						};
					},
					style: {
						verticalAlign: 'middle',
					},
					footer: '',
					footerStyle: config.footerStyle,
				});
			} else {
				cols.push({
					isDummyField: true,
					text: '',
					dataField: 'dragHandle',
					formatter: (cell, row) => {
						return <DragHandle rowClass={`dt-row-${row.id}`} data={row} onStart={onRowDragStart} onDrop={onRowDrop} />;
					},
					headerStyle: () => {
						return {
							width: 30,
						};
					},
					style: {
						verticalAlign: 'middle',
					},
				});
			}
		}
		//shine tovch hiij baina
		if (isMore) {
			if (config.footer) {
				cols.push({
					isDummyField: true,
					text: '',
					headerFormatter: (column, index, components) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 3 }}
								className="checkbox-light"
								checked={allCheckValue}
								onChange={(e) => onCheckableHandler(e, null, index, 'allCheck')}
							/>
						);
					},
					dataField: 'checkable',
					formatter: (cell, row, rowIndex) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 4 }}
								className="checkbox-light"
								checked={row.checkable || false}
								onChange={(e) => onCheckableHandler(e, row.id, rowIndex, '')}
							/>
						);
					},
					footer: '',
					headerStyle: () => {
						return {
							width: 50,
							verticalAlign: 'middle',
							textAlign: 'center',
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			} else {
				cols.push({
					isDummyField: true,
					text: '1',
					dataField: 'checkable',
					headerFormatter: (column, index, components) => {
						return null;
					},
					formatter: (cell, row, rowIndex) => {
						return (
							<Button
								style={{
									color: '#ff4900',
									boxShadow: '0 0 5px 0 rgb(0 0 0 / 5%) !important',
									border: 'solid 0.5px #ff4900',
									borderRadius: 6,
									height: 25,
									minWidth: 25
								}}
								onClick={onContextMenu}
							>
								<MoreVert className="w-15" />
							</Button>
						);
					},
					headerStyle: () => {
						return {
							maxWidth: 25,
							verticalAlign: 'middle',
							textAlign: 'center',
							paddingLeft: 0,
							paddingRight: 0,
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			}
		}

		if (checkable) {
			if (config.footer) {
				cols.push({
					isDummyField: true,
					text: '',
					headerFormatter: (column, index, components) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 3 }}
								className="checkbox-light"
								checked={allCheckValue}
								onChange={(e) => onCheckableHandler(e, null, index, 'allCheck')}
							/>
						);
					},
					dataField: 'checkable',
					formatter: (cell, row, rowIndex) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 4 }}
								className="checkbox-light"
								checked={row.checkable || false}
								onChange={(e) => onCheckableHandler(e, row.id, rowIndex, '')}
							/>
						);
					},
					footer: '',
					headerStyle: () => {
						return {
							width: 50,
							verticalAlign: 'middle',
							textAlign: 'center',
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			} else {
				cols.push({
					isDummyField: true,
					text: '1',
					dataField: 'checkable',
					headerFormatter: (column, index, components) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 3 }}
								className="checkbox-light"
								checked={allCheckValue}
								onChange={(e) => onCheckableHandler(e, null, index, 'allCheck')}
							/>
						);
					},
					formatter: (cell, row, rowIndex) => {
						return (
							<Checkbox
								checkedIcon={<BpCheckedIcon />}
								icon={<BpIcon />}
								style={{ padding: 4 }}
								className="checkbox-light"
								checked={row.checkable || false}
								onChange={(e) => onCheckableHandler(e, row.id, rowIndex, '')}
							/>
						);
					},
					headerStyle: () => {
						return {
							width: 50,
							verticalAlign: 'middle',
							textAlign: 'center',
						};
					},
					style: {
						verticalAlign: 'middle',
						textAlign: 'center',
					},
				});
			}
		}

		if (showOrdering) {
			cols.push({
				isDummyField: true,
				text: '№',
				dataField: 'dt-row-order-number',
				formatter(cell, row, rowIndex) {
					return rowIndex + 1;
				},
				csvFormatter(cell, row, rowIndex) {
					return rowIndex + 1;
				},
				headerStyle: () => {
					return {
						width: 50,
					};
				},
				headerAlign: 'center',
				style: {
					textAlign: 'right',
				},
			});
		}

		for (const col of columns) {
			if (!isToolkit && col.colVisible === false) {
				//
			} else {
				cols.push({
					...col,
				});
			}
		}

		return cols;
	};

	const checkSpecialChars = (specialChars, string) => {
		return specialChars.includes(string);
	};

	const handlerOnSelect = (row, isSelect, rowIndex, e) => {
		onSelect?.(row, isSelect, rowIndex, e);
	};

	const handlerOnSelectAll = (isSelect, rows, e) => {
		onSelectAll?.(isSelect, rows, e);
	};

	const selectRow = {
		mode: selectMode,
		clickToSelect: true,
		hideSelectColumn: !isSelect,
		selectColumnPosition: selectPosition,
		classes: 'dtable-selected',
		style: { backgroundColor: 'rgba(244, 81, 107, 0.5)' },
		onSelect: (row, isSelect, rowIndex, e) => {
			handlerOnSelect(row, isSelect, rowIndex, e);
		},
		onSelectAll: (isSelect, rows, e) => {
			handlerOnSelectAll(isSelect, rows, e);
		},
		clickToEdit: config.isTableEdit,
	};

	const cellEdit = cellEditFactory({
		mode: 'click',
		blurToSave: config.blurToSave,
	});

	const handleColumnsOpen = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleColumnsClose = () => {
		setOpen(false);
	};

	const handleExportExcelClick = () => {
		excelRef.current.handleDownload()
	}

	const handerRangePicker = (dates) => {
		setDate(dates)
		if (dates && dates?.length > 0 && dates[0]?.startDate && dates[0]?.endDate) {
			const startDate = new Date(dates[0]?.startDate).getTime()
			const endDate = new Date(dates[0]?.endDate).getTime()
			if (startDate > endDate) {
				showMessage(t('busManagement.error.validEndDate'))
			} else {
				getUserInteraction({}, searchValue, dates);
			}
		}
	};

	const pageStyle = `
        @page {
            size: 300mm 500mm;
        }

        @media all {
            .pagebreak {
                display: none;
            }
        }

        @media print {
            .pagebreak {
                page-break-before: always;
            }
        }
        `;

	return (
		<PaginationProvider pagination={paginationFactory(pgOptions)}>
			{({ paginationProps, paginationTableProps }) => (
				<div style={config.tableMarginLess ? {} : { marginBottom: 15, marginTop: 15 }}>
					<DndProvider backend={HTML5Backend}>
						<ToolkitProvider
							keyField="id"
							data={getTableData()}
							columns={getAllColumns(true)}
							exportCSV={{
								fileName: config.excelFileName?.replaceAll(/ /g, "_") + '.xlsx',
								exportAll: false,
								blobType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
							}}
							csvExport="true"
							columnToggle
						>
							{
								props => (
									<div>
										<div style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											marginBottom: 10,
										}}>
											<SizePerPageDropdownStandalone
												className={`custom-size-per-page ${!config.showPagination ? 'height-0' : ''}`}
												{...paginationProps}
												sizePerPage={paginationProps.sizePerPage}
												hidden={!config.showPagination}
											/>
											{
												config.showLeftButton
													?
													<button
														className={config.leftButtonClassName}
														style={config.leftButtonStyle}
														onClick={onLeftButtonClick}
													>
														{
															config.leftButtonIcon
																?
																<>
																	{config.leftButtonIcon}
																	<span className='ml-2'>
																		{config.leftButtonText}
																	</span>
																</>
																:
																config.leftButtonText
														}
													</button>
													: null
											}
											{
												config.datePicker &&
												<>
													<div className='w-25 text-right fs-12 font-pinnacle-demibold pe-2'>
														{t('common.date')}
													</div>
													<div className='w-50 text-center'>
														<div className='col-12'>
															<DatePickerRange
																onChange={(val) => handerRangePicker(val)}
																firstPlaceHolder={t('busManagement.start')}
																lastPlaceHolder={t('busManagement.end')}
																selectedStartDate={date && date.length > 0 ? date[0]?.startDate : null}
																selectedEndDate={date && date.length > 0 ? date[0]?.endDate : null}
															/>
														</div>
													</div>
												</>
											}
											<div className={config.datePicker ? "w-25 text-right" : "w-100 text-right"}>
												{
													config.excelExport
														?
														<MyExportCSV
															showOrdering
															query={searchValue}
															totalSize={paginationProps.totalSize}
															columns={getColumns()}
															data={getTableData()}
															{...props.csvProps}
															footer={propsConfig?.footer || false}
															filename={config.excelFileName?.replaceAll(/ /g, "_") || new Date().toString()}
															url={excelExportUrl}
															params={exportExportParams}
														/>
														: null
												}
												{
													config.printButton
														?
														<ReactToPrint
															trigger={() => (
																<button
																	className="btn m-btn m-btn--icon m-btn--icon-only p-1"
																	style={{
																		backgroundColor: '#ff5b1d',
																		boxShadow: '0 2px 10px 0 #ff5b1d',
																		border: 'none',
																		width: '33px',
																		height: '33px',
																		alignItems: 'center',
																		marginRight: '0.5rem',
																		borderRadius: '3px'
																	}}
																>
																	<i
																		className="la la-print"
																		style={{
																			fontSize: '22px',
																			color: '#ffffff',
																		}}
																	/>
																</button>
															)}
															content={() => tableRef.current}
															pageStyle={pageStyle}
														/>
														: null
												}
												{
													config.columnButton
														?
														<div
															style={{
																display: 'contents',
															}}
														>
															<CustomToggleList
																{...props.columnToggleProps}
																anchorRef={anchorRef}
																open={open}
																handleToggle={handleColumnsOpen}
																handleClose={handleColumnsClose}
																onColToggle={onColumnToggle}
																csvExport="true"
															/>
														</div>
														: null
												}
											</div>
											{
												config.showFilter && (
													<Search
														value={searchValue}
														onSearch={handleSearch}
														setter={value => {
															setSearchValue(value)
															if (!value) {
																getUserInteraction({}, value, date)
															}
														}}
														onSubmit={(query) => {
															if (query && query.length > 0) {
																handleSearch()
															}
														}}
														locale={locale}
													/>
												)
											}
										</div>
										<BootstrapTable
											keyField="id"
											id='table-to-xls'
											ref={tableRef}
											{...props.baseProps}
											{...paginationTableProps}
											striped
											remote={remote}
											wrapperClasses={`table-responsive ${wrapperClassName}`}
											classes={`table custom-dt ${className}`}
											data={getTableData()}
											onTableChange={handleTableChange}
											noDataIndication={getNoDataText}
											defaultSorted={config.defaultSort}
											rowEvents={{ onContextMenu }}
											rowClasses={row => {
												return `dt-row-${row.id}`;
											}}
											selectRow={selectRow}
											filter={filterFactory()}
											cellEdit={cellEdit}
											columns={getColumns()}
											bootstrap4
										/>
									</div>
								)
							}
						</ToolkitProvider>
					</DndProvider>
					{config.showPagination && (
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div style={{ flex: 1 }}>
								<div style={{ color: '#62646e', fontSize: '14px' }}> Нийт {
									paginationProps.totalSize
								} илэрцийн {
										paginationProps.page == 1
											?
											1
											:
											((paginationProps.sizePerPage * paginationProps.page) - paginationProps.sizePerPage + 1)
									}-с { }
									{
										paginationProps.totalSize < (paginationProps.sizePerPage * paginationProps.page)
											?
											paginationProps.totalSize
											:
											paginationProps.sizePerPage * paginationProps.page
									}-г харуулж байна.
								</div>
								{/*<div style={{color: '#000', fontWeight: 500}}>{`${translations(locale).action.total} ${paginationProps.totalSize} ${translations(locale).action.value}`}</div>*/}
							</div>
							<PaginationLinks paginationProps={paginationProps} />
						</div>
					)}
				</div>
			)}
		</PaginationProvider>
	);
};

export default DTable;
