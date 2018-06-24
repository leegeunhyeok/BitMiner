<template>
  <div id="app">
    <audio src="./static/sound/bgm.mp3" id="bgm" autoplay loop></audio>
    <!-- 메인화면, 게임 등 라우터 경로에 따른 뷰 영역 -->
    <router-view @openDialog="openDialog" @save="fileSave"></router-view>
    <transition name="fade">
      <!-- 대화창 -->
      <dialog-view v-if="dialog" :message="message" @closeDialog="closeDialog"></dialog-view>
    </transition>
    <!-- 배경음악 On/Off 버튼 -->
    <button id="bgm-button" @click="bgmToggle">{{ bgm }}</button>
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
  'money': 3000,
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
      /* 유저 데이터 경로 */
      userDataPath: '',
      /* 유저 세이브파일 명 */
      fileName: 'user.dat',
      /* 대화창 닫힘/열림 */
      dialog: false,
      /* 대화창에 보여질 메시지 */
      message: ''
    }
  },
  computed: {
    /* Vuex 배경음악 재생 상태에 따른 메시지 */
    bgm () {
      return this.$store.state.info.bgm ? '배경음악 끄기' : '배경음악 켜기'
    }
  },
  components: {
    /* 대화창 컴포넌트 */
    'dialog-view': require('@/components/Dialog').default
  },
  created () {
    /* 데이터 경로 불러오기 */
    this.userDataPath = this.$electron.remote.app.getPath('userData')
    if (this.fileExistCheck()) {
      /* 파일이 존재하면 Load */
      this.fileLoad()
    }
  },
  methods: {
    /**
     * @description 대화창 열기
     * @param {any} data {message: '메시지', type: '유형'} 형식의 객체
     * 사용 가능한 type: new, exit
     */
    openDialog (data) {
      this.message = data.message
      this.dialogType = data.type
      this.dialog = true
    },
    /**
     * @description 대화창 닫기
     * @param {boolean} result 예 버튼(true), 아니오 버튼(false) 값
     */
    closeDialog (result) {
      /* 대화창 보이기 여부 false */
      this.dialog = false
      /* 결과가 '예' 인 경우 */
      if (result) {
        /* 대화창 타입에 따라 알맞는 기능 */
        if (this.dialogType === 'new') {
          this.fileCreate()
          this.fileLoad()
        } else if (this.dialogType === 'exit') {
          this.fileSave()
          this.$store.commit('EXIT')
        }
      }
    },
    /**
     * @description 세이브파일 여부 확인
     * @return {boolean} 존재하는지에 대한 여부
     */
    fileExistCheck () {
      return fs.existsSync(path.join(this.userDataPath, this.fileName))
    },
    /**
     * @description 파일 새로 생성
     */
    fileCreate () {
      try {
        fs.writeFileSync(path.join(this.userDataPath, this.fileName), JSON.stringify(defaultSaveData), 'utf-8')
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * @description 파일 불러온 후 Vuex에 유저 데이터로 설정
     */
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
    /**
     * @description 파일 저장
     */
    fileSave () {
      try {
        const fs = require('fs')
        const path = require('path')
        const data = JSON.stringify(this.$store.state.userdata.data)
        fs.writeFileSync(path.join(this.userDataPath, this.fileName), data, 'utf-8')
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * @description 배경음악 토글 (Vuex 상태 토글)
     */
    bgmToggle () {
      this.$store.commit('BGM_TOGGLE')
      const bgm = document.getElementById('bgm')
      const on = this.$store.state.info.bgm

      if (on) {
        bgm.play()
      } else {
        /* 음악 일시 정지 후 재생시간 0으로 설정 */
        bgm.pause()
        bgm.currentTime = 0
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

/* 페이드 트렌지션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 배경음악 토글 버튼 */
#bgm-button {
  cursor: pointer;
  outline: none;
  position: absolute;
  left: 5px;
  bottom: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-family: 'pixel';
  background-color: #779ecb;
  color: #fff;
}

#bgm-button:hover {
  background-color: #6384aa;
}
</style>
