<template>
  <div id="main-menu">
    <!-- 게임 타이틀 -->
      <div id="title">Bit Miner</div>
      <!-- 버튼 영역 -->
      <div id="menu-button-area" v-if="menu">
        <div class="menu-button">
          <b class="menu-text" id="continue" @click="continueGame">이어서하기</b>
        </div>
        <div class="menu-button">
          <b class="menu-text" @click="newGame">새로하기</b>
        </div>
        <div class="menu-button">
          <b class="menu-text" @click="information">정보</b>
        </div>
        <div class="menu-button">
          <b class="menu-text" @click="exit">종료</b>
        </div>
      </div>
      <!-- 정보화면 -->
      <div id="information" class="hide" v-else>
        <div id="information-info">
          Design &amp; Develop<br>
          <b>Leegeunhyeok</b>
          <br>
          <br>
          <button id="lastest-version" @click="lastestVersion">최신버전</button>
        </div>
        <button id="information-exit" @click="main">메인으로</button>
      </div>
      <!-- 버전 -->
      <div id="version">0.0.11 Beta</div>
  </div>
</template>

<script>
export default {
  name: 'main-menu',
  data () {
    return {
      /* 메인메뉴, 정보 창 여부 */
      menu: true
    }
  },
  created () {
    this.menu = true
  },
  mounted () {
    /* 유저 데이터가 없을 경우 이어서 하기 버튼에 클래스 추가 */
    if (this.$store.state.userdata.data === null) {
      document.getElementById('continue').classList.add('disable-text')
    }
  },
  computed: {
    /* Vuex의 유저 데이터 감시를 위해 선언 */
    continueAvaiable () {
      return this.$store.state.userdata.data
    }
  },
  watch: {
    /* 유저 데이터의 변경이 감시될 경우 이어서하기 버튼 클래스 삭제 및 게임 이어서 진행 */
    continueAvaiable (newVal, oldVal) {
      document.getElementById('continue').classList.remove('disable-text')
      this.continueGame()
    }
  },
  methods: {
    /**
     * @description 게임 이어서 하기
     */
    continueGame () {
      /* 유저 데이터가 있는 경우 */
      if (this.$store.state.userdata.data) {
        this.$router.push({name: 'game'})
      }
    },
    /**
     * @description 새 게임 시작
     */
    newGame () {
      /* 대화창 띄우기 */
      this.$emit('openDialog', {type: 'new', message: '정말 새로 시작하시겠습니까?'})
    },
    /**
     * @description 정보 화면 보여주기
     */
    information () {
      this.menu = false
    },
    /**
     * @description 최신 버전 확인
     */
    lastestVersion () {
      /* 컴퓨터의 웹 브라우저로 띄워주기 */
      this.$electron.shell.openExternal('https://github.com/leegeunhyeok/BitMiner/releases/latest')
    },
    /**
     * @description 메인 화면 보여주기
     */
    main () {
      this.menu = true
    },
    /**
     * @description 게임 종료
     */
    exit () {
      /* Electrong 윈도우를 닫습니다 */
      this.$electron.remote.getCurrentWindow().close()
    }
  }
}
</script>

<style>
/* 메인화면 배경 이미지, 영역 크기 지정 */
#main-menu {
  background: url('~@/assets/background.png') no-repeat center fixed;
  background-size: cover;
  width: 100%;
  height: 100%;
  text-align: center;
}

/* 메인화면 게임 타이틀 */
#title {
  padding-top: 50px;
  display: inline-block;
  color: #ffd800;
  text-shadow: 0px 0px 20px #000;
  font-size: 4.5rem;
  text-align: center;
  animation: swing 1s alternate infinite;
}

/* 게임 타이틀 흔들리는 애니메이션 */
@keyframes swing {
  0% {
      transform: rotate(5deg);
  }

  100% {
      transform: rotate(-5deg);
  }
}

/* 메인메뉴 버튼 영역 */
#menu-button-area {
  margin: auto;
  margin-top: 140px;
  font-size: 1.5rem;
}

/* 메인메뉴 버튼 위, 아래(세로) 여백 */
.menu-button {
  margin: 10px 0;
}

/* 메인메뉴 버튼 텍스트, 마우스 모양, 트렌지션 적용 */
.menu-text {
  cursor: pointer;
  transition: .2s;
}

/* 마우스가 버튼 텍스트 위로 올라가면 텍스트 색 변경 */
.menu-text:hover {
  color: #ffd800;
  text-shadow: 0px 0px 10px #000;
}

/* 버전 텍스트 */
#version {
  position: absolute;
  bottom: 5px;
  right: 5px;
}


/* 정보 영역 */
#information {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: #000;
  text-align: center;
}

/* 개발자, 디자이너 정보 */
#information-info {
  padding: 20px 15px;
  background-color: #fff;
  border-radius: 10px;
}

/* 최신버전 확인 버튼 */
#lastest-version {
  cursor: pointer;
  display: inline-block;
  padding: 5px 10px;
  background-color: #50b970;
  border: 1px solid #50b970;
  border-radius: 5px;
  margin: 10px 0px;
  color: #fff;
}

#lastest-version:hover {
  background-color: #fff;
  color: #50b970;
}

/* 메인으로 이동하는 버튼 */
#information-exit {
  cursor: pointer;
  display: inline-block;
  padding: 5px 10px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #e45641;
  border: 1px solid #e45641;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
}

#information-exit:hover {
  background-color: #fff;
  color: #e45641;
}

/* 비활성화 텍스트 (이어하기 못할 경우 추가되는 클래스) */
.disable-text {
  cursor: default;
  color: #525252;
}

.disable-text:hover {
  color: #525252;
}
</style>
