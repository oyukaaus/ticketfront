import { IS_AUTH_GUARD_ACTIVE, DEFAULT_PATHS } from 'config.js';

const userHasRole = (routeRoles, userRole) => {
  if (!userRole) return false;
  return routeRoles.includes(userRole);
};

const clearRoute = (route) => {
  const item = {};
  ['path', 'to', 'exact', 'component', 'redirect'].forEach((key) => {
    if (route[key]) item[key] = route[key];
  });
  return item;
};
const clearMenuItem = (menuItem) => {
  const item = {};
  ['path', 'label', 'icon', 'isExternal', 'subs', 'mega', 'megaParent'].forEach((key) => {
    if (menuItem[key]) item[key] = menuItem[key];
  });
  return item;
};
const clearFlattedMenuItem = (menuItem) => {
  const item = {};
  ['path', 'label', 'isExternal'].forEach((key) => {
    if (menuItem[key]) item[key] = menuItem[key];
  });
  return item;
};

export const convertToRoutes = ({
  data = [],
  isLogin = false,
  userRole = null,
  authGuardActive = IS_AUTH_GUARD_ACTIVE,
  unauthorizedPath = DEFAULT_PATHS.UNAUTHORIZED,
  loginPath = DEFAULT_PATHS.LOGIN,
  invalidAccessPath = DEFAULT_PATHS.INVALID_ACCESS,
  noLayout = false,
  selectedSchool = null
}) => {
  let items = [];
  if (selectedSchool && selectedSchool.roleCodes) {
    if (selectedSchool.roleCodes.indexOf('ROLE_DOCTOR') > -1) {
      if (selectedSchool.roleCodes.indexOf('ROLE_TEACHER') > -1) {
        items = [...data.teacherAndDoctorSidebarItems];
      } else {
        items = [...data.doctorSidebarItems];
      }
    } else if (selectedSchool.roleCodes.indexOf('ROLE_TEACHER') > -1) {
      items = [...data.teacherSidebarItems];
    } else {
      items = [...data.sidebarItems];
    }
  } else {
    items = [...data.sidebarItems];
  }  
  const routes = [];
  return () => {
    const itemMapper = (item) => {
      const tempItem = { ...item };
      if (item.hideInRoute) return itemMapper({});

      if (item.subs) tempItem.exact = true;

      /* Authentication Guard */
      if (authGuardActive) {
        if (tempItem.roles) tempItem.protected = true;
        if (tempItem.publicOnly) {
          delete tempItem.roles;
          delete tempItem.protected;
        }
        if (tempItem.protected) {
          if (!isLogin) {
            tempItem.redirect = true;
            tempItem.to = {
              pathname: loginPath,
              state: { from: tempItem.path },
            };
          } else if (tempItem.roles) {
            if (!userHasRole(tempItem.roles, userRole)) {
              tempItem.redirect = true;
              tempItem.to = {
                pathname: unauthorizedPath,
                state: { from: tempItem.path },
              };
            }
          }
        } else if (tempItem.publicOnly && isLogin) {
          tempItem.redirect = true;
          tempItem.to = {
            pathname: invalidAccessPath,
            state: { from: tempItem.path },
          };
        }
      }

      if (Object.keys(tempItem).length > 0 && !item.isExternal) {
        if (item.noLayout && noLayout) {
          routes.push(clearRoute({ ...tempItem, exact: true }));
        }
        if (!noLayout && item.noLayout !== true) {
          routes.push(clearRoute(tempItem));
        }
      }

      if (item.subs) {
        return item.subs.map((sub) => {
          const controlledSub = { ...sub, path: tempItem.path + sub.path };
          if (authGuardActive) {
            if (tempItem.protected) controlledSub.protected = true;
            if (tempItem.roles) {
              if (!sub.roles) controlledSub.roles = tempItem.roles;
              else {
                // common roles..
                controlledSub.roles = tempItem.roles.filter((x) => sub.roles.includes(x));

                if (controlledSub.roles && controlledSub.roles.length === 0) {
                  controlledSub.inaccessible = true;
                  console.log(
                    `This route(${controlledSub.path}) is inaccessible. Please check the roles you defined in the hierarchical structure.`,
                    controlledSub
                  );
                }
              }
            } else if (tempItem.publicOnly) {
              controlledSub.publicOnly = true;
            }
            if (controlledSub.roles && controlledSub.roles.length === 0) delete controlledSub.roles;

            if (!controlledSub.inaccessible) return itemMapper(controlledSub);
            return itemMapper({});
          }
          return itemMapper(controlledSub);
        });
      }
      return tempItem;
    };
    items.map(itemMapper);
    return routes;
  };
};

