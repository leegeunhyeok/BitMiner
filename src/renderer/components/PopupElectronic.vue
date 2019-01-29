<template>
  <div id="popup-electonic" class="popup-content">
    <div class="popup-item" v-for="(item, i) in electronic" :key="i">
      <div>
        <b>{{ item.name }}</b>
      </div>
      <img :src="'./static/' + item.src" class="electonic-image">
      <div>{{ item.info }}</div>
      <div>가격: <b>{{ item.price.toLocaleString('en') }}</b>원</div>
      <button class="buy-button" @click="buy(item, i)" v-if="sold.indexOf(item.id) === -1">구매</button>
      <button class="buy-button" disabled v-else>매진</button>
    </div>
  </div>
</template>

<script>
import Electronic from '../models/electronic.js'

export default {
  name: 'electronic-popup',
  data () {
    return {
      electronic: Electronic,
      sold: []
    }
  },
  created () {
    if (this.$store.state.userdata.data.isee === 1) {
      this.sold.push('i_see')
    }

    if (this.$store.state.userdata.data.monitor > 1) {
      for (let i = 2; i <= this.$store.state.userdata.data.monitor; i++) {
        this.sold.push('monitor_' + i)
      }
    }
  },
  methods: {
    buy (item, i) {
      /* 유저가 보유한 현금 */
      const money = this.$store.state.userdata.data.money

      /* 보유한 현금으로 구매가 가능한 경우 */
      if (money - item.price >= 0) {
        this.$emit('playSound', 'coin')
        if (item.id === 'i_see') {
          this.$store.commit('SET_DATA', { key: 'isee', value: 1 })
          this.sold.push('i_see')
        } else if (item.id === 'monitor_2') {
          if (this.$store.state.userdata.data.home === 0) {
            this.$emit('notify', '매트블랙 이상의 집을 소유해야 구매할 수 있습니다.')
          } else {
            this.$store.commit('SET_DATA', { key: 'monitor', value: 2 })
            this.sold.push('monitor_2')
          }
        } else if (item.id === 'monitor_3') {
          if (this.$store.state.userdata.data.home === 0) {
            this.$emit('notify', '매트블랙 이상의 집을 소유해야 구매할 수 있습니다.')
          } else {
            this.$store.commit('SET_DATA', { key: 'monitor', value: 3 })
            this.sold.push('monitor_3')
          }
        }
        this.$store.commit('SET_DATA', {key: 'money', value: (money - item.price)})
        this.$emit('notify', item.name + ' 구매 완료')
        this.$emit('save')
      } else {
        this.$emit('notify', '보유중인 현금이 부족합니다.')
      }
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
