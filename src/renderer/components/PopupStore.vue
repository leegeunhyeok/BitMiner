<template>
  <div id="popup-store" class="popup">
    <div id="popup-store-list" class="popup-content">
      <div class="popup-item" v-for="(data, i) in dataList" :key="i">
        <img class="store-item-img" :src="'./static/' + data.src">
        <div class="store-item-name"> {{ data.name }} </div>
        <div class="store-sub-item">채굴량: {{ data.coin }} BTC/s</div>
        <div class="store-sub-item">가격: {{ data.price }} 원</div>
        <div class="store-limit">PSU 제한: {{ data.level }} 레벨 </div>
        <button class="buy-button" @click="buy(i, data.price, data.level, data.name)" v-if="ownIndex < i">구매</button>
        <button class="buy-button" disabled v-else>매진</button>
      </div>
    </div>
  </div>
</template>

<script>
import Cpu from '../models/cpu.js'
import Ram from '../models/ram.js'
import Vga from '../models/vga.js'

export default {
  name: 'store',
  props: ['type'],
  data () {
    return {
      dataList: []
    }
  },
  computed: {
    ownIndex () {
      return this.$store.state.userdata.data[this.module]
    }
  },
  created () {
    if (this.type === 'cpuStore') {
      this.module = 'cpu'
      this.dataList = Cpu
    } else if (this.type === 'ramStore') {
      this.module = 'ram'
      this.dataList = Ram
    } else if (this.type === 'vgaStore') {
      this.module = 'vga'
      this.dataList = Vga
    }
  },
  methods: {
    buy (index, price, limit, name) {
      const money = this.$store.state.userdata.data.money
      const psu = this.$store.state.userdata.data.psu
      if (limit > psu) {
        this.$emit('notify', '파워서플라이 레벨이 낮습니다.')
        return
      }

      if (money - price >= 0) {
        this.$store.commit('SET_DATA', {key: 'money', value: (money - price)})
        this.$store.commit('SET_DATA', {key: this.module, value: index})
        this.$store.commit('COIN_PER_SECOND')
        this.$emit('notify', name + ' 구매 완료')
        this.calcCoinPerSecond()
        this.$emit('save')
      } else {
        this.$emit('notify', '보유중인 현금이 부족합니다.')
      }
    },
    calcCoinPerSecond () {
      const cpuNum = this.$store.state.userdata.data.cpu
      const ramNum = this.$store.state.userdata.data.ram
      const vgaNum = this.$store.state.userdata.data.vga

      const cpuLv = this.$store.state.userdata.data.cpuLv
      const ramLv = this.$store.state.userdata.data.ramLv
      const vgaLv = this.$store.state.userdata.data.vgaLv

      if (cpuNum !== -1 && vgaNum !== -1 && ramNum !== -1) {
        const cpuCoin = Cpu[cpuNum].coin
        const ramCoin = Ram[ramNum].coin
        const vgaCoin = Vga[vgaNum].coin

        const cpuBoostCoin = Cpu[cpuNum].coin * ((cpuLv) / 10)
        const ramBoostCoin = Ram[ramNum].coin * ((ramLv) / 10)
        const vgaBoostCoin = Vga[vgaNum].coin * ((vgaLv) / 10)

        const cpuTotal = cpuCoin + cpuBoostCoin
        const ramTotal = ramCoin + ramBoostCoin
        const vgaTotal = vgaCoin + vgaBoostCoin

        this.$store.commit('MODULE_TOTAL_COIN', {cpu: cpuTotal, ram: ramTotal, vga: vgaTotal})
        this.$store.commit('COIN_PER_SECOND', parseFloat(cpuTotal + ramTotal + vgaTotal).toFixed(3))
      } else {
        this.$store.commit('COIN_PER_SECOND', 0)
      }
    }
  }
}
</script>

<style>

.store-item-img {
  float: left;
  width: 100px;
  height: 100px;
  margin-top: 6px;
  margin-left: 20px;
}

/* 구매 버튼 */
.buy-button {
  cursor: pointer;
  outline: none;
  border: 1px solid #50b970;
  background-color: #50b970;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 10px 0px;
  transition: .5s;
}

.buy-button:hover {
  background-color: #fff;
  color: #50b970;
}

/* 구매 버튼 비활성화 */
.buy-button:disabled {
  cursor: unset;
  background-color: #888;
  border: 1px solid #888;
  color: #000;
}

.buy-button:disabled:hover {
  background-color: #888;
  color: #000;
}

.store-limit {
  color: #e45641;
  font-size: 0.8rem;
  margin-top: 5px;
}
</style>
