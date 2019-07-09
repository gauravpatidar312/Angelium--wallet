import {AppConstants} from '../app.constants';

export const MENU_ITEMS = [
  {
    title: 'Top',
    icon: 'nb-home',
    link: '/pages/dashboard',
    languageKey: 'top',
  },
  {
    title: 'Heaven',
    icon: 'nb-star',
    link: '/pages/heaven',
    languageKey: 'heaven',
  },
  {
    data: [AppConstants.ROLES.USER],
    title: 'Reward',
    icon: 'nb-lightbulb',
    link: '/pages/reward',
    languageKey: 'reward',
  },
  {
    data: [AppConstants.ROLES.ADMIN, AppConstants.ROLES.COMPANY],
    title: 'Reward',
    icon: 'nb-lightbulb',
    languageKey: 'reward',
    children: [
      {
        title: 'Investor',
        link: '/pages/reward',
        languageKey: 'investor',
      },
      {
        data: [AppConstants.ROLES.COMPANY],
        title: 'Company',
        link: '/pages/reward',
        languageKey: 'company',
      },
      {
        data: [AppConstants.ROLES.ADMIN],
        title: 'Admin',
        link: '/pages/reward',
        languageKey: 'admin',
      },
    ],
  },
  {
    title: 'Transfer',
    icon: 'nb-shuffle',
    link: '/pages/transfer',
    languageKey: 'transfer',
  },
  {
    title: 'Setting',
    icon: 'nb-gear',
    link: '/pages/setting',
    languageKey: 'setting',
  },
  {
    data: [AppConstants.ROLES.ADMIN],
    title: 'HQ',
    icon: 'nb-person',
    link: '/pages/hq',
    languageKey: 'hq',
  },
];
