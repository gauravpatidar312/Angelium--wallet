import { NbMenuItem } from '@nebular/theme';
import { environment } from '../../environments/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'nb-home',
    link: '/pages/dashboard',
  },
  {
    hidden: environment.production,
    title: 'Heaven',
    icon: 'nb-star',
    link: '/pages/heaven',
  },
  {
    hidden: environment.production,
    data: ['user'],
    title: 'Reward',
    icon: 'nb-lightbulb',
    link: '/pages/reward',
  },
  {
    hidden: environment.production,
    data: ['admin', 'company'],
    title: 'Reward',
    icon: 'nb-lightbulb',
    children: [
      {
        title: 'Investor',
        link: '/pages/dashboard',
      },
      {
        data: ['company'],
        title: 'Company',
        link: '',
      },
      {
        data: ['admin'],
        title: 'Admin',
        link: '',
      },
    ],
  },
  {
    hidden: environment.production,
    title: 'Transfer',
    icon: 'nb-shuffle',
    link: '/pages/transfer',
  },
  {
    title: 'Settings',
    icon: 'nb-gear',
    link: '/pages/setting',
  },
  {
    hidden: environment.production,
    data: ['admin'],
    title: 'HQ',
    icon: 'nb-person',
    link: '/pages/hq',
  },
];
