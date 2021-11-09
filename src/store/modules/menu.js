const state = {
  glShow: false,
  threeShow: false,
  glNewShow: false,
}

const mutations = {
  setAllFalse(state) {
    state.glShow = false
    state.threeShow = false
    state.glNewShow = false
  },
  // webgl页面显隐
  setGlShow(state, val) {
    state.glShow = val
  },
  // three.js页面显隐
  setThreeShow(state, val) {
    state.threeShow = val
  },
  // glNew页面显隐
  setGlNewShow(state, val) {
    state.glNewShow = val
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