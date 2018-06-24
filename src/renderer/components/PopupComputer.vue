<template>
  <div id="popup-computer" class="popup">
    <div id="popup-computer-content" class="popup-content">
      <div class="popup-item">
        <b class="computer-module-type">파워서플라이</b>
        <br>
        <img :src="psuImage" id="my-psu-image" class="my-computer-image">
        <br>
        <div class="module-name">코인 시세 변동폭: 1 ~ {{ coinPriceScope }} 원</div>
        <div class="popup-sub-item">
          레벨: <b> {{ $store.state.userdata.data.psu }} </b>
        </div>
      </div>
      <div class="popup-item">
        <b class="computer-module-type">CPU</b>
        <br>
        <img :src="cpuImage" id="my-cpu-image" class="my-computer-image">
        <br>
        <div id="cpu-name-info" class="module-name"> 
          {{ cpuName }} 
        </div>
        <div class="popup-sub-item-2">
          채굴량: <b> {{ cpuMiningPower }} </b> BTC/s
        </div>
        <div class="popup-sub-item">
          오버클럭 레벨: <b> {{ $store.state.userdata.data.cpuLv }} </b>
        </div>
        <div v-if="$store.state.userdata.data.cpuLv < 10">
          <div>
            오버클럭 비용: <b> {{ cpuOverClockCost }} </b>원
          </div>
          <div class="popup-sub-item">
            <button class="overclock-button" @click="overclock('cpu')">오버클럭</button>
          </div>
        </div>
        <b class="max-level" v-else>MAX</b>
      </div>
      <div class="popup-item">
        <b class="computer-module-type">램</b>
        <br>
        <img :src="ramImage" id="my-ram-image" class="my-computer-image">
        <br>
        <div id="ram-name-info" class="module-name"> 
          {{ ramName }}
        </div>
        <div class="popup-sub-item-2">
          채굴량: <b> {{ ramMiningPower }} </b> BTC/s
        </div>
        <div class="popup-sub-item">
          오버클럭 레벨: <b> {{ $store.state.userdata.data.ramLv }} </b>
        </div>
        <div v-if="$store.state.userdata.data.ramLv < 10">
          <div>
            오버클럭 비용: <b> {{ ramOverClockCost }} </b>원
          </div>
          <div class="popup-sub-item">
            <button class="overclock-button" @click="overclock('ram')">오버클럭</button>
          </div>
        </div>
        <b class="max-level" v-else>MAX</b>
      </div>
      <div class="popup-item">
        <b class="computer-module-type">그래픽카드</b>
        <br>
        <img :src="vgaImage" id="my-vga-image" class="my-computer-image">
        <br>
        <div id="vga-name-info" class="module-name"> 
          {{ vgaName }} 
        </div>
        <div class="popup-sub-item-2">
          채굴량: <b> {{ vgaMiningPower }} </b> BTC/s
        </div>
        <div class="popup-sub-item">
          오버클럭 레벨: <b> {{ $store.state.userdata.data.vgaLv }}</b>
        </div>
        <div v-if="$store.state.userdata.data.vgaLv < 10">
          <div>
            오버클럭 비용: <b> {{ vgaOverClockCost }} </b>원
          </div>
          <div class="popup-sub-item">
            <button class="overclock-button" @click="overclock('vga')">오버클럭</button>
          </div>
        </div>
        <b class="max-level" v-else>MAX</b>
      </div>
    </div>
  </div>
</template>

<script>
import Cpu from '../models/cpu.js'
import Ram from '../models/ram.js'
import Vga from '../models/vga.js'

