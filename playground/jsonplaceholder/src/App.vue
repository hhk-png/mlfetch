<script setup lang="ts">
import card from './components/card.vue'
</script>

<template>
  <div class="manager">
    <card :key="i" :id="i" v-for="i in 80"></card>
  </div>
</template>

<style scoped>
.manager {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.manager i {
  width: 30%;
}
</style>
