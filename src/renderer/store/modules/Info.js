const state = {
  coinPerSecond: 0,
  coinPerSecondBoost: 0,
  boostPercent: 0,
  boostTime: 0,
  exit: false
}

const mutations = {
  EXIT (state) {
    state.exit = !state.exit
  }
}

export default {
  state,
  mutations
}
