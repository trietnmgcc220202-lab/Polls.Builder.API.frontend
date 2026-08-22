<template>
  <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2>Đăng ký tài khoản</h2>
    <form @submit.prevent="handleRegister">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Email</label>
        <input v-model="email" type="email" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu</label>
        <input v-model="password" type="password" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
      <button type="submit" :disabled="isLoading" style="width: 100%; padding: 10px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">
        {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
      </button>
    </form>
    <p style="margin-top: 15px; text-align: center;">
      Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleRegister = async () => {
  isLoading.value = true;
  try {
    await axios.post('https://pollbuilder-gateway-r33h.onrender.com/api/auth/register', {
      email: email.value,
      password: password.value
    });
    
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    router.push('/login');
  } catch (error) {
    alert(error.response?.data || 'Đăng ký thất bại.');
  } finally {
    isLoading.value = false;
  }
};
</script>