export default {
  name: 'computer-popup',
  data () {
    return {
      /* 부품 데이터 리스트 */
      cpu: Cpu,
      ram: Ram,
      vga: Vga,
      /* 부품 이미지 경로 */
      psuImage: '',
      cpuImage: '',
      ramImage: '',
      vgaImage: '',
      /* 오버클럭 비용 */
      cpuOverClockCost: 0,
      ramOverClockCost: 0,
      vgaOverClockCost: 0
    }
  },
  computed: {
    /* PSU 레벨에 따른 1코인의 최대 가격 */
    coinPriceScope () {
      const psuLv = this.$store.state.userdata.data.psu
      return 10 * psuLv
    },
    /* CPU 명 */
    cpuName () {
      const cpu = this.cpu[this.$store.state.userdata.data.cpu]
      return cpu === undefined ? '고장 남' : cpu.name
    },
    /* CPU 채굴량(오버클럭 레벨 포함) */
    cpuMiningPower () {
      const cpu = this.cpu[this.$store.state.userdata.data.cpu]
      return cpu === undefined ? 0 : this.$store.state.info.cpuCoin.toFixed(3)
    },
    /* 램, 그래픽카드 모두 CPU와 동일 */
    ramName () {
      const ram = this.ram[this.$store.state.userdata.data.ram]
      return ram === undefined ? '고장 남' : ram.name
    },
    ramMiningPower () {
      const ram = this.ram[this.$store.state.userdata.data.ram]
      return ram === undefined ? 0 : this.$store.state.info.ramCoin.toFixed(3)
    },
    vgaName () {
      const vga = this.vga[this.$store.state.userdata.data.vga]
      return vga === undefined ? '고장 남' : vga.name
    },
    vgaMiningPower () {
      const vga = this.vga[this.$store.state.userdata.data.vga]
      return vga === undefined ? 0 : this.$store.state.info.vgaCoin.toFixed(3)
    }
  },
  created () {
    this.moduleImagesUpdate()
    this.overclockCostUpdate()
  },
  methods: {
    /**
     * @description 부품 이미지 설정
     */
    moduleImagesUpdate () {
      const psuLevel = this.$store.state.userdata.data.psu
      const cpuIdx = this.$store.state.userdata.data.cpu
      const ramIdx = this.$store.state.userdata.data.ram
      const vgaIdx = this.$store.state.userdata.data.vga

      this.psuImage = './static/psu/' + psuLevel + '.png'
      this.cpuImage = cpuIdx !== -1 ? './static/' + this.cpu[cpuIdx].src : './static/broken.png'
      this.ramImage = ramIdx !== -1 ? './static/' + this.ram[ramIdx].src : './static/broken.png'
      this.vgaImage = vgaIdx !== -1 ? './static/' + this.vga[vgaIdx].src : './static/broken.png'
    },
    /**
     * @description 오버클럭 비용 설정
     */
    overclockCostUpdate () {
      const cpuIdx = this.$store.state.userdata.data.cpu
      const ramIdx = this.$store.state.userdata.data.ram
      const vgaIdx = this.$store.state.userdata.data.vga

      const cpuLv = this.$store.state.userdata.data.cpuLv
      const ramLv = this.$store.state.userdata.data.ramLv
      const vgaLv = this.$store.state.userdata.data.vgaLv

      /* 오버클럭 비용은 구매 가격의 2% */
      this.cpuOverClockCost = this.cpu[cpuIdx] ? Math.floor((cpuLv + 1) * 0.02 * this.cpu[cpuIdx].price) : 0
      this.ramOverClockCost = this.ram[ramIdx] ? Math.floor((ramLv + 1) * 0.02 * this.ram[ramIdx].price) : 0
      this.vgaOverClockCost = this.vga[vgaIdx] ? Math.floor((vgaLv + 1) * 0.02 * this.vga[vgaIdx].price) : 0
    },
    /**
     * @description 오버클럭 버튼
     * @param {string} moduleName 부품 유형 (cpu, ram, vga)
     */
    overclock (moduleName) {
      const money = this.$store.state.userdata.data.money

      const cpuIdx = this.$store.state.userdata.data.cpu
      const ramIdx = this.$store.state.userdata.data.ram
      const vgaIdx = this.$store.state.userdata.data.vga

      const cpuLv = this.$store.state.userdata.data.cpuLv
      const ramLv = this.$store.state.userdata.data.ramLv
      const vgaLv = this.$store.state.userdata.data.vgaLv

      if (cpuIdx > -1 && ramIdx > -1 && vgaIdx > -1) {
        if (moduleName === 'cpu') {
          if (cpuLv + 1 > 10) {
            this.$emit('notify', '이미 최대 레벨에 도달하였습니다.')
          } else if (money - this.cpuOverClockCost >= 0) {
            document.getElementById('coin-effect').play()
            this.$store.commit('SET_DATA', {key: 'money', value: money - this.cpuOverClockCost})
            this.$store.commit('SET_DATA', {key: 'cpuLv', value: cpuLv + 1})
          }
        } else if (moduleName === 'ram') {
          if (ramLv + 1 > 10) {
            this.$emit('notify', '이미 최대 레벨에 도달하였습니다.')
          } else if (money - this.ramOverClockCost >= 0) {
            document.getElementById('coin-effect').play()
            this.$store.commit('SET_DATA', {key: 'money', value: money - this.ramOverClockCost})
            this.$store.commit('SET_DATA', {key: 'ramLv', value: ramLv + 1})
          } else {
            this.$emit('notify', '보유하고있는 현금이 부족합니다.')
          }
        } else if (moduleName === 'vga') {
          if (vgaLv + 1 > 10) {
            this.$emit('notify', '이미 최대 레벨에 도달하였습니다.')
          } else if (money - this.vgaOverClockCost >= 0) {
            document.getElementById('coin-effect').play()
            this.$store.commit('SET_DATA', {key: 'money', value: money - this.vgaOverClockCost})
            this.$store.commit('SET_DATA', {key: 'vgaLv', value: vgaLv + 1})
          } else {
            this.$emit('notify', '보유하고있는 현금이 부족합니다.')
          }
        }
        this.$emit('save')
        this.$store.commit('BOOST_UPDATE')
        this.calcCoinPerSecond()
        this.moduleImagesUpdate()
        this.overclockCostUpdate()
      } else {
        this.$emit('notify', 'CPU, 램, 그래픽카드가 모두 있어야 오버클럭할 수 있습니다.')
      }
    },
    /**
     * @description 1초당 채굴하는 코인 량 계산
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
.computer-module-type {
  font-size: 1.2rem;
}

/* 오버클럭 버튼 */
.overclock-button {
  cursor: pointer;
  outline: none;
  padding: 5px 10px;
  margin: 10px 0;
  background-color: #da9841;
  border: 1px solid #da9841;
  border-radius: 5px;
  color: #fff;
  transition: .5s;
}

.overclock-button:hover {
  background-color: #fff;
  color: #da9841;
}

.max-level {
  color: #da9841;
  margin-bottom: 10px;
}
</style>
