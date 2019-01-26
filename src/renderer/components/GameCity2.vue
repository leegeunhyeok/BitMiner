<template>
  <div id="city2" v-if="estate === false">
    <div id="go-to-city-1" class="move-left" @click="$emit('changeLocation', 'city1')">
      <div id="city2-icon">
        <img src="~@/assets/arrow_2.png" class="left">
        <div class="arrow-area left-city-text">옆 동네</div>
      </div>
    </div>
    <div id="real-estate" class="store" @click="estateToggle">
      <div id="estate-icon">
        <div class="arrow-area">부동산</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="electronic-store" class="store" @click="$emit('openPopup', 'electronic', '전자제품 매장')">
      <div id="electronic-icon">
        <div class="arrow-area">전자제품 매장</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="lottery-ticket-store" class="store" @click="$emit('openPopup', 'ticket', '복권 매장')">
      <div id="lottery-ticket-icon">
        <img class="" src="~@/assets/arrow.png">
        <div class="arrow-area">복권 매장</div>
      </div>
    </div>
    <button id="go-to-home" @click="$emit('changeLocation', 'home')">돌아가기</button>
  </div>
  <div id="real-estate-area" v-else>
    <div id="buy-home" class="store" @click="$emit('openPopup', 'estate', '주택 매매')">
      <div id="buy-home-icon">
        <div class="arrow-area">주택 매매</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <button id="exit-estate" @click="estate = false">나가기</button>
  </div>
</template>

<script>
export default {
  name: 'city-2',
  data () {
    return {
      /* 부동산 영역 보이기/숨기기 */
      estate: false
    }
  },
  methods: {
    /**
     * @description 부동산 영역 열기
     */
    estateToggle () {
      if (!this.estate) {
        this.$emit('playSound', 'shop')
        this.estate = true
      } else {
        this.estate = false
      }
    }
  }
}
</script>

<style>

#city2 {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url('~@/assets/city2.png') no-repeat center;
  background-size: cover;
  z-index: 0
}

/* 부동산 선택 영역 */
#real-estate {
  top: 200px;
  left: 50px;
  height: 180px;
}

/* City1 이동 */
#go-to-city-1 {
  top: 100px;
  left: 40px;
  height: 50px;
}

#real-estate-area {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url('~@/assets/estate.png') no-repeat center;
  background-size: cover;
  z-index: 0
}

#exit-estate {
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

#exit-estate:hover {
  background-color: #fff;
  color: #c54040;
}

#buy-home {
  position: absolute;
  top: 150px;
  left: 110px;
  height: 200px;
}

#electronic-store {
  top: 200px;
  left: 340px;
  height: 250px;
}

#lottery-ticket-store {
  top: 50px;
  right: 190px;
  height: 180px;
}

#lottery-ticket-icon {
  margin-top: 100px;
}

#lottery-ticket-icon img {
  transform: rotate(180deg);
}

.left {
  float: left;
  transform: rotate(90deg);
}

.move-left {
  position: absolute;
  cursor: pointer;
  animation: left 1s alternate infinite;
}

.left-city-text {
  float: left;
  margin-left: 10px;
}

/* 아이콘 위 아래로 움직이는 애니메이션 */
@keyframes left {
  100% {
    transform: translateX(-20px);
  }
}

</style>
