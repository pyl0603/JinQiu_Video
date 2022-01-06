import React from 'react';

import UserLayout from './layouts/UserLayout';
import BasicLayout from './layouts/BasicLayout';
import ContentLayout from './layouts/ContentLayout';
import Login from '@bcpages/Login';
import ForgetPassword from '@bcpages/ForgetPassword';
import SettingsPassword from '@bcpages/ForgetPassword/settingsPassword';
import Test from '@bcpages/home'
import Commodity from '@bcpages/Commodity'
import OrderTopUp from '@bcpages/OrderTopUp'
import BillTopUp from '@bcpages/BillTopUp'
import BillBuy from '@bcpages/BillBuy'
import BillChange from '@bcpages/BillChange'
import NewWithdrawal from '@bcpages/NewWithdrawal'
import AllWithdrawal from '@bcpages/AllWithdrawal'
import ExpertProfit from '@bcpages/ExpertProfit'
import CommodityManage from '@bcpages/CommodityManage'
import CommodityRecycle from '@bcpages/CommodityRecycle'
import OrderBuy from '@bcpages/OrderBuy'
import OrderChange from '@bcpages/OrderChange'
import CommodityLogs from '@bcpages/CommodityLogs'
import UpdatePassword from '@bcpages/UpdatePassword';
import BonusProfit from '@bcpages/BonusProfit';

export const constantRoutes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/forgetPassowrd',
    component: ForgetPassword
  },
  {
    path: '/updatePassword',
    component: UpdatePassword
  }
]

export const menus = [
  {
    path: "/",
    component: BasicLayout,
    routes: [
      {
        path: "/",
        exact: true,
        component: Test
      },
      {
        path: "/commodity",
        component: ContentLayout,
        routes: [
          {
            path: '/commodity/push',
            exact: true,
            component: Commodity
          },
          {
            path: '/commodity/manage',
            exact: true,
            component: CommodityManage
          },
          {
            path: '/commodity/recycle',
            exact: true,
            component: CommodityRecycle
          }
        ]
      },
      {
        path: "/order",
        component: ContentLayout,
        routes: [
          {
            path: '/order/topup',
            exact: true,
            component: OrderTopUp
          },
          {
            path: '/order/buy',
            exact: true,
            component: OrderBuy
          },
          // {
          //   path: '/order/change',
          //   exact: true,
          //   component: OrderChange
          // }
        ]
      },
      {
        path: "/bill",
        component: ContentLayout,
        routes: [
          {
            path: '/bill/topup',
            exact: true,
            component: BillTopUp
          },
          {
            path: '/bill/buy',
            exact: true,
            component: BillBuy
          },
          // {
          //   path: '/bill/change',
          //   exact: true,
          //   component: BillChange
          // }
        ]
      },
      {
        path: "/withdrawal",
        component: ContentLayout,
        routes:[
          {
            path:"/withdrawal/new",
            exact: true,
            component: NewWithdrawal
          },
          // {
          //   path:"/withdrawal/expertProfit",
          //   exact: true,
          //   component: ExpertProfit
          // },
          {
            path:"/withdrawal/bonus",
            exact: true,
            component: BonusProfit
          },
          {
            path:"/withdrawal/all",
            exact: true,
            component: AllWithdrawal
          }
        ]
      },
      {
        path: "/commodityLogs",
        exact: true,
        component: CommodityLogs
      },
    ]
  }
];
export const routes = [
  ...constantRoutes,
  ...menus
];
