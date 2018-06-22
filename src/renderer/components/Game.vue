<template>
  <div id="game">
    <audio src="./static/sound/coin.mp3" id="coin-effect"></audio>
    <audio src="./static/sound/computer.mp3" id="computer-effect"></audio>
    <audio src="./static/sound/door.mp3" id="door-effect"></audio>
    <audio src="./static/sound/phone.mp3" id="phone-effect"></audio>
    <audio src="./static/sound/shop.mp3" id="shop-effect"></audio>
    <game-header></game-header>
    <tutorial v-if="tutorialShow" @exitTutorial="exitTutorial" @changeLocation="changeLocation" @notify="showNotify"></tutorial>
    <game-home v-if="location === 'home'" @changeLocation="changeLocation" @openPopup="openPopup" @openPhone="openPhone"></game-home>
    <game-city v-if="location === 'city'" @changeLocation="changeLocation" @openPopup="openPopup"></game-city>
    <transition name="fade">
      <popup @closePopup="popup = false" v-if="popup" :type="popupType" :title="popupTitle" @notify="showNotify" @save="$emit('save')"></popup>
    </transition>
    <transition name="fade" mode="out-in">
      <notify v-if="notify" :message="notifyMessage"></notify>
    </transition>
    <transition name="phone" mode="in-out">
      <phone @closePhone="phone = false" v-if="phone" @save="$emit('save')"></phone>
    </transition>
    <button id="game-exit" v-if="location === 'home'" @click="gameExit">종료</button>
  </div>
</template>

<script>
import cpu from '../models/cpu.js'
import ram from '../models/ram.js'
import vga from '../models/vga.js'

export default {
  name: 'game',
  data () {
    return {
      tutorialShow: false,
      location: 'home',
      popup: false,
      popupType: '',
      popupTitle: '',
      notify: false,
      notifyMessage: '',
      phone: false,
      loop: null
    }
  },
  components: {
    'tutorial': require('@/components/Tutorial').default,
    'game-header': require('@/components/GameHeader').default,
    'game-home': require('@/components/GameHome').default,
    'game-city': require('@/components/GameCity').default,
    'popup': require('@/components/Popup').default,
    'phone': require('@/components/PopupPhone').default,
    'notify': require('@/components/Notify').default
  },
  computed: {
    tutorial () {
      return this.$store.state.userdata.data.tutorial === 1
    },
    exitStatus () {
      return this.$store.state.info.exit
    }
  },
  watch: {
    tutorial (newVal, oldVal) {
      this.tutorialShow = newVal === 1
    },
    exitStatus (newVal, oldVal) {
      clearInterval(this.loop)
      this.$router.push({name: 'main'})
    }
  },
  created () {
    this.calcCoinPerSecond()
    this.$store.commit('SET_COIN_PRICE', this.$store.state.userdata.data.psu)
    this.location = 'home'
    this.tutorialShow = this.tutorial
  },
  mounted () {
    this.start()
  },
  methods: {
    start () {
      let time = 0
      this.loop = setInterval(() => {
        const coin = this.$store.state.userdata.data.coin
        const coinPerSecond = this.$store.state.info.coinPerSecond
        const coinPerSecondBoost = this.$store.state.info.boostCoinPerSecond
        const totalCoin = coin + coinPerSecond + coinPerSecondBoost
        this.$store.commit('BOOST_TIME_DOWN')
        this.$store.commit('SET_DATA', {key: 'coin', value: totalCoin})
        if (time % 60 === 0) {
          this.$emit('save')
          this.$store.commit('SET_COIN_PRICE', this.$store.state.userdata.data.psu)
        }
        time++
      }, 1000)
    },
    changeLocation (location) {
      if (location === 'city') {
        document.getElementById('door-effect').play()
      }
      this.popup = this.phone = false
      this.location = location
    },
    exitTutorial () {
      this.$store.commit('SET_DATA', {key: 'tutorial', value: 0})
      this.$emit('save')
    },
    gameExit () {
      this.$emit('openDialog', {type: 'exit', message: '정말 종료하시겠습니까?'})
    },
    openPopup (type, title) {
      if (!this.popup) {
        if (type === 'computer') {
          document.getElementById('computer-effect').play()
        } else if (type.search('store')) {
          document.getElementById('shop-effect').play()
        }

        if (this.phone) {
          this.phone = false
        }
        this.popupType = type
        this.popupTitle = title
        this.popup = true
      } else {
        this.popup = false
      }
    },
    openPhone () {
      if (!this.phone) {
        document.getElementById('phone-effect').play()
        if (this.popup) {
          this.popup = false
        }
        this.phone = true
      } else {
        this.phone = false
      }
    },
    showNotify (message) {
      this.notifyMessage = message
      this.notify = true

      setTimeout(() => {
        this.notify = false
      }, 2500)
    },
    calcCoinPerSecond () {
      const cpuNum = this.$store.state.userdata.data.cpu
      const ramNum = this.$store.state.userdata.data.ram
      const vgaNum = this.$store.state.userdata.data.vga

      const cpuLv = this.$store.state.userdata.data.cpuLv
      const ramLv = this.$store.state.userdata.data.ramLv
      const vgaLv = this.$store.state.userdata.data.vgaLv

      if (cpuNum !== -1 && vgaNum !== -1 && ramNum !== -1) {
        const cpuCoin = cpu[cpuNum].coin
        const ramCoin = ram[ramNum].coin
        const vgaCoin = vga[vgaNum].coin

        const cpuBoostCoin = cpu[cpuNum].coin * ((cpuLv) / 10)
        const ramBoostCoin = ram[ramNum].coin * ((ramLv) / 10)
        const vgaBoostCoin = vga[vgaNum].coin * ((vgaLv) / 10)

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
#game {
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #353535;
}

/* 영역 표시 아이콘 */
.arrow-area {
  font-weight: bold;
  background-color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 2px;
}

/* 아이콘 위 아래로 움직이는 애니메이션 */
@keyframes arrow {
  100% {
    transform: translateY(20px);
  }
}

/* 게임 종료 버튼 */
#game-exit {
  outline: none;
  cursor: pointer;
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #c54040;
  border: 1px solid #c54040;
  color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
  transition: .5s;
}

#game-exit:hover {
  background-color: #fff;
  color: #c54040;
}

.phone-enter-active, .phone-leave-active {
  transition: all .5s;
}
.phone-enter, .phone-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
