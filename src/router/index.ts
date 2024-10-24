import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/music-manage',
      name: 'MusicManage',
      component: () => import('@/views/manage/MusicManage.vue'),
    },
    {
      path: '/bug-report',
      name: 'BugReport',
      component: () => import('@/views/bugReport/BugReport.vue')
    }
  ],
})

export default router;
