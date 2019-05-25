import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'nb-star',
    children: [
      {
        title: 'Investor',
        link: '',
      },
      {
        title: 'Company',
        link: '',
      },
      {
        title: 'HQ',
        link: '',
      },
    ],
  },
  {
    title: 'Heaven',
    icon: 'nb-star',
    link: '/pages/heaven',
    // children: [
    // ],
  },
  {
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
        link: '',
      },
    ],
  },
  {
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
