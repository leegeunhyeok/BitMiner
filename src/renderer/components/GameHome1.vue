<template>
  <div id="home-1">
    <div id="my-computer" @click="$emit('openPopup', 'computer', '내 컴퓨터')">
      <div id="computer-icon">
        <div class="arrow-area">내 컴퓨터</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="phone" @click="$emit('openPhone')">
      <div id="phone-icon">
        <div class="arrow-area">스마트폰</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="door" @click="goToCity">
      <div id="door-icon">
        <div class="arrow-area">외출하기</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home1',
  methods: {
    /**
     * @description 도시로 외출
     */
    goToCity () {
      document.getElementById('door-effect').play()
      this.$emit('changeLocation', 'city1')
    }
  }
}
</script>

<style>
#home-1 {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url('~@/assets/room1.png') no-repeat center;
  z-index: 0;
}

/* 내 컴퓨터 영역 */
#my-computer {
  cursor: pointer;
  position: absolute;
  top: 150px;
  left: 230px;
  height: 180px;
  text-align: center;
  animation: arrow 1s alternate infinite;
}

.my-computer-image {
  width: 100px;
  height: 100px;
}

/* 핸드폰 영역 */
#phone {
  cursor: pointer;
  position: absolute;
  top: 250px;
  right: 296px;
  height: 180px;
  text-align: center;
  animation: arrow 1s alternate infinite;
}

/* 현관문 영역 */
#door {
  cursor: pointer;
  position: absolute;
  top: 70px;
  right: 185px;
  height: 280px;
  text-align: center;
  animation: arrow 1s alternate infinite;
}
</style>
