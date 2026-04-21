import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/cases/:caseId/:tab?',
    name: 'CaseDetail',
    component: () => import('../views/CaseDetailView.vue'),
  },
  {
    path: '/admin',
    redirect: '/admin/overview',
  },
  {
    path: '/admin/overview',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboardView.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/UserManagementView.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/audit',
    name: 'AdminAudit',
    component: () => import('../views/admin/AuditLogView.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/config',
    name: 'AdminConfig',
    component: () => import('../views/admin/ConfigView.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta?.public && !auth.isAuthenticated) {
    return { name: 'Login' }
  }
  if (to.meta?.role === 'admin' && !auth.isAdmin) {
    return { name: 'Dashboard' }
  }
  if (to.name === 'Dashboard' && auth.isAdmin) {
    return { name: 'AdminDashboard' }
  }
})

export default router
