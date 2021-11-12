const state = {
  glShow: false,
  threeShow: false,
  glNewShow: false,
  glTexShow: false,
}

const mutations = {
  setAllFalse(state) {
    state.glShow = false
    state.threeShow = false
    state.glNewShow = false
    state.glTexShow = false
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
  // glTex页面显隐
  setGlTexShow(state, val) {
    state.glTexShow = val
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