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
    const response = await axios.post('https://pollbuilder-gateway-r33h.onrender.com/api/auth/login', {
      email: email.value,
      password: password.value
    });

    // 1. Trích xuất token an toàn theo mọi kiểu response từ Backend
    const jwtToken = response.data?.token || response.data?.accessToken || response.data;

    if (jwtToken && typeof jwtToken === 'string') {
      // 2. Lưu trực tiếp vào localStorage & gọi hàm login của composable
      localStorage.setItem('token', jwtToken);
      if (typeof login === 'function') {
        login(jwtToken);
      }

      // 3. Chuyển hướng sang MyPolls
      router.push('/my-polls');
    } else {
      alert('Đăng nhập không thành công: Server không trả về Token.');
    }
  } catch (error) {
    console.error('Login Error:', error);
    // 4. Xử lý thông báo lỗi tránh bị [object Object]
    const errRes = error.response?.data;
    const message = typeof errRes === 'string' ? errRes : (errRes?.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
    alert(message);
  } finally {
    isLoading.value = false;
  }
};
</script>
