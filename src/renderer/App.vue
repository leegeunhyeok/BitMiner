<template>
  <div id="app">
    <audio src="./static/sound/bgm.mp3" autoplay loop></audio>
    <router-view @openDialog="openDialog" @save="fileSave"></router-view>
    <transition name="fade">
      <dialog-view v-if="dialog" :message="message" @closeDialog="closeDialog"></dialog-view>
    </transition>
  </div>
</template>

<script>
import fs from 'fs'
import path from 'path'

const defaultSaveData = {
  /* 게임 내 진행 일 수 */
  'days': 0,
  /* 보유 코인 수 */
  'coin': 0,
  /* 보유 현금 */
  'money': 5000,
  /* CPU 종류 */
  'cpu': -1,
  /* CPU 레벨 */
  'cpuLv': 0,
  /* 램 종류 */
  'ram': -1,
  /* 램 레벨 */
  'ramLv': 0,
  /* 그래픽카드 종류 */
  'vga': -1,
  /* 그래픽카드 레벨 */
  'vgaLv': 0,
  /* 파워서플라이 레벨 */
  'psu': 1,
  /* 튜토리얼 여부 */
  'tutorial': 1
}

export default {
  name: 'bit-miner',
  data () {
    return {
      userDataPath: '',
      fileName: 'user.dat',
      dialog: false,
      message: ''
    }
  },
  components: {
    'dialog-view': require('@/components/Dialog').default
  },
  created () {
    this.userDataPath = this.$electron.remote.app.getPath('userData')
    if (this.fileExistCheck()) {
      this.fileLoad()
    } else {
      this.continue = false
    }
  },
  methods: {
    openDialog (data) {
      this.message = data.message
      this.dialogType = data.type
      this.dialog = true
    },
    closeDialog (result) {
      this.dialog = false
      if (result) {
        if (this.dialogType === 'new') {
          this.fileCreate()
          this.fileLoad()
        } else if (this.dialogType === 'exit') {
          this.fileSave()
          this.$store.commit('EXIT')
        }
      }
    },
    fileExistCheck () {
      return fs.existsSync(path.join(this.userDataPath, this.fileName))
    },
    fileCreate () {
      try {
        fs.writeFileSync(path.join(this.userDataPath, this.fileName), JSON.stringify(defaultSaveData), 'utf-8')
      } catch (e) {
        console.log(e)
      }
    },
    fileLoad () {
      try {
        const fs = require('fs')
        const path = require('path')
        const data = JSON.parse(fs.readFileSync(path.join(this.userDataPath, this.fileName)))
        console.log(data)
        this.$store.commit('LOAD_DATA', data)
      } catch (e) {
        console.log(e)
      }
    },
    fileSave () {
      try {
        const fs = require('fs')
        const path = require('path')
        const data = JSON.stringify(this.$store.state.userdata.data)
        fs.writeFileSync(path.join(this.userDataPath, this.fileName), data, 'utf-8')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
/* 폰트 불러오기 */
@font-face {
  font-family: "pixel";
  src:url('~@/assets/fonts/soya-non8.ttf') format('truetype');
}

/* HTML 모든 요소 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  cursor: default;
  user-select: none;
}

/* HTML, BODY 모두 가로, 세로 크기 100%(꽉 채우기) */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* BODY 폰트를 위에서 불러온 pixel로 지정 */
body, button, input {
  font-family: 'pixel';
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
