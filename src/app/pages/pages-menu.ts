import { NbMenuItem } from '@nebular/theme';
import { environment } from '../../environments/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    hidden: environment.production,
    title: 'Home',
    icon: 'nb-star',
    children: [
      {
        title: 'Investor',
        link: '/pages/dashboard',
      },
      {
        title: 'Company',
        link: '',
      },
      {
        title: 'HQ',
        link: '/pages/hq',
      },
    ],
  },
  {
    hidden: environment.production,
    title: 'Heaven',
    icon: 'nb-star',
    link: '/pages/heaven',
    // children: [
    // ],
  },
  {
    hidden: environment.production,
    title: 'Reward',
    icon: 'nb-star',
    children: [
      {
        title: 'Angel',
        link: '/pages/angel',
      },
      {
        title: 'Company',
        link: '',
      },
      {
        title: 'HQ',
        link: '/pages/hq',
      },
    ],
  },
  {
    hidden: environment.production,
    title: 'Transfer',
    icon: 'nb-star',
    link: '/pages/transfer',
  },
  {
    title: 'Settings',
    icon: 'nb-star',
    link: '/pages/setting',
  },
  {
    hidden: environment.production,
    title: 'Admin',
    icon: 'nb-star',
    children: [
      {
        title: 'Company',
        link: '',
      },
      {
        title: 'HQ',
        link: '/pages/hq',
      },
    ],
  },
];
