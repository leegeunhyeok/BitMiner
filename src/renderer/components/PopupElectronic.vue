<template>
  <div id="popup-electonic" class="popup-content">
    <div class="popup-item" v-for="(item, i) in electronic" :key="i">
      <div>
        <b>{{ item.name }}</b>
      </div>
      <img :src="'./static/' + item.src" class="electonic-image">
      <div>가격: <b>{{ item.price.toLocaleString('en') }}</b>원</div>
      <button class="buy-button" @click="buy(item, i)">구매</button>
    </div>
  </div>
</template>

<script>
import Electronic from '../models/electronic.js'

export default {
  name: 'electronic-popup',
  data () {
    return {
      electronic: Electronic
    }
  },
  methods: {
    buy (item, i) {
      console.log(item, i)
    }
  }
}
</script>

<style>

.electonic-image {
  width: 150px;
  height: auto;
}

</style>
