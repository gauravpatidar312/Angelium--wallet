import { NbMenuItem } from '@nebular/theme';
import { environment } from '../../environments/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    hidden: environment.production,
    data: ['user'],
    title: 'Home',
    icon: 'nb-star',
    link: '/pages/dashboard',
  },
  {
    hidden: environment.production,
    data: ['admin', 'company'],
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
    ],
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
    icon: 'nb-star',
    link: '',
  },
  {
    hidden: environment.production,
    data: ['admin', 'company'],
    title: 'Reward',
    icon: 'nb-star',
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
    data: ['admin'],
    title: 'HQ',
    icon: 'nb-star',
    link: '/pages/gq',
  },
];
