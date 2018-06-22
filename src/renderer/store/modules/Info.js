const state = {
  mineAvailable: false,
  coinPrice: 0,
  coinPerSecond: 0,
  boostCoinPerSecond: 0,
  boostPercent: 0,
  boostTime: 0,
  cpuCoin: 0,
  ramCoin: 0,
  vgaCoin: 0,
  exit: false
}

const mutations = {
  MINING (state) {
    state.mineAvailable = true
  },
  SET_COIN_PRICE (state, level) {
    state.coinPrice = Math.floor(Math.random() * (level * 10)) + 1
  },
  EXIT (state) {
    state.exit = !state.exit
    state.boostPercent = 0
    state.boostTime = 0
  },
  MODULE_TOTAL_COIN (state, totals) {
    state.cpuCoin = totals['cpu']
    state.ramCoin = totals['ram']
    state.vgaCoin = totals['vga']
  },
  COIN_PER_SECOND (state, coin) {
    state.coinPerSecond = parseFloat(coin)
  },
  BOOST (state, boost) {
    state.boostPercent = boost
    state.boostTime = 60
  },
  BOOST_UPDATE (state) {
    state.boostCoinPerSecond = parseFloat(state.coinPerSecond * (state.boostPercent / 100).toFixed(3))
  },
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
