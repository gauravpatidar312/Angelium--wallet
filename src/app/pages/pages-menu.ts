import { AppConstants } from '../app.constants';

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
    title: 'Reward',
    icon: 'nb-lightbulb',
    link: '/pages/reward',
    languageKey: 'reward',
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
    data: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN],
    title: 'XTicket',
    icon: 'fas fa-ticket-alt',
    link: '/pages/xticket/1',
    languageKey: 'xticket',
  },
  {
    data: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN],
    title: 'XTicket Master',
    icon: 'fas fa-ticket-alt',
    link: '/pages/xticket-master',
    languageKey: 'xticketMaster',
  },
  {
    data: [AppConstants.ROLES.COMPANY, AppConstants.ROLES.ADMIN],
    title: 'Company',
    icon: 'nb-person',
    link: '/pages/company',
    languageKey: 'company',
  },
  {
    data: [AppConstants.ROLES.ADMIN],
    title: 'Admin',
    icon: 'nb-person',
    link: '/pages/admin',
    languageKey: 'admin',
  }
];
