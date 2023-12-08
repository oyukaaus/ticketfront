import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLayout from 'hooks/useLayout';
import Nav from 'layout/nav/Nav';
import SidebarMenu from 'layout/nav/sidebar-menu/SidebarMenu';
import routesAndMenuItems from "../routes";

const Layout = ({ children }) => {
  useLayout();
console.log('child: ', children)
  const { isLogin } = useSelector((state) => state.auth);
  const { selectedSchool } = useSelector(state => state.schoolData);

  const { pathname } = useLocation();
  const [hideSideMenu, setHideSideMenu] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  const getMenus = () => {
    let menus = [];

    if (selectedSchool && selectedSchool?.roleCodes && isLogin) {
      if (selectedSchool?.roleCodes.indexOf('ROLE_DOCTOR') > -1) {
        if (selectedSchool?.roleCodes.indexOf('ROLE_TEACHER') > -1) {
          menus = routesAndMenuItems.teacherAndDoctorSidebarItems;
        } else {
          menus = routesAndMenuItems.doctorSidebarItems;
        }        
      } else if (selectedSchool?.roleCodes.indexOf('ROLE_TEACHER') > -1) {
        menus = routesAndMenuItems.teacherSidebarItems;
      }
    } else {
      menus = routesAndMenuItems.sidebarItems
    }
    return menus;
  }


  // routesAndMenuItems.sidebarItems;

  useEffect(() => {
    document.documentElement.click();
    window.scrollTo(0, 0);

    const menus = getMenus();
    if (menus && menus.length > 0) {
      let isHidden = false;
      let isHideNav = false;
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].subs && menus[i].subs.length > 0) {
          const { subs } = menus[i];
          for (let s = 0; s < subs.length; s++) {
            if (subs[s].hideSideBar && pathname == (menus[i].path + subs[s].path)) {
              isHidden = true;
              setHideSideMenu(true);
            }
            if (subs[s].hideNav && pathname == (menus[i].path + subs[s].path)) {
              isHideNav = true;
              setHideNav(true);
            }
          }
        }
      }

      if (!isHidden) {
        setHideSideMenu(false)
      }
      if (!isHideNav) {
        setHideNav(false);
      }
    }
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <>
      {
        hideNav
          ?
          <>
            {/* <Container> */}
            <Row className="h-100 gx-0">
              {
                hideSideMenu
                  ?
                  <></>
                  :
                  <SidebarMenu />
              }
              <Col className="h-100" id="contentArea">
                {children}
              </Col>
            </Row>
            {/* </Container> */}
          </>
          :
          <>
            <Nav />
            <main>
              <Row className="h-100">
                {/* {
                  hideSideMenu
                    ?
                    <></>
                    :
                    <SidebarMenu />
                } */}
                <Col className="h-100" id="contentArea">
                  {children}
                </Col>
              </Row>
            </main>
          </>
      }
      {/*<Footer />*/}
      {/* <RightButtons /> */}
    </>
  );
};

export default React.memo(Layout);
