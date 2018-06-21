<template>
  <div id="header">
    <!-- 부스트로 얻는 추가 코인 량 -->
    <span id="coin-per-second-boost">+ {{ $store.state.info.coinPerSecondBoost }}</span>
    <!-- 1초당 코인 -->
    <span id="coin-per-second" class="header-info">{{ $store.state.info.coinPerSecond }} BTC/s</span>
    <!-- 보유중인 코인 -->
    <span id="own-coin" class="header-info">{{ $store.state.userdata.data.coin }} BTC</span>
    <!-- 보유중인 현금 -->
    <span id="own-money" class="header-info">{{ $store.state.userdata.data.money }} 원</span>
    <!-- 부스트 -->
    <span id="boost-percent" class="header-boost">{{ $store.state.info.boostPercent }} %</span>
    <!-- 부스트 남은 시간 -->
    <span id="boost-time" class="header-boost">{{ $store.state.info.boostTime }} 초</span>
  </div>
</template>

<script>
export default {
  name: 'game-header'
}
</script>

<style>
/* 게임 내의 상단 영역(보유 현금 등...) */
#header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;
}

/* 상단 영역 요소(보유 현금, 코인 수 등..) */
.header-info {
  margin: 10px 5px;
  background-color: goldenrod;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  float: right;
}

/* 부스트 활성화 시 추가 코인 량 */
#coin-per-second-boost {
  position: absolute;
  top: 45px;
  right: 5px;
  background-color: #c54040;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  font-size: 0.8rem;
  display: none;
}

.header-boost {
  margin: 10px 5px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  color: #fff;
  float: left;
}

#boost-percent {
  background-color: #c54040;
}

#boost-time {
  background-color: #50b970;
}
</style>
