/* eslint-disable */
import React from 'react';

const PaginationLinks = ({
                             paginationProps
                         }) => {
    const { totalSize, sizePerPage, page, paginationSize } = paginationProps;

    const getPages = (page, pagesCount, paginationSize) => {
        const result = [];
        if (!page) {
            return result;
        }

        if (pagesCount === 1) {
            result.push(1);
            return result;
        }

        if (pagesCount < page) {
            return result;
        }

        if (pagesCount < paginationSize + 1) {
            for (let i = 1; i < pagesCount + 1; i++) {
                result.push(i);
            }
            return result;
        }

        if (page === 1) {
            for (let i = 1; i < paginationSize + 1; i++) {
                if (i < pagesCount) {
                    result.push(i);
                }
            }
            return result;
        }

        if (page === pagesCount) {
            for (let i = pagesCount - paginationSize + 1; i <= pagesCount; i++) {
                if (i <= pagesCount) {
                    result.push(i);
                }
            }
            return result;
        }

        const shiftCount = Math.floor(paginationSize / 2);
        if (shiftCount < 1) {
            result.push(page);
            return result;
        }

        //
        if (page < shiftCount + 2) {
            for (let i = 1; i < paginationSize + 1; i++) {
                result.push(i);
            }
            return result;
        }

        if (pagesCount - page < shiftCount + 2) {
            for (let i = pagesCount - paginationSize; i < pagesCount + 1; i++) {
                result.push(i);
            }
            return result;
        }

        for (let i = page - shiftCount; i < page; i++) {
            if (i > 0) {
                result.push(i);
            }
        }
        result.push(page);
        for (let i = page + 1; i < page + shiftCount + 1; i++) {
            if (i <= pagesCount) {
                result.push(i);
            }
        }

        return result;
    };

    const pagesCount = Math.ceil(totalSize / sizePerPage);
    const pages = getPages(page, pagesCount, paginationSize);
    const handleFirstPage = ({ onPageChange }) => {
        onPageChange(1);
    };

    const handlePrevPage = ({ page, onPageChange }) => {
        onPageChange(page - 1);
    };

    const handleNextPage = ({ page, onPageChange }) => {
        if (page < pagesCount) {
            onPageChange(page + 1);
        }
    };

    const handleLastPage = ({ onPageChange }) => {
        onPageChange(pagesCount);
    };

    const handleSelectedPage = ({ onPageChange }, pageNum) => {
        onPageChange(pageNum);
    };

    const disabledClass = pagesCount > 1 ? "" : "disabled";

    const isFirst = page === 1;
    const isLast = page === pagesCount;

    return (
        <>
            {pagesCount < 2 && <></>}
            {pagesCount > 1 && (
                <>
                    <div className={`pagination-link d-flex flex-wrap mr-3 ${disabledClass}`}>
                        <a
                            onClick={() => handleFirstPage(paginationProps)}
                            className={`btn btn-icon btn-sm btn-white btn-pagination me-1 ${isFirst ? 'disabled' : ''}`}
                        >
                            <i className='la la-angle-double-left icon-xs'/>
                        </a>
                        <a
                            onClick={() => handlePrevPage(paginationProps)}
                            className={`btn btn-icon btn-sm btn-white btn-pagination me-1 ${isFirst ? 'disabled' : ''}`}
                        >
                            <i className="la la-angle-left icon-xs"/>
                        </a>

                        {page > 1 && (
                            <a className="btn btn-icon btn-sm border-0 btn-pagination me-1 inactive">
                                ...
                            </a>
                        )}
                        {pages.map((p) => (
                            <a
                                key={p}
                                onClick={() => handleSelectedPage(paginationProps, p)}
                                className={`btn btn-icon btn-sm border-0 btn-white px-0 btn-pagination ${
                                    page === p ? " btn-pagination active" : "inactive"
                                } me-1`}
                            >
                                {p}
                            </a>
                        ))}
                        {page < pagesCount && (
                            <a className="btn btn-icon btn-sm border-0 btn-pagination inactive">
                                ...
                            </a>
                        )}
                        <a
                            onClick={() => handleNextPage(paginationProps)}
                            className={`btn btn-icon btn-sm btn-white btn-pagination ms-1 ${isLast ? 'disabled' : ''}`}
                        >
                            <i className="la la-angle-right icon-xs"/>
                        </a>
                        <a
                            id='double-right'
                            onClick={() => handleLastPage(paginationProps)}
                            className={`btn btn-icon btn-sm btn-white btn-pagination ms-1 ${isLast ? 'disabled' : ''}`}
                        >
                            <i className="la la-angle-double-right icon-xs"/>
                        </a>
                    </div>
                </>
            )}
        </>
    )
}

export default PaginationLinks;