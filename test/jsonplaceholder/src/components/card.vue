<template>
  <div class="container">
    <h1 class="title">1.视频标题: </h1>
    <div class="card-content">
      <div class="content-left">
        <p>albumId: <span class="stat" id="video-danmaku">{{ info.albumId }}</span></p>
        <p>id: <span class="stat" id="video-views">{{ info.id }}</span></p>
        <p>title: <span class="stat" id="video-danmaku">{{ info.title }}</span></p>
        <p>url: <span class="stat" id="video-danmaku">{{ info.url }}</span></p>
        <p>url: <span class="stat" id="video-danmaku">{{ Math.random() }}</span></p>
        <p>url: <span class="stat" id="video-danmaku">{{ Math.random() }}</span></p>
        <p>url: <span class="stat" id="video-danmaku">{{ Math.random() }}</span></p>
        <p>url: <span class="stat" id="video-danmaku">{{ Math.random() }}</span></p>
        <p>url: <span class="stat" id="video-danmaku">{{ Math.random() }}</span></p>
      </div>
      <div class="content-right">
        <img :src="info.thumbnailUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ml from '@/mlfetch'

const props = defineProps<{
  id: number
}>()
interface Photo {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}
const info = ref<Photo>({
  albumId: 0,
  id: 0,
  title: '',
  url: '',
  thumbnailUrl: ''
})

onMounted(() => {
  ml.enqueueWithInterval({
    url: `https://jsonplaceholder.typicode.com/photos/${props.id}`,
    type: 'json',
    setCallback: (json: Photo) => {
      // console.log(json)
      info.value = json
    }
  }, 1000)
})

</script>

<style scoped>
.container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.card-content {
  display: flex;
  align-items: center;
  margin: 0;
}

.content-left {
  flex: 1.5;
  padding-right: 10px;
}

.content-right {
  /* background: url('/1656147374309.jpg');
  background-position: center;
  background-size: 100% auto;
  flex: 2;
  width: 250px;
  height: 200px;
  overflow: hidden; */
  flex: 2;
  overflow: hidden;
}

.content-right img {
  width: 100%;
  object-fit: contain;
}

.content-left p {
  font-size: 15px;
  color: #666;
  margin: 0;
  margin-top: 5px;
}

.stat {
  font-weight: bold;
  color: #333;
}
</style>
