import { APP } from "src/app/util/Constants";

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  role? : number;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];


}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'dashboard',
    type: 'group',
    icon: 'icon-group',
    role: APP.ROLE_ALL,
    children: [
      {
        id: 'dashboard',
        title: 'หน้าหลัก',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'ui-component',
    title: 'Reservation',
    type: 'group',
    icon: 'icon-group',
    role: APP.ROLE_CUSTOMER,
    children: [
      {
        id: 'reservation',
        title: 'ระบบจองคิว',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'จองคิว',
            type: 'item',
            url: '/reservations/reservation'
          },
          {
            id: 'badges',
            title: 'ประวัติการจองคิว',
            type: 'item',
            url: '/reservations/reservation-history'
          },
          // {
          //   id: 'breadcrumb-pagination',
          //   title: 'Breadcrumb & Pagination',
          //   type: 'item',
          //   url: '/component/breadcrumb-paging'
          // },
          // {
          //   id: 'collapse',
          //   title: 'Collapse',
          //   type: 'item',
          //   url: '/component/collapse'
          // },
          // {
          //   id: 'tabs-pills',
          //   title: 'Tabs & Pills',
          //   type: 'item',
          //   url: '/component/tabs-pills'
          // },
          // {
          //   id: 'typography',
          //   title: 'Typography',
          //   type: 'item',
          //   url: '/component/typography'
          // }
        ]
      }
    ]
  },
  {
    id: 'managerev',
    title: 'manage-reservation',
    type: 'group',
    icon: 'icon-group',
    role: APP.ROLE_ADMIN,
    children: [
      {
        id: 'manage-rev',
        title: 'จัดการ จองคิว',
        type: 'item',
        url: '/manage-genaral-reservation',
        classes: 'nav-item',
        icon: 'feather icon-codepen'
      },
      // {
      //   id: 'manage-employee',
      //   title: 'จัดการพนักงาน',
      //   type: 'item',
      //   url: '/chart',
      //   classes: 'nav-item',
      //   icon: 'feather icon-users'
      // }
    ]
  },
  {
    id: 'profile',
    title: 'Profile',
    type: 'group',
    icon: 'icon-group',
    role: APP.ROLE_ALL,
    children: [
      {
        id: 'profile',
        title: 'โปรไฟล์',
        type: 'item',
        url: '/profile',
        icon: 'feather icon-user',
        // target: true,
        breadcrumbs: true
      },
      // {
      //   id: 'signup',
      //   title: 'Sign up',
      //   type: 'item',
      //   url: '/auth/signup',
      //   icon: 'feather icon-at-sign',
      //   target: true,
      //   breadcrumbs: false
      // },
      // {
      //   id: 'signin',
      //   title: 'Sign in',
      //   type: 'item',
      //   url: '/auth/signin',
      //   icon: 'feather icon-log-in',
      //   target: true,
      //   breadcrumbs: false
      // }
    ]
  },
  {
    id: 'manage',
    title: 'manage-customer',
    type: 'group',
    icon: 'icon-group',
    role: APP.ROLE_ADMIN,
    children: [
      {
        id: 'manage-customer',
        title: 'จัดการลูกค้า',
        type: 'item',
        url: '/genaral-customer',
        classes: 'nav-item',
        icon: 'feather icon-users'
      },
      // {
      //   id: 'manage-employee',
      //   title: 'จัดการพนักงาน',
      //   type: 'item',
      //   url: '/chart',
      //   classes: 'nav-item',
      //   icon: 'feather icon-users'
      // }
    ]
  },
  {
    id: 'report',
    title: 'report',
    type: 'group',
    icon: 'icon-group',
    role: APP.ROLE_ADMIN,
    children: [
      {
        id: 'report-reservation',
        title: 'รายงานจองคิว',
        type: 'item',
        url: '/reservation-report',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      // {
      //   id: 'employee',
      //   title: 'employee',
      //   type: 'item',
      //   url: '/chart',
      //   classes: 'nav-item',
      //   icon: 'feather icon-users'
      // }
    ]
  },
  // {
  //   id: 'forms & tables',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   role: APP.ROLE_ADMIN,
  //   children: [
  //     {
  //       id: 'forms',
  //       title: 'Basic Forms',
  //       type: 'item',
  //       url: '/forms',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text'
  //     },
  //     {
  //       id: 'tables',
  //       title: 'tables',
  //       type: 'item',
  //       url: '/tables',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server'
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar'
  //     },
  //     {
  //       id: 'menu-level',
  //       title: 'Menu Levels',
  //       type: 'collapse',
  //       icon: 'feather icon-menu',
  //       children: [
  //         {
  //           id: 'menu-level-2.1',
  //           title: 'Menu Level 2.1',
  //           type: 'item',
  //           url: 'javascript:',
  //           external: true
  //         },
  //         {
  //           id: 'menu-level-2.2',
  //           title: 'Menu Level 2.2',
  //           type: 'collapse',
  //           children: [
  //             {
  //               id: 'menu-level-2.2.1',
  //               title: 'Menu Level 2.2.1',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             },
  //             {
  //               id: 'menu-level-2.2.2',
  //               title: 'Menu Level 2.2.2',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
];
