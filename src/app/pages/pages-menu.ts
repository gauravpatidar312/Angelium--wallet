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
        link: '',
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
        link: '',
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
    hidden: environment.production,
    title: 'Settings',
    icon: 'nb-star',
    children: [
      {
        title: 'Setting',
        link: '/pages/setting',
      },
      {
        title: 'KYC',
        link: '/pages/kyc',
      },
    ],
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
