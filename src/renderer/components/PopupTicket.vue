<template>
  <div id="popup-ticket" class="popup-content">
    <!-- <div class="popup-item" v-for="(item, i) in ticket" :key="i">
      <div>
        <b>{{ item.name }}</b>
      </div>
      <img :src="'./static/' + item.src" class="ticket-image">
      <div>{{ item.info }}</div>
      <div>가격: <b>{{ item.price.toLocaleString('en') }}</b>원</div>
      <button class="buy-button" @click="buy(item, i)" v-if="sold.indexOf(item.id) === -1">구매</button>
      <button class="buy-button" disabled v-else>매진</button>
    </div> -->
    <br>
    <h2>상점 준비 중 입니다</h2>
  </div>
</template>

<script>
// import Electronic from '../models/electronic.js'

export default {
  name: 'ticket-popup',
  data () {
    return {
      ticket: [] // TODO: 복권 아이템 저장
    }
  },
  methods: {
    buy (item, i) {
      // TODO: 복권 구매
    }
  }
}
</script>

<style>

.ticket-image {
  width: 120px;
  height: auto;
}

</style>
