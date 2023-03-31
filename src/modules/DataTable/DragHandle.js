/* eslint-disable */
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DragIcon from '@material-ui/icons/DragIndicatorRounded';

const DragHandle = ({
    rowClass,
    data,
    onStart,
    onDrop,
}) => {
    const [ { isOver }, drop ] = useDrop({
        accept: 'row',
        drop(item, monitor) {
            if (item?.id && data?.id && item.id !== data.id) {
                const position = getDropPosition(monitor.getClientOffset());
                if (position) {
                    const params = {
                        itemId: item?.id || null,
                        targetId: data?.id || null,
                        position,
                    }
                    onDrop?.(params);
                }
            }
        },
        hover(item, monitor) {
            if (item?.id && data?.id && item.id !== data.id) {
                const clientOffset = monitor.getClientOffset();
                const position = getDropPosition(clientOffset);
                const row = document.querySelector(`.${rowClass}`);
                if (position === 'top') {
                    row.classList.remove('dt-drag-hover-bottom');
                    row.classList.add('dt-drag-hover-top');
                } else if (position === 'bottom') {
                    row.classList.remove('dt-drag-hover-top');
                    row.classList.add('dt-drag-hover-bottom');
                }
            }
        },
        collect: (monitor) => {
            return {
                isOver: monitor.isOver(/*{ shallow: true }*/),
                item: monitor.getItem(),
            }
        }
    });

    if (!isOver) {
        const row = document.querySelector(`.${rowClass}`);
        if (row) {
            row.classList.remove('dt-drag-hover-top');
            row.classList.remove('dt-drag-hover-bottom');
        }
    }

    const [ , drag, preview ] = useDrag(() => {
        return {
            type: 'row',
            item: () => {
                onStart?.(data);
                return {
                    id: data.id
                };
                // you can return null to cancel Dragging.
                // return null;
            },
            // collect(monitor) {
            //     return {
            //         isDragging: monitor.isDragging(),
            //     }
            // }
            // end: () => {}
        }
    });

    const getDropPosition = clientOffset => {
        const row = document.querySelector(`.${rowClass}`);
        if (row) {
            const hoverBoundingRect = row.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (hoverClientY < hoverMiddleY) {
                return 'top';
            }
            if (hoverClientY > hoverMiddleY) {
                return 'bottom';
            }
        }
        return null;
    }

    const ref = instance => {
        drag(instance);
        const row = document.querySelector(`.${rowClass}`);
        if (row) {
            drop(row);
            preview(row);
        } else {
            preview(instance)
        }
    }

    return (
        <div ref={ref}>
            <DragIcon
                style={{ marginLeft: -4, cursor: 'grab' }}
            />
        </div>
    )
};

export default DragHandle;
