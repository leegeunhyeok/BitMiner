const state = {
  /* 유저 데이터 */
  data: null
}

const mutations = {
  /* 데이터 설정 */
  LOAD_DATA (state, data) {
    state.data = data
  },
  /* 데이터의 지정 Key 값을 value 값으로 지정 */
  SET_DATA (state, data) {
    state.data[data.key] = data.value
  }
}

export default {
  state,
  mutations
}
