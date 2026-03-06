import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bases/create',
      name: 'BaseCreate',
      component: () => import('@/views/BaseCreateView.vue'),
      meta: { requiresAuth: true, requiresActive: true },
    },
    {
      path: '/bases/:id/edit',
      name: 'BaseEdit',
      component: () => import('@/views/BaseEditView.vue'),
      meta: { requiresAuth: true, requiresActive: true },
    },
    {
      path: '/bases/:id',
      name: 'BaseDetails',
      component: () => import('@/views/BaseDetailsView.vue'),
      meta: { requiresAuth: true, requiresActive: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Проверяем, загружен ли пользователь из localStorage
  if (!authStore.user && localStorage.getItem('user')) {
    authStore.loadUserFromStorage();
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard');
  } else if (to.meta.requiresActive && authStore.isPending) {
    next('/dashboard');
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
