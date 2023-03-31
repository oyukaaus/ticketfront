import React from 'react';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
// import { useIntl } from 'react-intl';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
// import { DashboardOutlined } from "@material-ui/icons";
// import { USE_MULTI_LANGUAGE } from 'config.js';
import {useTranslation} from "react-i18next";

const SidebarMenuItems = React.memo(({ menuItems = [] }) =>
  menuItems.map((item, index) => <SidebarMenuItem key={`menu.${item.path}.${index}`} id={item.path} item={item} />)
);
SidebarMenuItems.displayName = 'SidebarMenuItems';

const SidebarMenuItem = ({ item, id }) => {
  const { pathname } = useLocation();
  // const { formatMessage: f } = useIntl();
  const { t } = useTranslation();

  const isActive = item.path.startsWith('#') ? false : pathname === item.path || pathname.indexOf(`${item.path}/`) > -1;

  const getLabel = (icon, label) => (
    <>
      {icon && icon == 'dashboard' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/dashboard.png'/>
        </>
      )}
      {icon && icon == 'invoice' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/invoice.png'/>
        </>
      )}
      {icon && icon == 'discount' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/discount.png'/>
        </>
      )}
      {icon && icon == 'income' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/income.png'/>
        </>
      )}
      {icon && icon == 'search' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/search.png'/>
        </>
      )}
      {icon && icon == 'ticket' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/ticket.png'/>
        </>
      )}
      {icon && icon == 'settings' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/settings.png'/>
        </>
      )}
      {icon && icon == 'shop' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/shop.png'/>
        </>
      )}
      {icon && icon == 'menu' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/menu.png'/>
        </>
      )}
      {icon && icon == 'service' && (
        <>
          <img alt='icon' width={18} className='me-3' src='../img/system/service.png'/>
        </>
      )}
      {icon && icon == 'send' && (
        <>
          <CsLineIcons icon={icon} className="cs-icon icon" />{' '}
        </>
      )}
      <span className="label">{t(label)}</span>
    </>
  );

  if (item.subs) {
    return (
      <li>
        <NavLink to={item.path} className='outside' data-bs-target={item.path}>
          {getLabel(item.icon, item.label)}
        </NavLink>
        <ul>
          <SidebarMenuItems menuItems={item.subs} />
        </ul>
      </li>
    );
  }
  if (item.isExternal) {
    return (
      <li key={id}>
        <a href={item.path} target="_blank" rel="noopener noreferrer">
          {getLabel(item.icon, item.label)}
        </a>
      </li>
    );
  }
  return (
    <li>
      <NavLink to={item.path} className={classNames({ active: isActive })} activeClassName="">
        {getLabel(item.icon, item.label)}
      </NavLink>
    </li>
  );
};

export default SidebarMenuItems;
