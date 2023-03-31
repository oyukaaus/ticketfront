/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { cloneDeep } from 'lodash';
import Dropdown from '../Form/Dropdown';

/** Note: This file is not being used!!!. */

const CustomCell = withStyles({
    cell: {
        padding: 0,
    }
})(({ classes, children }) => (
    <TableCell className={classes['cell']}>
        {children}
    </TableCell>
));

const defaultConfig = {
    showOrdering: true,
    showPagination: true,
    showFilter: true,
    fetchData: false,
    url: '',
    params: {},
    pageNumber: 0,
    pageLengths: [ 10, 25, 50, 100 ],
    onFetchSuccess: () => {
        return [];
    },
}


const DataTable = ({
    data = [],
    columns = [],
    config: propsConfig = {},
    contextMenus = [],
    onContextMenuItemClick,
                   }) => {

    const config = {...defaultConfig, ...propsConfig};

    const [ filterValue, setFilterValue ] = useState('');
    const [ pageLength, setPageLength ] = useState(10);
    const [ pageNumber, setPageNumber ] = useState(0);

    useEffect(() => {
        if (config.pageLengths?.length) {
            setPageLength(config.pageLengths[0]);
        }
    }, [config.pageLengths]);

    useEffect(() => {
        if (config.pageNumber !== pageNumber) {
            setPageNumber(config.pageNumber);
        }
    }, [config.pageNumber]);

    useEffect(() => {
        // Note: it triggers on initial rendering.
    }, [pageLength]);

    const filterRecords = () => {
        if (filterValue) {
            const cloned = cloneDeep(data);
            const val = filterValue.toLowerCase();
            return cloned.filter(record => {
                for (const column of columns) {
                    if (record.hasOwnProperty(column.key)) {
                        if (typeof record[column.key] === 'string' && record[column.key].toLowerCase().includes(val)) {
                            return true
                        }
                    }
                }
                return false;
            });
        }
        return data;
    };

    const getLengthMenuOptions = () => {
        if (config.pageLengths.length) {
            return config.pageLengths.map(length => {
                return {
                    value: length,
                    text: length.toString(),
                }
            })
        }
        return [];
    }

    const onPageLengthChange = value => {
        if (value) {
            setPageLength(value);
        }
    }

    const fetchData = async () => {
        const params = {
            page: config.pageNumber,
            ...config.params
        }
        const stringParams = new URLSearchParams(params).toString();
        const res = await fetch(`${config.url}?${stringParams}`);
        const data = await res.json();
        config.onFetchSuccess(data);
    }

    return (
        <div>
            <button
                onClick={fetchData}
            >
                fetch
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: 80 }}>
                    <Dropdown
                        options={getLengthMenuOptions()}
                        disableClearable="true"
                        value={pageLength}
                        onChange={onPageLengthChange}
                    />
                </div>
                {
                    config?.showFilter && (
                        <input
                            style={{ width: 200 }}
                            className='form-control'
                            placeholder='Search...'
                            value={filterValue}
                            onChange={e => setFilterValue(e.target.value)}
                        />
                    )
                }
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            {
                                config?.showOrdering !== false
                                ?   <TableCell>{'№'}</TableCell>
                                :   <TableCell style={{ width: 0, padding: 0 }}>{''}</TableCell>

                            }
                            {
                                columns.map((col, index) => {
                                    return (
                                        <TableCell key={index}>{col.title}</TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filterRecords().map((record, index) => {

                                const availableContextMenus = [];

                                if (contextMenus?.length && record?.contextMenuKeys?.length) {
                                    const itemContextMenus = record.contextMenuKeys;
                                    for (const menu of contextMenus) {
                                        if (itemContextMenus.includes(menu.key)) {
                                            availableContextMenus.push(menu);
                                        }
                                    }
                                }

                                const cells = [];
                                const cmId = `cm_${index}`;

                                if (availableContextMenus.length > 0) {

                                    if (config?.showOrdering !== false) {
                                        cells.push(
                                            <CustomCell key={`order_${index}`}>
                                                <div>{index + 1}</div>
                                                <ContextMenu id={cmId} className={'dt-cm-wrapper'}>
                                                    {
                                                        availableContextMenus.map(menu => {
                                                            return (
                                                                <MenuItem
                                                                    className={'dt-cm-item'}
                                                                    key={`${cmId}_${menu.key}`}
                                                                    onClick={() => {onContextMenuItemClick?.(record.id, menu.key, record)}}
                                                                >
                                                                    {menu.title}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    }
                                                </ContextMenu>
                                            </CustomCell>
                                        )
                                    } else {
                                        cells.push(
                                            <CustomCell  key={`contextMenus_${index}`}>
                                                <ContextMenu id={cmId} className={'dt-cm-wrapper'}>
                                                    {
                                                        availableContextMenus.map(menu => {
                                                            return (
                                                                <MenuItem
                                                                    className={'dt-cm-item'}
                                                                    key={`${cmId}_${menu.key}`}
                                                                    onClick={() => {onContextMenuItemClick?.(record.id, menu.key, record)}}
                                                                >
                                                                    {menu.title}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    }
                                                </ContextMenu>
                                            </CustomCell>
                                        )
                                    }
                                } else {
                                    if (config?.showOrdering !== false) {
                                        cells.push(
                                            <CustomCell key={`order_${index}`}>
                                                <div>{index + 1}</div>
                                            </CustomCell>
                                        )
                                    } else {
                                        cells.push(<CustomCell key={`filler_${index}`}/>)
                                    }
                                }

                                for (let colIndex = 0; colIndex < columns.length; colIndex++) {
                                    const col = columns[colIndex];
                                    cells.push(
                                        <CustomCell key={`cell_${index}_${colIndex}`} align={col.align}>
                                            <div>
                                                {record?.[col.key] || ''}
                                            </div>
                                        </CustomCell>
                                    )
                                }

                                if (availableContextMenus.length > 0) {
                                    return (
                                        <ContextMenuTrigger key={index} id={cmId} renderTag={'tr'}>
                                            {cells}
                                        </ContextMenuTrigger>
                                    )
                                }

                                return (
                                    <TableRow key={index}>
                                        {cells}
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default DataTable;