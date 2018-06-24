<template>
  <div id="popup-store" class="popup">
    <div id="popup-store-list" class="popup-content">
      <div class="popup-item" v-for="(data, i) in dataList" :key="i">
        <img class="store-item-img" :src="'./static/' + data.src">
        <div class="store-item-name"> {{ data.name }} </div>
        <div class="store-sub-item">채굴량: <b class="mine-power">{{ data.coin }}</b> BTC/s</div>
        <div class="store-sub-item">가격: {{ data.price.toLocaleString('en') }} 원</div>
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
  /* 상점 유형 */
  props: ['type'],
  data () {
    return {
      /* 상품 리스트 */
      dataList: []
    }
  },
  computed: {
    /* 유저가 보유하고 있는 상품의 인덱스 */
    ownIndex () {
      return this.$store.state.userdata.data[this.module]
    }
  },
  created () {
    /* 상품 리스트를 타입에 알맞는 데이터로 지정 */
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
    /**
     * @description 보유한 부품 종류가 -1 이 아닌지 확인
     * @return {boolean} 모든 부품이 -1이 아닌지에 대한 여부
     */
    check () {
      const cpu = this.$store.state.userdata.data.cpu
      const ram = this.$store.state.userdata.data.ram
      const vga = this.$store.state.userdata.data.vga

      return (cpu !== -1 && ram !== -1 && vga !== -1)
    },
    /**
     * @description 구매 버튼
     * @param {number} index 구매 할 제품 인덱스
     * @param {number} price 구매 할 제품 가격
     * @param {number} limit 구매 할 제품의 PSU 제한 레벨
     * @param {string} name 구매 할 제품의 상품 명
     */
    buy (index, price, limit, name) {
      /* 유저가 보유한 현금 및 PSU 레벨 */
      const money = this.$store.state.userdata.data.money
      const psu = this.$store.state.userdata.data.psu

      /* 게임 첫 시작시 첫 번째 부품을 구매하지 않고 상위 부품을 구매할 경우 */
      if (index > 0 && !this.check()) {
        this.$emit('notify', 'CPU, 램, 그래픽카드 모두 첫 번째 항목으로 구매하세요!')
        return
      }

      /* 유저의 PSU 레벨이 제한 레벨보다 낮을 경우 */
      if (limit > psu) {
        this.$emit('notify', '파워서플라이 레벨이 낮습니다.')
        return
      }

      /* 보유한 현금으로 구매가 가능한 경우 */
      if (money - price >= 0) {
        document.getElementById('coin-effect').play()
        this.$store.commit('SET_DATA', {key: 'money', value: (money - price)})
        this.$store.commit('SET_DATA', {key: this.module, value: index})
        this.$store.commit('SET_DATA', {key: this.module + 'Lv', value: 0})
        this.$store.commit('COIN_PER_SECOND')
        this.$emit('notify', name + ' 구매 완료')
        this.calcCoinPerSecond()
        this.$emit('save')
      } else {
        this.$emit('notify', '보유중인 현금이 부족합니다.')
      }
    },
    /**
     * @description 1초당 채굴량 계산
     */
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

        const cpuBoostCoin = Cpu[cpuNum].coin * (cpuLv / 10)
        const ramBoostCoin = Ram[ramNum].coin * (ramLv / 10)
        const vgaBoostCoin = Vga[vgaNum].coin * (vgaLv / 10)

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

.mine-power {
  color: #44b3c2;
}
</style>
