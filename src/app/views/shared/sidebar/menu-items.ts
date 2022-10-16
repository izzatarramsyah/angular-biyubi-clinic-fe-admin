import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
 
  {
    path: '/menu/graph',
    title: 'Grafik',
    icon: 'bi bi-graph-up',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/menu/schedule',
    title: 'Jadwal',
    icon: 'bi bi-calendar-check',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/menu/input-data',
    title: 'Input Data',
    icon: 'bi bi-pencil-square',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/menu/upload-data',
    title: 'Upload Data',
    icon: 'bi bi-upload',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/menu/data-master',
    title: 'Data Master',
    icon: 'bi bi-key',
    class: '',
    extralink: false,
    submenu: []
  },
  // {
  //   path: '/menu/history',
  //   title: 'Data Riwayat',
  //   icon: 'bi bi-clock-history',
  //   class: '',
  //   extralink: false,
  //   submenu: []
  // }
];
