import React, { useEffect, useMemo } from 'react';
import { Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getMenuItems } from 'routing/helper';
import routesAndMenuItems from 'routes.js';
import SidebarMenuItems from './SidebarMenuItems';

const SidebarMenu = () => {
  const { isLogin, currentUser } = useSelector((state) => state.auth);
  const { selectedSchool } = useSelector(state => state.schoolData);
  const { useSidebar } = useSelector((state) => state.menu);

  useEffect(() => {
  }, [])

  const menuItemsMemo = useMemo(
    () =>
      getMenuItems({
        data: routesAndMenuItems, //getMenus(selectedSchool),
        isLogin,
        userRole: currentUser?.role,
        selectedSchool
      }),
    [isLogin, currentUser]
  );

  if (!useSidebar === true) {
    return <></>;
  }
  return (
    <Col xs="auto" className="side-menu-container">
      <ul className="sw-26 side-menu mb-0 primary" id="menuSide">
        <SidebarMenuItems menuItems={menuItemsMemo} />
      </ul>
    </Col>
  );
};
export default SidebarMenu;
