import React from 'react';
import classNames from 'classnames';
// import { useDispatch, useSelector } from 'react-redux';
// import {Dropdown} from "react-bootstrap";
// import {MENU_BEHAVIOUR} from 'constants.js';
// import { settingsChangeColor } from 'settings/settingsSlice';
// import styled from 'styled-components';
// import SlideshowIcon from '@mui/icons-material/Slideshow';
// import { menuChangeBehaviour } from './main-menu/menuSlice';
// import IconMenuChats from './chat/chat';
// import IconMenuNotifications from './notifications/Notifications';
// import SearchModal from './search/SearchModal';
// import Select from "../../modules/Form/Select";
// import {layoutShowingNavMenu} from "../layoutSlice";

// const NameStyle = styled.div`
//   color: #868aa8 !important;
// `;

// const roleContainer = {
//     height: '100%',
//     alignItems: 'center',
//     padding: '0 8px',
// }
// const roleStyle = {
//     border: '1px solid white',
//     borderRadius: 8,
//     color: '#fff',
//     padding: '5px 15px'
// }

// const NavUserMenuDropdownToggle = React.memo(
//     React.forwardRef(({ onClick, expanded = false, user = {} }, ref) => (
//         <a
//             style={roleStyle}
//             href="#/!"
//             ref={ref}
//             className="d-flex role position-relative"
//             data-toggle="dropdown"
//             aria-expanded={expanded}
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               onClick(e);
//             }}
//         >
//             <NameStyle><SlideshowIcon/></NameStyle>
//         </a>
//     ))
// );

// Dropdown needs access to the DOM of the Menu to measure it
const NavUserMenuDropdownMenu = React.memo(
    React.forwardRef(({ style, className }, ref) => {
        style.zIndex = '1100'
      return (
          <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
            {/*<NavUserMenuContent />*/}
          </div>
      );
    })
);

NavUserMenuDropdownMenu.displayName = 'NavUserMenuDropdownMenu';

// const MENU_NAME = 'NavRoleMenu';

const NavIconMenu = () => {
  // const { isLogin, currentUser } = useSelector((state) => state.auth);
  // const { pinButtonEnable, behaviour } = useSelector((state) => state.menu);
  // const { color } = useSelector((state) => state.settings);
  // const dispatch = useDispatch();
  // const [options, setOptions] = useState([])
  // const [selectedId, setSelectedId] = useState([])

  // const onPinButtonClick = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (pinButtonEnable) {
  //     dispatch(menuChangeBehaviour(behaviour === MENU_BEHAVIOUR.Pinned ? MENU_BEHAVIOUR.Unpinned : MENU_BEHAVIOUR.Pinned));
  //   }
  //   return false;
  // };
  // const onDisabledPinButtonClick = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

  // const onLightDarkModeClick = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   dispatch(settingsChangeColor(color.includes('light') ? color.replace('light', 'dark') : color.replace('dark', 'light')));
  // };
  // const [showSearchModal, setShowSearchModal] = useState(false);

  // const onSearchIconClick = (e) => {
  //   e.preventDefault();
  //   setShowSearchModal(true);
  // };

  // const onSelect = id => {
  //   setSelectedId(id);
  // };

  // const { showingNavMenu } = useSelector((state) => state.layout);

  // const onToggle = (status, event) => {
  //   if (event && event.stopPropagation) event.stopPropagation();
  //   else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
  //   dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
  // };

  return (
    <>
      <ul className="list-unstyled list-inline text-center menu-icons">
        {/* <li className="list-inline-item">
          <Dropdown as="div" bsPrefix="user-role-container d-flex" style={roleContainer} onToggle={onToggle} show={showingNavMenu === MENU_NAME} drop="down">
            <Dropdown.Toggle as={NavUserMenuDropdownToggle} user={currentUser} />
            <Dropdown.Menu
                as={NavUserMenuDropdownMenu}
                className="dropdown-menu dropdown-menu-end user-menu wide"
                popperConfig={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: () => {
                          if (window.innerWidth < 768) {
                            return [-84, 7];
                          }

                          return [-78, 7];
                        },
                      },
                    },
                  ],
                }}
            />
          </Dropdown>
        </li> */}
        {/*<li className="list-inline-item">*/}
        {/*  <a href="#/" onClick={onSearchIconClick}>*/}
        {/*    <CsLineIcons icon="search" size="18" />*/}
        {/*  </a>*/}
        {/*</li>*/}
        {/*<li className="list-inline-item">*/}
        {/*  <a*/}
        {/*    href="#/"*/}
        {/*    id="pinButton"*/}
        {/*    onClick={pinButtonEnable ? onPinButtonClick : onDisabledPinButtonClick}*/}
        {/*    className={classNames('pin-button', { disabled: !pinButtonEnable })}*/}
        {/*  >*/}
        {/*    <CsLineIcons icon="lock-on" size="18" className="unpin" />*/}
        {/*    <CsLineIcons icon="lock-off" size="18" className="pin" />*/}
        {/*  </a>*/}
        {/*</li>*/}
        {/*<li className="list-inline-item">*/}
        {/*  <a href="#/" id="colorButton" onClick={onLightDarkModeClick}>*/}
        {/*    <CsLineIcons icon="light-on" size="18" className="light" />*/}
        {/*    <CsLineIcons icon="light-off" size="18" className="dark" />*/}
        {/*  </a>*/}
        {/*</li>*/}
        {/* <IconMenuChats /> */}
        {/* <IconMenuNotifications /> */}
      </ul>
      {/*<SearchModal show={showSearchModal} setShow={setShowSearchModal} />*/}
    </>
  );
};

export default React.memo(NavIconMenu);
