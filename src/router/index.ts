import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/views/manage/index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/:type?/:id?',
    name: 'Home',
    props: true,
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/bug-report',
    name: 'BugReport',
    component: () => import('@/views/bugReport/BugReport.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/auth/Auth.vue'),
  },
];

export const manageRoutes: RouteRecordRaw[] = [
  {
    path: '/manage',
    name: 'Manage',
    component: Layout,
    redirect: '/manage/dashboard',
    meta: { title: '后台管理' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/manage/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'dashboard' },
      },
      {
        path: 'music',
        component: () => import('@/views/manage/MusicManage.vue'),
        meta: { title: '媒体管理', icon: 'music' },
      },
      {
        path: 'storage',
        component: () => import('@/views/manage/Storage.vue'),
        meta: { title: '资源概览', icon: 'storage' },
      },
      {
        path: 'system',
        component: () => import('@/views/manage/System.vue'),
        meta: { title: '系统设置', icon: 'setting' },
      },
    ],
  },
];

manageRoutes.forEach(e => routes.push(e));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
