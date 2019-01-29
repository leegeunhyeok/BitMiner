<template>
  <div id="game">
    <game-header></game-header>
    <tutorial v-if="tutorialShow"
      @exitTutorial="exitTutorial"
      @changeLocation="changeLocation"
      @notify="showNotify"/>
    <game-home-1 v-if="location === 'home1'" 
      @changeLocation="changeLocation"
      @openPopup="openPopup"
      @openPhone="openPhone"
      @playSound="$emit('playSound', $event)"/>
    <game-home-2 v-if="location === 'home2'"
      @changeLocation="changeLocation"
      @openPopup="openPopup"
      @openMonitor="openMonitor"
      @playSound="$emit('playSound', $event)"/>
    <game-city-1 v-if="location === 'city1'"
      @changeLocation="changeLocation"
      @openPopup="openPopup"
      @playSound="$emit('playSound', $event)"/>
    <game-city-2 v-if="location === 'city2'"
      @changeLocation="changeLocation"
      @openPopup="openPopup"
      @closePopup="closePopup"
      @playSound="$emit('playSound', $event)"/>
    <transition name="fade">
      <popup 
        :type="popupType"
        :title="popupTitle"
        @closePopup="popup = false"
        @notify="showNotify"
        @playSound="$emit('playSound', $event)"
        @save="$emit('save')"
        v-if="popup"/>
    </transition>
    <transition name="fade" mode="out-in">
      <notify v-if="notify"
        :message="notifyMessage"/>
    </transition>
    <transition name="fade" mode="out-in">
      <monitor v-if="monitor"
        @closeMonitor="monitor = false"
        @playSound="$emit('playSound', $event)"/>
    </transition>
    <transition name="phone" mode="in-out">
      <phone v-if="phone"
        @closePhone="phone = false"
        @notify="showNotify"
        @playSound="$emit('playSound', $event)"
        @save="$emit('save')"/>
    </transition>
    <transition name="phone" mode="in-out">
      <message-notify v-if="message"
        :message="messageText"/>
    </transition>
    <button id="game-exit" v-if="isHome" @click="gameExit">종료</button>
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
      /* 튜토리얼 보이기 여부 */
      tutorialShow: false,
      /* 게임내의 위치 */
      location: '',
      /* 팝업 보여주기 여부 (매장) */
      popup: false,
      /* 팝업 유형 */
      popupType: '',
      /* 팝업 타이틀 */
      popupTitle: '',
      /* 알림 보여주기 여부 */
      notify: false,
      /* 알림에 보여질 메시지 */
      notifyMessage: '',
      /* 알림 Timeout */
      notifyTimeout: null,
      /* 문자 메시지알림 보여주기 여부 */
      message: false,
      /* 문자 메시지에 보여질 텍스트 */
      messageText: '',
      /* 문자 메시지 Timeout */
      messageTimeout: null,
      /* 핸드폰 팝업 보여주기 여부 */
      phone: false,
      /* 모니터 팝업 보여주기 여부 */
      monitor: false,
      /* 게임 시작 시 Interval 객체 */
      loop: null
    }
  },
  components: {
    'tutorial': require('@/components/Tutorial').default,
    'game-header': require('@/components/GameHeader').default,
    'game-home-1': require('@/components/GameHome1').default,
    'game-home-2': require('@/components/GameHome2').default,
    'game-city-1': require('@/components/GameCity1').default,
    'game-city-2': require('@/components/GameCity2').default,
    'popup': require('@/components/Popup').default,
    'phone': require('@/components/PopupPhone').default,
    'monitor': require('@/components/PopupMonitor').default,
    'notify': require('@/components/Notify').default,
    'message-notify': require('@/components/MessageNotify').default
  },
  computed: {
    /* 튜토리얼 보이기 여부 */
    tutorial () {
      return this.$store.state.userdata.data.tutorial === 1
    },
    /* 게임 종료 여부 */
    exitStatus () {
      return this.$store.state.info.exit
    },
    /* 현재 위치가 집인지 여부 */
    isHome () {
      return this.location.search('home') !== -1
    }
  },
  watch: {
    /* 튜토리얼 보이기 여부가 변경된 후 튜토리얼 보이기/숨기기 지정 */
    tutorial (newVal, oldVal) {
      this.tutorialShow = newVal === 1
    },
    /* 게임 종료 여부 감시(데이터 변경이 감지되면 메인으로 이동) */
    exitStatus (newVal, oldVal) {
      this.$router.push({name: 'main'})
    }
  },
  created () {
    this.calcCoinPerSecond()
    this.$store.commit('SET_COIN_PRICE', this.$store.state.userdata.data.psu)
    this.location = 'home' + (this.$store.state.userdata.data.home + 1)
    this.tutorialShow = this.tutorial
  },
  mounted () {
    this.start()
  },
  beforeDestroy () {
    clearInterval(this.loop)
  },
  methods: {
    /**
     * @description 게임 시작 (setInterval을 통해 1초마다 데이터 갱신)
     */
    start () {
      // 시작 시 바로 1주가 오르는 문제를 방지하기 위해 1로 시작
      let time = 1
      this.loop = setInterval(() => {
        let coin = this.$store.state.userdata.data.coin
        let coinPerSecond = this.$store.state.info.coinPerSecond
        let coinPerSecondBoost = this.$store.state.info.boostCoinPerSecond
        let totalCoin = coin + coinPerSecond + coinPerSecondBoost
        this.$store.commit('BOOST_TIME_DOWN')
        this.$store.commit('SET_DATA', {key: 'coin', value: totalCoin})

        // 모니터 레벨에 따라 -10초씩 (1레벨 모니터 기본 60초)
        let monitor = this.$store.state.userdata.data.monitor
        let coinRefreshSeconds = 60 - ((monitor - 1) * 10)

        // 60초마다 Day 1 증가 (1주)
        if (time % 60 === 0) {
          this.$store.commit('SET_DATA', {key: 'days', value: this.$store.state.userdata.data.days + 1})
          this.$emit('save')
        }

        // 코인 시세 변동량에 따라
        if (time % coinRefreshSeconds === 0) {
          this.$store.commit('SET_COIN_PRICE', this.$store.state.userdata.data.psu)

          if (this.$store.state.userdata.data.isee === 1) {
            this.showMessage('> 코인 시세가 변동되었습니다.')
          }
        }
        time++
      }, 1000)
    },
    /**
     * @description 게임 내 위치 변경
     */
    changeLocation (location) {
      if (location === 'home') {
        location = 'home' + (this.$store.state.userdata.data.home + 1 || '1')
      }
      this.popup = this.phone = this.monitor = this.electronic = false
      this.location = location
    },
    /**
     * @description 튜토리얼 닫기
     */
    exitTutorial () {
      this.$store.commit('SET_DATA', {key: 'tutorial', value: 0})
      this.$emit('save')
    },
    /**
     * @description 게임 종료 버튼 클릭 시 대화창 띄우기
     */
    gameExit () {
      this.$emit('openDialog', {type: 'exit', message: '정말 종료하시겠습니까?'})
    },
    /**
     * @description 팝업 토글 (상점 팝업)
     * @param {string} type 상점 유형
     * @param {string} title 상점 타이틀
     */
    openPopup (type, title) {
      /* 팝업이 닫혀있는 경우 열기 */
      if (!this.popup) {
        if (type === 'computer') {
          this.$emit('playSound', 'computer')
        } else if (type.toLowerCase().indexOf('store') !== -1 ||
                   type === 'electronic' ||
                   type === 'ticket') {
          this.$emit('playSound', 'shop')
        }

        // 다른 팝업 모두 닫기
        this.phone = this.monitor = false

        this.popupType = type
        this.popupTitle = title
        this.popup = true
      } else {
        /* 열려있는 경우 닫기 */
        this.popup = false
      }
    },
    /**
     * @description 팝업 닫기
     */
    closePopup () {
      this.popup = false
    },
    /**
     * @description 핸드폰 팝업 토글
     */
    openPhone () {
      /* 핸드폰 팝업이 닫혀있는 경우 열기 */
      if (!this.phone) {
        this.$emit('playSound', 'phone')

        /* 다른 팝업이 열려있는 경우 닫기 */
        this.popup = this.monitor = false

        this.phone = true
      } else {
        /* 핸드폰 팝업이 열려있는 경우 닫기 */
        this.phone = false
      }
    },
    /**
     * @description 모니터 팝업 토글
     */
    openMonitor () {
      /* 핸드폰 팝업이 닫혀있는 경우 열기 */
      if (!this.monitor) {
        this.$emit('playSound', 'phone')

        /* 다른 팝업이 열려있는 경우 닫기 */
        this.popup = this.phone = false

        this.monitor = true
      } else {
        /* 핸드폰 팝업이 열려있는 경우 닫기 */
        this.monitor = false
      }
    },
    /**
     * @description 알림 띄우기
     * @param {string} 알림에 표시할 메시지
     */
    showNotify (message) {
      // 알림이 이미 있는 경우 기존 알림 닫고 0.5초 후 보여주기
      if (this.notify) {
        this.notify = false
        clearTimeout(this.notifyTimeout)
        setTimeout(() => {
          this.notifyMessage = message
          this.notify = true
          this.notifyTimeout = setTimeout(() => {
            this.notify = false
          }, 2500)
        }, 500)
      } else {
        this.notifyMessage = message
        this.notify = true
        /* 알림은 2.5초 뒤 닫기 */
        this.notifyTimeout = setTimeout(() => {
          this.notify = false
        }, 2500)
      }
    },
    /**
     * @description 메시지 알림 띄우기
     * @param {string} 메시지에 표시할 텍스트
     */
    showMessage (message) {
      // 알림이 이미 있는 경우 기존 알림 닫고 0.5초 후 보여주기
      if (this.message) {
        this.message = false
        clearTimeout(this.messageTimeout)
        setTimeout(() => {
          this.$emit('playSound', 'message')
          this.messageText = message
          this.message = true
          this.messageTimeout = setTimeout(() => {
            this.message = false
          }, 2500)
        }, 500)
      } else {
        this.$emit('playSound', 'message')
        this.messageText = message
        this.message = true
        /* 알림은 2.5초 뒤 닫기 */
        this.messageTimeout = setTimeout(() => {
          this.message = false
        }, 2500)
      }
    },
    /**
     * @description 1초당 채굴되는 코인 량 계산
     */
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
  overflow-y: hidden;
}

/* 영역 표시 아이콘 */
.arrow-area {
  cursor: pointer;
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

/* 핸드폰 팝업 트렌지션 */
.phone-enter-active, .phone-leave-active {
  transition: all .5s;
}

.phone-enter, .phone-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(50px) !important;
}

/* 클릭영역 스타일 */
.store {
  position: absolute;
  cursor: pointer;
  animation: arrow 1s alternate infinite;
}
</style>
