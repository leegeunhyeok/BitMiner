<template>
  <div id="city">
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
    <button id="go-to-home" @click="$emit('changeLocation', 'home')">돌아가기</button>
  </div>
</template>

<script>
export default {
  name: 'city'
}
</script>

<style>

#city {
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

/* RAM 매장 영역 */
#ram-store {
  top: 50px;
  left: 195px;
  height: 150px;
}

/* CPU 매장 영역 */
#cpu-store {
  top: 270px;
  left: 50px;
  height: 180px;
}

/* VGA 매장 영역 */
#vga-store {
  top: 290px;
  left: 186px;
  height: 180px;
}

/* 기타 소모품 매장 영역 */
#other-store {
  top: 250px;
  right: 4px;
  height: 150px;
}
</style>
