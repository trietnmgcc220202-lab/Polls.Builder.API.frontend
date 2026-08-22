<template>
  <div style="max-width: 400px; margin: 50px auto; padding: 24px; background: #1e293b; border-radius: 12px; color: #e2e8f0; font-family: sans-serif;">
    <h2 style="margin-bottom: 20px; text-align: center;">Đăng nhập</h2>
    
    <form @submit.prevent="handleLogin">
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px;">Email</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          placeholder="user@example.com"
          style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; box-sizing: border-box;" 
        />
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 6px;">Mật khẩu</label>
        <input 
          v-model="password" 
          type="password" 
          required 
          placeholder="••••••••"
          style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; box-sizing: border-box;" 
        />
      </div>
      
      <button 
        type="submit" 
        :disabled="isLoading" 
        style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;"
      >
        {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>
    </form>
    
    <p style="margin-top: 16px; text-align: center; color: #94a3b8;">
      Chưa có tài khoản? <router-link to="/register" style="color: #38bdf8;">Đăng ký ngay</router-link>
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

    console.log('📥 Response từ server:', response.data);

    let jwtToken = response.data?.token || response.data?.Token || response.data?.accessToken;
    
    if (!jwtToken && typeof response.data === 'string') {
      jwtToken = response.data;
    }

    if (jwtToken && typeof jwtToken === 'string') {
      const cleanToken = jwtToken.trim();

      localStorage.setItem('token', cleanToken);
      
      // ✅ Debug: Log token vừa lưu
      console.log('✅ Token đã lưu:', cleanToken);
      console.log('✅ Kiểm tra localStorage:', localStorage.getItem('token'));
      
      if (typeof login === 'function') {
        login(cleanToken);
      }

      router.push('/');
    } else {
      alert('Đăng nhập thất bại: Server không trả về Token.');
    }
  } catch (error) {
    console.error('❌ Login Error:', error);
    const errRes = error.response?.data;
    const message = typeof errRes === 'string' 
      ? errRes 
      : (errRes?.message || errRes?.error || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
    alert(message);
  } finally {
    isLoading.value = false;
  }
};
</script>

