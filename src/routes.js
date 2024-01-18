import { lazy } from 'react';
// import { USER_ROLE } from 'constants.js';
import { DEFAULT_PATHS } from 'config.js';

const index = {
  home: lazy(() => import('views/general/ticket/index')),
  index: lazy(() => import('views/general/ticket/index')),
};

const ticket = {
  index: lazy(() => import('views/general/ticket/index')),
  view: lazy(() => import('views/general/ticket/view')),
};

const admin = {
  index: lazy(() => import('views/general/admin-request/index')),
  view: lazy(() => import('views/general/admin-request/view')),
};

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;
const routesAndMenuItems = {
  defaultMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      to: `${appRoot}/home`,
    },
  ],
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}`,
    },
  ],
  
  teacherSidebarItems: [
    {
      path: `${appRoot}/home`,
      label: 'home.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/ticket/index`,
      subs: [{ path: '/index', label: 'home.title', icon: 'dashboard', component: index.home }],
    },
    {
      path: `${appRoot}/ticket`,
      label: 'home.ticket',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/ticket/index`,
      subs: [
        { path: '/index', label: 'home.ticket', icon: 'ticket', component: ticket.index },
        { path: '/view/:id', exact: true, label: 'home.ticket', hideInMenu: true, icon: 'send', component: ticket.view },
      ],
    },
  ],
  adminSidebarItems: [
    {
      path: `${appRoot}/home`,
      label: 'home.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/ticket/index`,
      subs: [{ path: '/index', label: 'home.title', icon: 'dashboard', component: index.home }],
    },
    {
      path: `${appRoot}/ticket`,
      label: 'home.ticket',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/ticket/index`,
      subs: [
        { path: '/index', label: 'home.ticket', icon: 'ticket', component: ticket.index },
        { path: '/view/:id', exact: true, label: 'home.ticket', hideInMenu: true, icon: 'send', component: ticket.view },
      ],
    },
    {
      path: `${appRoot}/admin`,
      label: 'home.admin',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/admin/index`,
      subs: [
        { path: '/index', label: 'home.admin', icon: 'admin', component: admin.index },
        { path: '/view/:id', exact: true, label: 'home.admin', hideInMenu: true, icon: 'send', component: admin.view },
      ],
    },
  ],
  sidebarItems: [
    {
      path: `${appRoot}/home`,
      label: 'home.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/home/index`,
      subs: [{ path: '/index', label: 'home.title', icon: 'dashboard', component: index.home }],
    },
  ],
};

export default routesAndMenuItems;
