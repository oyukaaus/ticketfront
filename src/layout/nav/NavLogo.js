import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PATHS } from 'config.js';

const NavLogo = () => {
  return (
    <div className="logo position-relative" style={{minWidth: '180px'}}>
      <Link to={DEFAULT_PATHS.APP}>
      <img src='/img/ticket/logo.png' height='43' width='173' alt='logo'/>
      </Link>
    </div>
  );
};
export default React.memo(NavLogo);
