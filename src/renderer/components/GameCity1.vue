<template>
  <div id="city1">
    <div id="ram-store" class="store" @click="$emit('openPopup', 'ramStore', '램 매장')">
      <div id="ram-icon">
        <div class="arrow-area">램 매장</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="cpu-store" class="store" @click="$emit('openPopup', 'cpuStore', 'CPU 매장')">
      <div id="cpu-icon">
        <div class="arrow-area">CPU 매장</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="vga-store" class="store" @click="$emit('openPopup', 'vgaStore', '그래픽카드 매장')">
      <div id="vga-icon">
        <div class="arrow-area">그래픽카드 매장</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="other-store" class="store" @click="$emit('openPopup', 'otherStore', '기타 소모품 매장')">
      <div id="other-icon">
        <div class="arrow-area">기타 소모품 매장</div>
        <img src="~@/assets/arrow.png">
      </div>
    </div>
    <div id="go-to-city-2" class="move-right" @click="$emit('changeLocation', 'city2')">
      <div id="city2-icon">
        <div class="arrow-area right-city-text">옆 동네</div>
        <img src="~@/assets/arrow_2.png" class="right">
      </div>
    </div>
    <button id="go-to-home" @click="$emit('changeLocation', 'home')">돌아가기</button>
  </div>
</template>

<script>
export default {
  name: 'city-1'
}
</script>

<style>

#city1 {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url('~@/assets/city.png') no-repeat center;
  background-size: cover;
  z-index: 0
}

/* 집으로 이동 버튼 */
#go-to-home {
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

#go-to-home:hover {
  background-color: #fff;
  color: #c54040;
}

.store {
  position: absolute;
  cursor: pointer;
  animation: arrow 1s alternate infinite;
}

.right {
  float: left;
  transform: rotate(-90deg);
}

.move-right {
  position: absolute;
  cursor: pointer;
  animation: right 1s alternate infinite;
}

.right-city-text {
  float: left;
  margin-right: 10px;
}

/* 아이콘 위 아래로 움직이는 애니메이션 */
@keyframes right {
  100% {
    transform: translateX(20px);
  }
}

/* RAM 매장 영역 */
#ram-store {
  top: 50px;
  left: 195px;
  height: 200px;
}

/* CPU 매장 영역 */
#cpu-store {
  top: 270px;
  left: 50px;
  height: 220px;
}

/* VGA 매장 영역 */
#vga-store {
  top: 290px;
  left: 186px;
  height: 250px;
}

/* 기타 소모품 매장 영역 */
#other-store {
  top: 250px;
  right: 4px;
  height: 200px;
}

/* City2 이동 */
#go-to-city-2 {
  bottom: 60px;
  right: 80px;
  height: 50px;
}

</style>
