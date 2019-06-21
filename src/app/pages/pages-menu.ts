import {NbMenuItem} from '@nebular/theme';
import {AppConstants} from '../app.constants';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Top',
    icon: 'nb-home',
    link: '/pages/dashboard',
  },
  {
    title: 'Heaven',
    icon: 'nb-star',
    link: '/pages/heaven',
  },
  {
    data: [AppConstants.ROLES.USER],
    title: 'Reward',
    icon: 'nb-lightbulb',
    link: '/pages/reward',
  },
  {
    data: [AppConstants.ROLES.ADMIN, AppConstants.ROLES.COMPANY],
    title: 'Reward',
    icon: 'nb-lightbulb',
    children: [
      {
        title: 'Investor',
        link: '/pages/reward',
      },
      {
        data: [AppConstants.ROLES.COMPANY],
        title: 'Company',
        link: '/pages/reward',
      },
      {
        data: [AppConstants.ROLES.ADMIN],
        title: 'Admin',
        link: '/pages/reward',
      },
    ],
  },
  {
    title: 'Transfer',
    icon: 'nb-shuffle',
    link: '/pages/transfer',
  },
  {
    title: 'Setting',
    icon: 'nb-gear',
    link: '/pages/setting',
  },
  {
    data: [AppConstants.ROLES.ADMIN],
    title: 'HQ',
    icon: 'nb-person',
    link: '/pages/hq',
  },
];
