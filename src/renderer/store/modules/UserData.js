const state = {
  data: null
}

const mutations = {
  LOAD_DATA (state, data) {
    state.data = data
  },
  SET_DATA (state, data) {
    state.data[data.key] = data.value
  }
}

export default {
  state,
  mutations
}
