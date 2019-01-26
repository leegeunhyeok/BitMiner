const state = {
  /* 배경음악 재생 여부 */
  bgm: true,
  /* 채굴 가능 여부 */
  mineAvailable: false,
  /* 1코인당 가격 */
  coinPrice: 0,
  /* 1초당 코인 채굴량 */
  coinPerSecond: 0,
  /* 부스트 1초당 코인 채굴량 */
  boostCoinPerSecond: 0,
  /* 부스트 퍼센트 */
  boostPercent: 0,
  /* 부스트 지속 시간 */
  boostTime: 0,
  /* CPU 채굴량 */
  cpuCoin: 0,
  /* 램 채굴량 */
  ramCoin: 0,
  /* 그래픽카드 채굴량 */
  vgaCoin: 0,
  /* 게임 종료 true, false (상태 변화만 감지하기 때문에 t, f 값은 의미 없음) */
  exit: false
}

const mutations = {
  /* 현재 배경음악 재생 상태 토글 */
  BGM_TOGGLE (state) {
    state.bgm = !state.bgm
  },
  /* 채굴가능 여부 true 로 설정 */
  MINING (state) {
    state.mineAvailable = true
  },
  /* PSU 레벨에 따른 1코인 가격 설정 */
  SET_COIN_PRICE (state, level) {
    state.coinPrice = Math.floor(Math.random() * ((level + 1) * 5)) + 1
  },
  /* 게임 종료, 부스트 시간 및 채굴량 0으로 초기화 */
  EXIT (state) {
    state.exit = !state.exit
    state.boostPercent = 0
    state.boostTime = 0
  },
  /* 부품 별 채굴량 설정 */
  MODULE_TOTAL_COIN (state, totals) {
    state.cpuCoin = totals['cpu']
    state.ramCoin = totals['ram']
    state.vgaCoin = totals['vga']
  },
  /* 1초당 채굴 코인 */
  COIN_PER_SECOND (state, coin) {
    state.coinPerSecond = parseFloat(coin)
  },
  /* 부스트 사용 설정 */
  BOOST (state, boost) {
    state.boostPercent = boost
    state.boostTime = 60
  },
  /* 부스트 코인 채굴량 설정 */
  BOOST_UPDATE (state) {
    state.boostCoinPerSecond = parseFloat(state.coinPerSecond * (state.boostPercent / 100).toFixed(3))
  },
  /* 1초당 부스트 시간 감소 및 초기화 */
  BOOST_TIME_DOWN (state) {
    if (state.boostTime > 0) {
      state.boostTime--
    } else {
      state.boostCoinPerSecond = 0
      state.boostPercent = 0
      state.boostTime = 0
    }
  }
}

export default {
  state,
  mutations
}
