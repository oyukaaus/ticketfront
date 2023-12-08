import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import { NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
// import { SearchRounded } from '@mui/icons-material';
import classNames from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
// import { MENU_PLACEMENT } from 'constants.js';
// import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import showMessage from "../../../modules/message";
import { setLoading, setSelectedSchool } from '../../../utils/redux/action';

// const MENU_NAME = 'Schools';
const Schools = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        // placementStatus: { view: placement },
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);
    const { color } = useSelector((state) => state.settings);
    const { schools, selectedSchool } = useSelector((state) => state.schoolData);
    // const { showingNavMenu } = useSelector((state) => state.layout);
    const [searchValue, setSearchValue] = useState('');

    // const onToggle = (status, event) => {
    //     if (event && event.stopPropagation) event.stopPropagation();
    //     else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
    //     dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
    // };
    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
        // eslint-disable-next-line
    }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

    useEffect(() => {
        if (!selectedSchool || Object.keys(selectedSchool).length === 0) {
            showMessage(t('errorMessage.selectSchool'))
        }
    }, [])

    const onSearch = (nameKey) => {
        setSearchValue(nameKey)
    }

    const renderData = (obj) => {
        return (
            <li key={`schoolItem.${obj.id}`}
                className="py-2 border-bottom border-separator-light d-flex school-option" onClick={() => {
                    dispatch(setSelectedSchool(obj))
                    dispatch(setLoading(true));

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 100)
                    // 
                }}>
                <span className="label">{obj?.name}</span>
            </li>
        )
    }

    const SchoolsDropdownToggle = React.memo(
        React.forwardRef(({ onClick, expanded = false }, ref) => (
            <a
                ref={ref}
                href="#/"
                className="notification-button ms-5"
                data-toggle="dropdown"
                aria-expanded={expanded}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }}
            >
                <div className="position-relative d-inline-flex">
                    <div className='d-flex align-items-center'>
                        <img src='../img/system/school-icon.png' alt='school-icon' width={20} className='color-info me-1' />
                        <div className='pt-1'>
                            {selectedSchool && selectedSchool?.id ? selectedSchool.name : t('common.selectSchool')}
                        </div>
                    </div>
                </div>
                
            </a>
        ))
    );

    const SchoolsDropdownMenu = React.memo(
        React.forwardRef(({ style, className, labeledBy }, ref) => {
            return (
                <div ref={ref} style={style} className={classNames('dropdown-menu wide user-menu', className)} aria-labelledby={labeledBy}>
                    {/* search */}
                    {
                        schools && schools.length > 5 &&
                        <input type='text' value={searchValue} autoFocus className='school-search-input mb-1' placeholder={t('action.search')} onInput={(e) => onSearch(e.target.value)} />
                    }
                    <OverlayScrollbarsComponent
                        style={{ maxHeight: 250 }}
                        options={{
                            overflowBehavior: {
                                x: "hidden",
                                y: "scroll"
                            },
                            scrollbars: {
                                visibility: "auto",
                                autoHide: "never",
                                dragScrolling: false,
                                clickScrolling: false,
                                touchSupport: true,
                                snapHandle: false
                            },
                        }}
                    >
                        <ul className="list-unstyled border-last-none">
                            {schools && schools.map((schoolObj) => (
                                searchValue && searchValue.length > 0
                                    ?
                                    schoolObj.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                                    renderData(schoolObj)
                                    :
                                    renderData(schoolObj)
                            ))}
                        </ul>
                    </OverlayScrollbarsComponent>
                </div>
            );
        })
    );

    if (schools && schools.length > 0) {
        return (
            <Dropdown
                as="li"
                bsPrefix="list-inline-item"
                // onToggle={onToggle}
                // show={showingNavMenu === MENU_NAME}
                style={{ transform: 'translate(0px, 0px)' }}
            >
                <Dropdown.Toggle as={SchoolsDropdownToggle} />
                <Dropdown.Menu
                    className={window.innerWidth < 768 ? 'school-nav-phone mt-5' : 'mt-5'}
                    style={{ maxHeight: 300, transform: 'translate(209px, 54px) !important' }}
                    as={SchoolsDropdownMenu}
                />
            </Dropdown>
        );
    } else {
        return <></>;
    }
};
export default React.memo(Schools);
