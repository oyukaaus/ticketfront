import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PATHS } from 'config.js';

const NavLogo = () => {
  return (
    <div className="logo position-relative" style={{minWidth: '150px'}}>
      <Link to={DEFAULT_PATHS.APP}>
      <img src='/img/ticket/icon/eschool-logo.png' alt='logo'/>
      </Link>
    </div>
  );
};
export default React.memo(NavLogo);
