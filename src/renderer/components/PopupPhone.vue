<template>
  <div id="popup-phone" class="popup-hide">
    <div class="phone-screen">
      <div class="phone-header">코인샵</div>
      <div class="phone-content">
        <img src="~@/assets/chart.png">
        <div class="phone-footer">
          <h5>코인 시세는 1분마다 갱신됩니다.</h5>
          <div>
            1 BTC = <b id="coin-price">0</b>원
          </div>
          <input id="sell-count" type="number" placeholder="개">
          <button id="sell-button">매도</button>
          <div>
            예상: <b id="prediction-money">0</b>원
          </div>
        </div>
      </div>
    </div>
    <div id="phone-exit" @click="$emit('closePhone')"></div>
  </div>
</template>

<script>
export default {
  name: 'phone'
}
</script>

<style>
/* 핸드폰 영역 */

#popup-phone {
  position: absolute;
  width: 320px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 24px;
  background-color: #222;
  padding: 25px 20px;
  padding-bottom: 70px;
  z-index: 4;
}

/* 핸드폰 스크린 */
.phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

/* 핸드폰 닫기 버튼 */
#phone-exit {
  position: absolute;
  cursor: pointer;
  bottom: 10px;
  left: 50%;
  width: 50px;
  height: 50px;
  transform: translateX(-50%);
  text-align: center;
  background-color: #ddd;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.8rem;
  padding-top: 4px;
  padding-left: 2px;
  color: #c54040;
}

#phone-exit::before {
  content: 'x'
}

#phone-exit:hover {
  background-color: #aaa;
}

.phone-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #f0aa28;
  font-size: 1.4rem;
  font-weight: bold;
}

.phone-content {
  width: 100%;
  height: 100%;
  padding-top: 55px;
  background-color: #efe3af;
}

.phone-footer {
  background-color: #fff;
  border-top: 2px solid #f0aa28;
}

#sell-count {
  cursor: text;
  outline: none;
  border-radius: 5px;
  border: 1px solid #f0aa28;
}

/* 매도 버튼 */
#sell-button {
  cursor: pointer;
  outline: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px 0px;
  background-color: #f0aa28;
  border: 1px solid #f0aa28;
  color: #000;
  transition: .5s;
}

#sell-button:hover {
  background-color: #fff;
  color: #f0aa28;
}

</style>
