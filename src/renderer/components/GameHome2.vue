<template>
  <div id="home-2">
    <img id="monitor" :src="monitor">
    <div id="my-computer-2" @click="$emit('openPopup', 'computer', '내 컴퓨터')">
      <div id="computer-icon">
        <div class="arrow-area">내 컴퓨터</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="coin-computer-2" @click="$emit('openMonitor')">
      <div id="phone-icon">
        <div class="arrow-area">코인샵</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="door-2" @click="goToCity">
      <div id="door-icon">
        <div class="arrow-area">외출하기</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home2',
  data () {
    return {
      /* 현재 사용중인 모니터 이미지 경로 */
      monitor: ''
    }
  },
  created () {
    this.monitorImageUpdate()
  },
  methods: {
    /**
     * @description 모니터 이미지 갱신
     */
    monitorImageUpdate () {
      this.monitor = './static/monitor/' + (this.$store.state.userdata.data.monitor || 1) + '.png'
    },
    /**
     * @description 도시로 외출
     */
    goToCity () {
      this.$emit('playSound', 'door')
      this.$emit('changeLocation', 'city1')
    }
  }
}
</script>

<style>
#home-2 {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url('~@/assets/room2.png') no-repeat center;
  z-index: 0;
}

/* 모니터 가격 */
#monitor {
  position: absolute;
  top: 210px;
  right: 243px;
}

/* 내 컴퓨터 영역 */
#my-computer-2 {
  cursor: pointer;
  position: absolute;
  top: 140px;
  left: 330px;
  height: 180px;
  text-align: center;
  animation: arrow 1s alternate infinite;
}

/* 코인 판매 영역 */
#coin-computer-2 {
  cursor: pointer;
  position: absolute;
  top: 110px;
  right: 270px;
  height: 180px;
  text-align: center;
  animation: arrow 1s alternate infinite;
}

/* 현관문 영역 */
#door-2 {
  cursor: pointer;
  position: absolute;
  bottom: 70px;
  right: 90px;
  height: 180px;
  text-align: center;
  animation: arrow 1s alternate infinite;
}
</style>
