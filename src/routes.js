import { lazy } from 'react';
// import { USER_ROLE } from 'constants.js';
import { DEFAULT_PATHS } from 'config.js';
import { trimEnd } from 'lodash';

const index = {
  home: lazy(() => import('views/general/dashboard/student/index')),
  index: lazy(() => import('views/general/ticket/index')),
  // home: lazy(() => import('views/general/home')),
  // index: lazy(() => import('views/general/index')),
};

const ticket = {
  index: lazy(() => import('views/general/ticket/index')),
  view: lazy(() => import('views/general/ticket/view')),
};

const admin = {
  index: lazy(() => import('views/general/admin-request/index')),
  view: lazy(() => import('views/general/admin-request/view')),
};

const appointment = {
  index: lazy(() => import('views/general/doctor/inspection/index')),
};
const doctorDashboard = {
  index: lazy(() => import('views/general/doctor/dashboard/index')),
};
const inspection = {
  index: lazy(() => import('views/general/doctor/inspection/index')),
};
const medicine = {
  index: lazy(() => import('views/general/doctor/medicine/index')),
};
// eslint-disable-next-line
const integratedGroup = {
  index: lazy(() => import('views/general/integrated-group/index')),
};
const dashboardTeacher = {
  index: lazy(() => import('views/general/dashboard/teacher/index')),
};
const dashboardGuardian = {
  index: lazy(() => import('views/general/dashboard/guardian/index')),
};
const dashboardStudent = {
  index: lazy(() => import('views/general/dashboard/student/index')),
};
const dashboardAttendance = {
  index: lazy(() => import('views/general/dashboard/attendance/index')),
};

const survey = {
  index: lazy(() => import('views/general/survey/index')),
  create: lazy(() => import('views/general/survey/create')),
  edit: lazy(() => import('views/general/survey/edit_1')),
  view: lazy(() => import('views/general/survey/view')),
  report: lazy(() => import('views/general/survey/report')),
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


    {
      path: `${appRoot}/appointment`,
      label: 'dashboard.appointment',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/appointment/index`,
      subs: [
        // { path: '/dashboard', label: 'dashboard.title', icon: 'dashboard', component: index.index },
        { path: '/index', label: 'dashboard.appointment', icon: 'appointment', component: appointment.index },
      ],
    },
    {
      path: `${appRoot}/survey`,
      label: 'dashboard.survey',
      icon: 'paper-plane',
      exact: true,
      redirect: true,
      to: `${appRoot}/survey/index`,
      subs: [
        { path: '/index', label: 'dashboard.survey', icon: 'send', component: survey.index },
        { path: '/create', label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.create },
        { path: '/view/:id', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.view },
        { path: '/view/:id/edit', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.edit },
        { path: '/view/:id/report', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.report },
      ],
    },
  ],
  doctorSidebarItems: [
    {
      path: `${appRoot}/home`,
      label: 'home.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/home/index`,
      subs: [{ path: '/index', label: 'home.title', icon: 'doctor', component: index.home }],
    },
    {
      path: `${appRoot}/appointment`,
      label: 'dashboard.appointment',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/appointment/index`,
      subs: [
        // { path: '/dashboard', label: 'dashboard.title', icon: 'dashboard', component: index.index },
        { path: '/index', label: 'dashboard.appointment', icon: 'appointment', component: appointment.index },
      ],
    },
    {
      path: `${appRoot}/doctor`,
      label: 'doctorsCorner.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/doctor/dashboard`,
      subs: [
        { path: '/dashboard', label: 'dashboard.title', icon: 'dashboard', component: doctorDashboard.index },
        { path: '/inspection', label: 'doctorsCorner.inspection', icon: 'duplicate', component: inspection.index },
        { path: '/medicine-registration', label: 'doctorsCorner.medicineRegistration', icon: 'edit', component: medicine.index },
      ],
    },
    {
      path: `${appRoot}/survey`,
      label: 'dashboard.survey',
      icon: 'paper-plane',
      exact: true,
      redirect: true,
      to: `${appRoot}/survey/index`,
      subs: [
        { path: '/index', label: 'dashboard.survey', icon: 'send', component: survey.index },
        { path: '/create', label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.create },
        { path: '/view/:id', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.view },
        { path: '/view/:id/edit', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.edit },
        { path: '/view/:id/report', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.report },
      ],
    },
  ],
  teacherAndDoctorSidebarItems: [
    {
      path: `${appRoot}/home`,
      label: 'home.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/home/index`,
      subs: [{ path: '/index', label: 'home.title', icon: 'dashboard', component: index.home }],
    },
    {
      path: `${appRoot}/appointment`,
      label: 'dashboard.appointment',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/appointment/index`,
      subs: [
        // { path: '/dashboard', label: 'dashboard.title', icon: 'dashboard', component: index.index },
        { path: '/index', label: 'dashboard.appointment', icon: 'appointment', component: appointment.index },
      ],
    },
    {
      path: `${appRoot}/doctor`,
      label: 'doctorsCorner.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/doctor/dashboard`,
      subs: [
        { path: '/dashboard', label: 'dashboard.title', icon: 'dashboard', component: doctorDashboard.index },
        { path: '/inspection', label: 'doctorsCorner.inspection', icon: 'duplicate', component: inspection.index },
        { path: '/medicine-registration', label: 'doctorsCorner.medicineRegistration', icon: 'edit', component: medicine.index },
      ],
    },
    {
      path: `${appRoot}/survey`,
      label: 'dashboard.survey',
      icon: 'paper-plane',
      exact: true,
      redirect: true,
      to: `${appRoot}/survey/index`,
      subs: [
        { path: '/index', label: 'dashboard.survey', icon: 'send', component: survey.index },
        { path: '/create', label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.create },
        { path: '/view/:id', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.view },
        { path: '/view/:id/edit', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.edit },
        { path: '/view/:id/report', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.report },
      ],
    },
  ],
  schoolSidebarItems: [
    {
      path: `${appRoot}/home`,
      label: 'home.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/home/index`,
      subs: [{ path: '/index', label: 'home.title', icon: 'dashboard', component: index.home }],
    },
    {
      path: `${appRoot}/dashboard`,
      label: 'managementDashboard.title',
      icon: 'send-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard/teacher`,
      subs: [
        { path: '/teacher', label: 'managementDashboard.teacher', icon: 'dashboard', component: dashboardTeacher.index },
        { path: '/student', label: 'managementDashboard.student', icon: 'dashboard', component: dashboardStudent.index },
        { path: '/guardian', label: 'managementDashboard.guardian', icon: 'dashboard', component: dashboardGuardian.index },
        { path: '/attendance', label: 'managementDashboard.attendance', icon: 'dashboard', component: dashboardAttendance.index },
      ],
    },
    {
      path: `${appRoot}/survey`,
      label: 'dashboard.survey',
      icon: 'paper-plane',
      exact: true,
      redirect: true,
      to: `${appRoot}/survey/index`,
      subs: [
        { path: '/index', label: 'dashboard.survey', icon: 'send', component: survey.index },
        { path: '/create', label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.create },
        { path: '/view/:id', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.view },
        { path: '/view/:id/edit', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.edit },
        { path: '/view/:id/report', exact: true, label: 'dashboard.survey', hideInMenu: true, icon: 'send', component: survey.report },
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
