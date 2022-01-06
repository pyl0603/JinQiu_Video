import React from 'react';

import UserLayout from './layouts/UserLayout';
import BasicLayout from './layouts/BasicLayout';
import ContentLayout from './layouts/ContentLayout';
import Login from '@expages/Login';
import Release from '@expages/Release';
import Programme from '@expages/Programme';
import Setting from '@expages/Setting';
import OperationLog from '@expages/OperationLog';
import Wallet from '@expages/Wallet';
import Registered from '@expages/Registered';
import ForgetPassword from '@expages/ForgetPassword';
import SettingsPassword from '@expages/ForgetPassword/settingsPassword';

export const constantRoutes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/registered',
    component: Registered
  },
  {
    path: '/forgetPassowrd',
    component: ForgetPassword
  }
]

export const menus = [
  {
    path: "/",
    component: BasicLayout,
    routes: [
      {
        path: '/release',
        component: ContentLayout,
        routes: [
          {
            path: '/release/programme',
            exact: true,
            component: Programme,
          },
          {
            path: '/release/football',
            exact: true,
            component: Release,
          },
          {
            path: '/release/basketball',
            exact: true,
            component: Release,
          }
        ]
      },
      {
        path: '/setting',
        component: ContentLayout,
        routes: [
          {
            path: '/setting/index',
            exact: true,
            component: Setting,
          },
          {
            path: '/setting/operationLog',
            exact: true,
            component: OperationLog,
          }
        ]
      },
      {
        path: '/wallet',
        exact: true,
        component: Wallet,
      }
    ]
  }
];
export const routes = [
  ...constantRoutes,
  ...menus
];
