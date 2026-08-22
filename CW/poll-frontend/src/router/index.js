import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

// Import các Component
import CreatePoll from '../components/CreatePoll.vue';
import VotePoll from '../components/VotePoll.vue';
import ResultsPoll from '../components/ResultsPoll.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import MyPolls from '../views/MyPolls.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/', 
    component: CreatePoll, 
    meta: { requiresAuth: true } // Phải đăng nhập mới tạo được Poll
  },
  { 
    path: '/my-polls', 
    component: MyPolls, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/:code', 
    component: VotePoll, 
    meta: { requiresAuth: true } // Theo yêu cầu: Người vote cũng phải đăng nhập
  },
  { 
    path: '/:code/results', 
    component: ResultsPoll,
    // Trang kết quả có thể mở, nhưng logic Realtime sẽ bị chặn ở Backend
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware (Route Guard): Kiểm tra trước khi chuyển trang
router.beforeEach((to, from, next) => {
  const { token } = useAuth();
  
  // Nếu trang yêu cầu đăng nhập VÀ chưa có token
  if (to.meta.requiresAuth && !token.value) {
    next('/login'); // Đá về trang đăng nhập
  } else {
    next(); // Cho phép đi tiếp
  }
});

export default router;