export const convertToMenuItems = ({ data = [], authGuardActive = IS_AUTH_GUARD_ACTIVE, isLogin = false, userRole = null, selectedSchool = null }) => {

  let items = [];

  if (selectedSchool && selectedSchool.roleCodes) {
    if (selectedSchool.roleCodes.indexOf('ROLE_DOCTOR') > -1) {
      if (selectedSchool.roleCodes.indexOf('ROLE_TEACHER') > -1) {
        items = [...data.teacherAndDoctorSidebarItems];
      } else {
        items = [...data.doctorSidebarItems];
      }      
    } else if (selectedSchool.roleCodes.indexOf('ROLE_TEACHER') > -1) {
      items = [...data.teacherSidebarItems];
    } else {
      items = [...data.sidebarItems];
    }
  } else {
    items = [...data.sidebarItems];
  }
  const itemMapper = (item) => {
    const tempItem = { ...item };

    if (authGuardActive) {
      /* Authentication Guard */
      if (tempItem.roles) tempItem.protected = true;

      if (tempItem.publicOnly) {
        delete tempItem.roles;
        delete tempItem.protected;
      }

      if (tempItem.protected) {
        if (!isLogin) {
          return {};
        }
        if (tempItem.roles) {
          if (!userHasRole(tempItem.roles, userRole)) {
            return {};
          }
        }
      } else if (tempItem.publicOnly && isLogin) {
        return {};
      }
    }

    if (tempItem.subs) {
      tempItem.subs = item.subs
        .map((sub) => {
          const controlledSub = { ...sub, path: tempItem.path + sub.path };
          if (tempItem.mega || tempItem.megaParent) controlledSub.megaParent = true;

          if (authGuardActive) {
            if (tempItem.protected) controlledSub.protected = true;

            if (tempItem.roles) {
              if (!sub.roles) controlledSub.roles = tempItem.roles;
              else {
                // common roles..
                controlledSub.roles = tempItem.roles.filter((x) => sub.roles.includes(x));

                if (controlledSub.roles && controlledSub.roles.length === 0) {
                  controlledSub.inaccessible = true;
                  console.log(
                    `This menu item(${controlledSub.path}) is inaccessible. Please check the roles you defined in the hierarchical structure.`,
                    controlledSub
                  );
                }
              }
            } else if (tempItem.publicOnly) {
              controlledSub.publicOnly = true;
            }
            if (controlledSub.roles && controlledSub.roles.length === 0) delete controlledSub.roles;

            if (!controlledSub.inaccessible) return itemMapper(controlledSub);
            return itemMapper({});
          }
          return itemMapper(controlledSub);
        })
        .filter((x) => Object.keys(x).length > 0);

      if (tempItem.subs.length === 0) delete tempItem.subs;
    }
    if (tempItem.label && !item.hideInMenu) return clearMenuItem(tempItem);
    return {};
  };
  return items.map(itemMapper).filter((x) => Object.keys(x).length > 0);
};

export const getRoutes = ({ data, isLogin, userRole, selectedSchool = null }) =>
  convertToRoutes({
    data,
    isLogin,
    userRole,
    authGuardActive: IS_AUTH_GUARD_ACTIVE,
    unauthorizedPath: DEFAULT_PATHS.UNAUTHORIZED,
    loginPath: DEFAULT_PATHS.LOGIN,
    invalidAccessPath: DEFAULT_PATHS.INVALID_ACCESS,
    noLayout: false,
    selectedSchool
  })();

export const getLayoutlessRoutes = ({ data }) => convertToRoutes({ data, noLayout: true })();
export const getMenuItems = ({ data, isLogin, userRole, selectedSchool }) => convertToMenuItems({ data, isLogin, userRole, authGuardActive: IS_AUTH_GUARD_ACTIVE, selectedSchool });
