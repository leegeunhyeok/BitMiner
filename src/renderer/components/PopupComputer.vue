<template>
  <div id="popup-computer" class="popup">
    <div id="popup-computer-content" class="popup-content">
      <div class="popup-item">
        <b class="computer-module-type">파워서플라이</b>
        <br>
        <img :src="psuImage" id="my-psu-image" class="my-computer-image">
        <br>
        <div class="module-name"></div>
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
        <div>
          오버클럭 비용: <b> {{ cpuOverClockCost }} </b>원
        </div>
        <div class="popup-sub-item">
          <button class="overclock-button" @click="overclock('cpu')">오버클럭</button>
        </div>
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
        <div>
          오버클럭 비용: <b> {{ ramOverClockCost }} </b>원
        </div>
        <div class="popup-sub-item">
          <button class="overclock-button" @click="overclock('ram')">오버클럭</button>
        </div>
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
        <div>
          오버클럭 비용: <b> {{ vgaOverClockCost }} </b>원
        </div>
        <div class="popup-sub-item">
          <button class="overclock-button" @click="overclock('vga')">오버클럭</button>
        </div>
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
      cpu: Cpu,
      ram: Ram,
      vga: Vga,
      psuImage: '',
      cpuImage: '',
      ramImage: '',
      vgaImage: '',
      cpuOverClockCost: 0,
      ramOverClockCost: 0,
      vgaOverClockCost: 0
    }
  },
  computed: {
    cpuName () {
      const cpu = this.cpu[this.$store.state.userdata.data.cpu]
      return cpu === undefined ? '고장 남' : cpu.name
    },
    cpuMiningPower () {
      const cpu = this.cpu[this.$store.state.userdata.data.cpu]
      return cpu === undefined ? 0 : cpu.coin
    },
    ramName () {
      const ram = this.ram[this.$store.state.userdata.data.ram]
      return ram === undefined ? '고장 남' : ram.name
    },
    ramMiningPower () {
      const ram = this.ram[this.$store.state.userdata.data.ram]
      return ram === undefined ? 0 : ram.coin
    },
    vgaName () {
      const vga = this.vga[this.$store.state.userdata.data.vga]
      return vga === undefined ? '고장 남' : vga.name
    },
    vgaMiningPower () {
      const vga = this.vga[this.$store.state.userdata.data.vga]
      return vga === undefined ? 0 : vga.coin
    }
  },
  created () {
    this.moduleImagesUpdate()
    this.overclockCostUpdate()
  },
  methods: {
    moduleImagesUpdate () {
      const cpuIdx = this.$store.state.userdata.data.cpu
      const ramIdx = this.$store.state.userdata.data.ram
      const vgaIdx = this.$store.state.userdata.data.vga

      this.psuImage = './static/broken.png'
      this.cpuImage = cpuIdx !== -1 ? './static/' + this.cpu[cpuIdx].src : './static/broken.png'
      this.ramImage = ramIdx !== -1 ? './static/' + this.ram[ramIdx].src : './static/broken.png'
      this.vgaImage = vgaIdx !== -1 ? './static/' + this.vga[vgaIdx].src : './static/broken.png'
    },
    overclockCostUpdate () {
      const cpuIdx = this.$store.state.userdata.data.cpu
      const ramIdx = this.$store.state.userdata.data.ram
      const vgaIdx = this.$store.state.userdata.data.vga

      const cpuLv = this.$store.state.userdata.data.cpuLv
      const ramLv = this.$store.state.userdata.data.ramLv
      const vgaLv = this.$store.state.userdata.data.vgaLv

      this.cpuOverClockCost = this.cpu[cpuIdx] ? Math.floor((cpuLv + 1) * 0.05 * this.cpu[cpuIdx].price) : 0
      this.ramOverClockCost = this.ram[ramIdx] ? Math.floor((ramLv + 1) * 0.05 * this.ram[ramIdx].price) : 0
      this.vgaOverClockCost = this.vga[vgaIdx] ? Math.floor((vgaLv + 1) * 0.05 * this.vga[vgaIdx].price) : 0
    },
    overclock (moduleName) {
      console.log(moduleName)
      console.log(this.cpuOverClockCost, this.ramOverClockCost, this.vgaOverClockCost)
    }
  }
}
</script>

<style>
/* 팝업 내 아이템 */
.popup-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  margin-top: 20px;
}

.computer-module-type {
font-size: 1.2rem;
}

/* 팝업 아이템 내의 하위 항목 (상세정보) */
.popup-sub-item {
  margin: 5px 0;
}

.popup-sub-item-2 {
  margin: 5px 0;
  color: #e45641;
}

/* 컴퓨터 부품 명 */
.module-name {
  margin: 10px 0;
  color: #44b3c2;
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
</style>
