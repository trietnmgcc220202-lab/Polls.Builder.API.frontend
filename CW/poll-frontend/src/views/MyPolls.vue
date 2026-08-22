<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h2>Lịch sử Poll của tôi</h2>

    <div v-if="isLoading">Đang tải dữ liệu...</div>

    <div v-else-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </div>

    <div v-else-if="polls.length > 0">
      <PollCard 
        v-for="poll in polls" 
        :key="poll.id || poll._id || poll.code" 
        :poll="poll" 
      />
    </div>

    <div v-else>
      <p>Bạn chưa tạo Poll nào cả.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuth } from '../composables/useAuth';
import PollCard from '../components/PollCard.vue';

const polls = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const { token } = useAuth();

onMounted(async () => {
  // 1. Lấy token an toàn từ composable hoặc localStorage
  const jwtToken = token?.value || localStorage.getItem('token');

  if (!jwtToken) {
    errorMessage.value = 'Bạn chưa đăng nhập. Vui lòng đăng nhập để xem danh sách.';
    isLoading.value = false;
    return;
  }

  try {
    // 2. Đã sửa đúng URL Gateway và đính kèm Token
    const response = await axios.get('https://pollbuilder-gateway-r33h.onrender.com/api/polls/my-polls', {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });

    // 3. Xử lý an toàn mảng trả về
    const data = response.data;
    polls.value = Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error('Lỗi lấy MyPolls:', error);
    errorMessage.value = 'Không thể tải danh sách Poll. Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.';
  } finally {
    isLoading.value = false;
  }
});
</script>
