import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_BEHAVIOUR, MENU_PLACEMENT } from 'constants.js';
import NavUserMenu from './NavUserMenu';
import NavLogo from './NavLogo';
import NavTicketSwitcher from './tickets/tickets';
import NavTicketMobile from './tickets/ticket-mobile';
import { menuChangeAttrMenuAnimate, menuChangeCollapseAll } from './main-menu/menuSlice';

const DELAY = 80;

const Nav = () => {
    const dispatch = useDispatch();
    const [isPhoneScreen, setIsPhoneScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsPhoneScreen(window.innerWidth <= 894);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const {  placementStatus, behaviourStatus, attrMobile, menuPadding } = useSelector((state) => state.menu);
    const mouseActionTimer = useRef(null);
    // Vertical menu semihidden state showing
    // Only works when the vertical menu is active and mobile menu closed
    const onMouseEnterDelay = () => {
        if (placementStatus.placementHtmlData === MENU_PLACEMENT.Vertical && behaviourStatus.behaviourHtmlData === MENU_BEHAVIOUR.Unpinned && attrMobile !== true) {
            dispatch(menuChangeCollapseAll(false));
            dispatch(menuChangeAttrMenuAnimate('show'));
        }
    };

    // Delayed one that hides or shows the menu. It's required to prevent collapse animation getting stucked
    const onMouseEnter = () => {
        if (mouseActionTimer.current) clearTimeout(mouseActionTimer.current);

        mouseActionTimer.current = setTimeout(() => {
            onMouseEnterDelay();
        }, DELAY);
    };
    
    const onMouseLeaveDelay = () => {
        if (placementStatus.placementHtmlData === MENU_PLACEMENT.Vertical && behaviourStatus.behaviourHtmlData === MENU_BEHAVIOUR.Unpinned && attrMobile !== true) {
            dispatch(menuChangeCollapseAll(true));
            dispatch(menuChangeAttrMenuAnimate('hidden'));
        }
    };

    const onMouseLeave = () => {
        if (mouseActionTimer.current) clearTimeout(mouseActionTimer.current);
        mouseActionTimer.current = setTimeout(() => {
            onMouseLeaveDelay();
        }, DELAY);
    };

    return (
        <div id="nav" className='nav-container d-flex' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background: '#FD7845' }}>
            <div
                className="new-content d-flex align-items-center"
                style={placementStatus.placementHtmlData === MENU_PLACEMENT.Horizontal && menuPadding ? { paddingRight: menuPadding } : {}}
            >
                <NavLogo className='new-logo d-flex  justify-content-start' />
                <div className='new-menu d-flex justify-content-start align-items-center'>
                    {isPhoneScreen ? <NavTicketMobile /> : <NavTicketSwitcher className='new-switcher align-items-center d-flex  ' />}
                </div>
                <div className='new-user-menu d-flex align-items-center justify-content-end '>
                    <NavUserMenu />
                </div>
            </div>
        </div>
    );
};
export default React.memo(Nav);
