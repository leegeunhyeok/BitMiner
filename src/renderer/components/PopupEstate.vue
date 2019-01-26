<template>
  <div id="popup-estate">
    <div class="popup-item" v-for="(item, i) in home" :key="i">
      <div>
        <b>{{ item.name }}</b>
      </div>
      <img :src="item.src" class="estate-image">
      <div>가격: <b>{{ item.price.toLocaleString('en') }}</b>원</div>
      <button class="buy-button" @click="buy(item, i)" v-if="ownHome < i">구매</button>
      <button class="buy-button" disabled v-else>소유 중</button>
    </div>
  </div>
</template>

<script>
import Home from '../models/home.js'

export default {
  name: 'estate-popup',
  data () {
    return {
      home: Home
    }
  },
  computed: {
    /* 유저가 현재 보유중인 주택 */
    ownHome () {
      return this.$store.state.userdata.data.home
    }
  },
  methods: {
    /**
     * @description 주택 구매 버튼
     * @param {any} home 구매 할 주택 데이터 객체
     * @param {number} index 구매 할 주택의 인덱스
     */
    buy (home, index) {
      const money = this.$store.state.userdata.data.money
      if (money - home.price >= 0) {
        this.$emit('playSound', 'coin')
        this.$store.commit('SET_DATA', {key: 'money', value: (money - home.price)})
        this.$store.commit('SET_DATA', {key: 'home', value: index})
        this.$emit('notify', name + ' 구매 완료')
        this.$emit('save')
      } else {
        this.$emit('notify', '보유중인 현금이 부족합니다.')
      }
    }
  }
}
</script>

<style>

.estate-image {
  width: 250px;
  height: 200px;
}

</style>
