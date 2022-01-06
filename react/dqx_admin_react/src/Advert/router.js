import React from 'react';

import SecurityLayout from './layouts/SecurityLayout';
import UserLayout from './layouts/UserLayout';
import BasicLayout from './layouts/BasicLayout';
import ContentLayout from './layouts/ContentLayout';

import Login from '@pages/Login';
import ChoosePart from '@pages/ChoosePart';

import DataAnalysis from '@pages/DataAnalysis';
import AdGroup from '@pages/AdGroup';
import RecycleBin from '@pages/RecycleBin';
import AdTypes from '@pages/AdTypes';
import AdSettings from '@pages/AdSettings';
import PersonManage from '@pages/PersonManage';
import OperationLog from '@pages/OperationLog';
import CreateAd from '@pages/CreateAd';
import AdGroupDetails from '@pages/AdGroupDetails';
import DraftBox from '@pages/DraftBox';
import test from '@pages/test';
import recycleBinGroup from '@pages/RecycleBin/adGroup';

export const constantRoutes = [
  {
    path: '/user',
    component: UserLayout,
    routes: [
      {
        name: 'choosePart',
        path: '/user/choose',
        component: ChoosePart,
      },
      {
        name: 'login',
        path: '/user/login',
        component: Login,
      }
    ],
  }
]

export const menus = [
  {
    path: "/",
    component: SecurityLayout,
    routes: [
      {
        path: "/dataAnalysis",
        exact: true,
        authority: ['admin', 'user'],
        component: DataAnalysis
      },
      {
        path: "/createAd",
        authority: ['admin', 'user'],
        component: CreateAd
      },
      {
        path: "/AdGroup/list",
        authority: ['admin', 'user'],
        component: AdGroup
      },
      {
        path: "/AdGroup/details",
        hideInMenu: true,
        authority: ['admin', 'user'],
        component: AdGroupDetails
      },
      {
        path: "/adTypes",
        authority: ['admin', 'user'],
        component: AdTypes,
       
      },
      {
        path: "/adSettings",
        exact: true,
        authority: ['admin', 'user'],
        component: AdSettings
      },
      {
        path: "/personManage",
        exact: true,
        authority: ['admin', 'user'],
        component: PersonManage
      },
      {
        path: "/AdGroup/draftBox",
        authority: ['admin', 'user'],
        component: DraftBox
      },
      {
        path: "/recycleBin",
        component: ContentLayout,
        authority: ['admin', 'user'],
        routes: [
          {
            path: "/recycleBin/adGroup",
            exact: true,
            component: recycleBinGroup
          },
          {
            path: "/recycleBin/index",
            exact: true,
            component: RecycleBin
          },
        ]
      },
      {
        path: "/operationLog",
        exact: true,
        authority: ['admin', 'user'],
        component: OperationLog
      },
      // {
      //   path: "/newPage",
      //   component: ContentLayout,
      //   routes: [
      //     {
      //       path: "/newPage/test1",
      //       exact: true,
      //       component: test
      //     },
      //     {
      //       path: "/newPage/test2",
      //       component: ContentLayout,
      //       routes: [
      //         {
      //           path: "/newPage/test2/test1",
      //           exact: true,
      //           component: () => <div>test222</div>
      //         },
      //         {
      //           path: "/newPage/test2/test2",
      //           component: ContentLayout,
      //           routes: [
      //             {
      //               path: "/newPage/test2/test2/111",
      //               exact: true,
      //               component: () => <div>嘻嘻嘻嘻</div>
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  }
];
export const routes = [
  ...constantRoutes,
  ...menus
];
