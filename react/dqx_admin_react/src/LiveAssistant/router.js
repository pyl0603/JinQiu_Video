import React from 'react';

import BasicLayout from './layouts/BasicLayout';
import ContentLayout from './layouts/ContentLayout';

import Login from '@livepages/Login';
import Registered from '@livepages/Registered';
import ForgetPassword from '@livepages/ForgetPassword';
import SettingPassword from '@livepages/ForgetPassword/settingsPassword';

import DataAnalysis from '@livepages/DataAnalysis';

import LiveBasic from '@livepages/LiveBasic';
import PersonalLive from '@livepages/PersonalLive';

import Setting from '@livepages/Setting';
import OperationLog from '@livepages/OperationLog';

import ReserveFball from "@livepages/Reserve/fball";
import ReserveBball from "@livepages/Reserve/bball";
import Reservation from "@livepages/Reserve/reservation";

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
  },
  // {
  //   path: '/settingPassowrd',
  //   component: SettingPassword
  // },
  {
    path: '/live/personalLive',
    exact: true,
    component: PersonalLive,
  }
]

export const menus = [
  {
    path: "/",
    component: BasicLayout,
    routes: [
      {
        path: "/dataAnalysis",
        exact: true,
        component: DataAnalysis
      },
      {
        path: '/reserve',
        component: ContentLayout,
        routes: [
          {
            path: '/reserve/bball',
            exact: true,
            component: ReserveBball,
          },
          {
            path: '/reserve/fball',
            exact: true,
            component: ReserveFball,
          }, 
          {
            path: '/reserve/book',
            exact: true,
            component: Reservation
          }
        ]
      },
      {
        path: '/live',
        component: ContentLayout,
        routes: [
          {
            path: '/live/basic',
            exact: true,
            component: LiveBasic,
          },
          {
            path: '/live/personal',
            exact: true,
            component: PersonalLive,
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
          }
        ]
      }
    ]
  }
];
export const routes = [
  ...constantRoutes,
  ...menus
];
