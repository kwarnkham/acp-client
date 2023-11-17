
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'index', meta: { requiresAuth: true } },
      { path: '/item', component: () => import('pages/ItemsPage.vue'), name: 'items', meta: { requiresAuth: true } },
      { path: '/login', component: () => import('pages/LoginPage.vue'), name: 'login', meta: { guest: true } },
      { path: '/settings', component: () => import('pages/SettingsPage.vue'), name: 'settings', meta: { requiresAuth: true } },
      { path: '/item/:id', component: () => import('pages/ItemDetailsPage.vue'), name: 'item-details', meta: { requiresAuth: true } },
      { path: '/item/:id/edit', component: () => import('pages/EditItemPage.vue'), name: 'edit-item', meta: { requiresAuth: true } },
      { path: '/item/create', component: () => import('pages/CreateItemPage.vue'), name: 'create-item', meta: { requiresAuth: true } },
      { path: '/order/:id', component: () => import('pages/OrderDetailsPage.vue'), name: 'order-details', meta: { requiresAuth: true } },
      { path: '/round/:id', component: () => import('pages/RoundDetailsPage.vue'), name: 'round-details' },
      { path: '/order', component: () => import('pages/OrdersPage.vue'), name: 'orders', meta: { requiresAuth: true } },
      { path: '/round', component: () => import('pages/RoundsPage.vue'), name: 'rounds', meta: { requiresAuth: true } },
      { path: '/payments', component: () => import('pages/PaymentsPage.vue'), name: 'payments', meta: { requiresAuth: true } },
      { path: '/payment/create', component: () => import('pages/CreatePaymentPage.vue'), name: 'create-payment', meta: { requiresAuth: true } },
      { path: '/payemnt/:id/edit', component: () => import('pages/EditPaymentPage.vue'), name: 'edit-payment', meta: { requiresAuth: true } },
      { path: '/change-password', component: () => import('pages/ChangePasswordPage.vue'), name: 'change-password', meta: { requiresAuth: true } },

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
