<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h2>Lịch sử Poll của tôi</h2>
    
    <div v-if="isLoading">Đang tải dữ liệu...</div>
    
    <div v-else-if="polls.length > 0">
      <PollCard v-for="poll in polls" :key="poll.code" :poll="poll" />
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
const { token } = useAuth();

onMounted(async () => {
  try {
    const response = await axios.get('https://pollbuilder-gateway-r33h.onrender.com/api/polls/my-polls', {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    polls.value = response.data;
  } catch (error) {
    alert('Không thể tải danh sách Poll. Vui lòng đăng nhập lại.');
  } finally {
    isLoading.value = false;
  }
});
</script>
