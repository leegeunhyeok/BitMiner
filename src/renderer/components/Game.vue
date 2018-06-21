<template>
  <div id="game">
    <game-header></game-header>
    <tutorial v-if="tutorialShow" @exitTutorial="exitTutorial"></tutorial>
    <game-home v-if="location === 'home'" @changeLocation="changeLocation" @openPopup="openPopup" @openPhone="openPhone"></game-home>
    <game-city v-if="location === 'city'" @changeLocation="changeLocation"></game-city>
    <popup @closePopup="popup = false" v-if="popup" :type="popupType"></popup>
    <phone @closePhone="phone = false" v-if="phone"></phone>
    <button id="game-exit" v-if="location === 'home'" @click="gameExit">종료</button>
  </div>
</template>

<script>
export default {
  name: 'game',
  data () {
    return {
      tutorialShow: false,
      location: 'home',
      popup: false,
      popupType: '',
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
    'phone': require('@/components/PopupPhone').default
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
    this.location = 'home'
    this.tutorialShow = this.tutorial
  },
  mounted () {
    this.start()
  },
  methods: {
    start () {
      this.loop = setInterval(() => {
        console.log('hello')
      }, 1000)
    },
    changeLocation (location) {
      this.popup = this.phone = false
      this.location = location
    },
    exitTutorial () {
      this.$store.commit('SET_DATA', 'tutorial', 0)
      this.$emit('save')
    },
    gameExit () {
      this.$emit('openDialog', {type: 'exit', message: '정말 종료하시겠습니까?'})
    },
    openPopup (type) {
      if (!this.popup) {
        if (this.phone) {
          this.phone = false
        }
        this.popupType = type
        this.popup = true
      } else {
        this.popup = false
      }
    },
    openPhone () {
      if (!this.phone) {
        if (this.popup) {
          this.popup = false
        }
        this.phone = true
      } else {
        this.phone = false
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
</style>
