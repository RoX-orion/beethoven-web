import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Sidebar from '@/views/manage/Sidebar.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/bug-report',
    name: 'BugReport',
    component: () => import('@/views/bugReport/BugReport.vue'),
  },
]

export const manageRoutes: RouteRecordRaw[] = [
  {
    path: '/manage',
    name: 'Manage',
    component: Sidebar,
    redirect: '/manage/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/manage/Dashboard.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'music',
        component: () => import('@/views/manage/MusicManage.vue'),
        meta: { title: '歌曲管理' },
      },
      {
        path: 'storage',
        component: () => import('@/views/manage/MusicManage.vue'),
        meta: { title: '存储管理' },
      },
    ],
  },
  // {
  //   path: '/music-manage',
  //   name: 'MusicManage',
  //   component: Sidebar,
  //   children: [
  //     {
  //       path: 'music',
  //       component: () => import('@/views/manage/MusicManage.vue'),
  //       meta: { title: '歌曲管理' }
  //     }
  //   ]
  // },
  // {
  //   path: '/storage',
  //   name: 'Storage',
  //   component: Sidebar,
  //   children: [
  //     {
  //       path: 'storage',
  //       component: () => import('@/views/manage/MusicManage.vue'),
  //       meta: { title: '存储管理' }
  //     }
  //   ]
  // },
];

manageRoutes.forEach(e => routes.push(e))

console.log('routes', routes);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
