<template>
    <a class="daily-item">
        <div class="daily-img" v-if="data.images">
            <img :src="imgPath + data.images[0]" alt="">
        </div>
        <div class="daily-title"
        :class="{ noImg: !data.images}">{{ data.title }}</div>
    </a>
</template>
<script>
export default {
  name: 'Item',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      imgPath: 'http://127.0.0.1:8011/img/'
    }
  }
}
</script>
