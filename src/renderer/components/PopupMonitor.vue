<template>
  <div id="popup-monitor">
    <button id="monitor-exit" @click="$emit('closeMonitor')">x</button>
    <div class="monitor-screen">
      <div class="monitor-header">코인샵</div>
      <div class="monitor-content">
        <img src="~@/assets/chart.png">
        <div class="monitor-footer">
          <h5>코인 시세는 1분마다 갱신됩니다.</h5>
          <div>
            1 BTC = <b id="coin-price"> {{ $store.state.info.coinPrice }} </b>원
          </div>
          <div>
            <button id="all-coin-button" @click="all">전체</button>
            <input id="monitor-sell-count" type="number" placeholder="개" v-model="count">
            <button id="monitor-sell-button" @click="sell">매도</button>
          </div>
          <div>
            예상: <b id="prediction-money"> {{ prediction.toLocaleString('en') }} </b>원
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'monitor',
  data () {
    return {
      /* 매도할 코인 수 */
      count: 0
    }
  },
  computed: {
    /* 예상 수익 계산 */
    prediction () {
      return this.count * this.$store.state.info.coinPrice
    }
  },
  methods: {
    /**
     * @description 전체 코인 량 설정
     */
    all () {
      this.count = parseInt(this.$store.state.userdata.data.coin)
    },
    /**
     * @description 매도 버튼
     */
    sell () {
      const coin = this.$store.state.userdata.data.coin
      const money = this.$store.state.userdata.data.money + this.prediction

      /* 매도할 코인 갯수가 보유중인 갯수를 초과하지 않은 경우 */
      if (coin - this.count >= 0 && this.count > 0) {
        document.getElementById('coin-effect').play()
        this.$store.commit('SET_DATA', {key: 'coin', value: coin - this.count})
        this.$store.commit('SET_DATA', {key: 'money', value: money})
        this.count = 0
      } else {
        this.$emit('notify', '최대 매도가능 갯수를 초과하였습니다.')
      }
    }
  }
}
</script>

<style>

/* 모니터 영역 */
#popup-monitor {
  position: absolute;
  width: 600px;
  height: 400px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 24px;
  border: 2px solid #222;
  background-color: #fff;
  padding: 25px 20px;
  padding-bottom: 70px;
  z-index: 4;
}

/* 모니터 스크린 */
.monitor-screen {
  padding: 10px 0px;
  border: 2px solid #000;
  background-color: #fff;
}

/* 모니터 닫기 버튼 */
#monitor-exit {
  outline: none;
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 20px;
  color: #e45641;
  font-weight: bold;
  font-size: 1.3rem;
  border: none;
  background-color: #fff;
}

/* 핸드폰 화면 상단 영역 */
.monitor-header {
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #f0aa28;
  font-size: 1.4rem;
  font-weight: bold;
}

/* 핸드폰 내용 영역 */
.monitor-content {
  width: 100%;
  padding-top: 5px;
  background-color: #efe3af;
}

/* 핸드폰 화면 하단 영역 */
.monitor-footer {
  background-color: #fff;
  border-top: 2px solid #f0aa28;
}

/* 매도 버튼 */
#all-coin-button {
  cursor: pointer;
  outline: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px 0px;
  background-color: #4cbd35;
  border: 1px solid #4cbd35;
  color: #000;
  transition: .5s;
}

#all-coin-button:hover {
  background-color: #fff;
  color: #3f972d;
}

/* 판매 갯수 입력폼 */
#monitor-sell-count {
  width: 56%;
  padding: 2px 5px;
  cursor: text;
  outline: none;
  border-radius: 5px;
  border: 1px solid #f0aa28;
}

/* 매도 버튼 */
#monitor-sell-button {
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

#monitor-sell-button:hover {
  background-color: #fff;
  color: #f0aa28;
}

</style>
