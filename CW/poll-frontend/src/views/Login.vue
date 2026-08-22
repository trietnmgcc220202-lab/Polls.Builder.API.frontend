<template>
  <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Email</label>
        <input v-model="email" type="email" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu</label>
        <input v-model="password" type="password" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
      <button type="submit" :disabled="isLoading" style="width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>
    </form>
    <p style="margin-top: 15px; text-align: center;">
      Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();
const { login } = useAuth();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    // Lưu ý: Đổi URL gateway cho phù hợp nếu chạy thực tế
    const response = await axios.post('https://pollbuilder-accountservice1.com/api/auth/login', {
      email: email.value,
      password: password.value
    });
    
    // Lưu token vào local storage thông qua hàm login của composable
    login(response.data.token);
    
    // Đăng nhập thành công thì chuyển về trang danh sách poll của tôi
    router.push('/my-polls');
  } catch (error) {
    alert(error.response?.data || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
  } finally {
    isLoading.value = false;
  }
};
</script>
