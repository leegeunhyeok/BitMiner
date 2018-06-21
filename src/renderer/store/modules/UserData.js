const state = {
  data: null
}

const mutations = {
  LOAD_DATA (state, data) {
    state.data = data
  },
  SET_DATA (state, key, value) {
    state.data[key] = value
  }
}

export default {
  state,
  mutations
}
