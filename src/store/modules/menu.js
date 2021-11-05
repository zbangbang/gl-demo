const state = {
  glShow: false,
  threeShow: false,
}

const mutations = {
  // webgl页面显隐
  setGlShow(state, val) {
    state.glShow = val
  },
  // three.js页面显隐
  setThreeShow(state, val) {
    state.threeShow = val
  },
}

const actions = {

}

const getters = {

}

export default {
  namespace: true,
  state,
  mutations,
  actions,
  getters
}