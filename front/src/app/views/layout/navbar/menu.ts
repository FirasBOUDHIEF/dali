import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard',
  },

  {
    label: 'Home',
    icon: 'home',
    link: '/home',
  },
  {
    label: 'My tasks',
    icon: 'book',
    subMenus: [
      {
        subMenuItems: [
          {
            label: 'List',
            link: '/task/list',
          },
          {
            label: 'Add',
            link: '/task/add',
          },
        ],
      },
    ],
  },
  {
    label: 'Chat',
    icon: 'message-square',
    link: '/chat',
  },
  {
    label: 'Users',
    icon: 'users',
    link: '/users/list',
  },
  {
    label: 'My Tasks',
    icon: 'activity',
    link: '/mytasks',
  },
];
