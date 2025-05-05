import { MenuItem } from './menu.model';

export const MENU_CLIENT: MenuItem[] = [
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
];
