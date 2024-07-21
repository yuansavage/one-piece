import { createStore } from "vuex";

export default createStore({
  state: { longitude: 0, latitude: 0, modelFile: null },
  mutations: {
    setLongitude(state, playload) {
      state.longitude = playload;
    },
    setLatitude(state, playload) {
      state.latitude = playload;
    },
    setModelFile(state, playload) {
      state.modelFile = playload;
    },
  },
  actions: {
    fetchLongitude({ commit }, playload) {
      commit("setLongitude", playload);
    },
    fetchLatitude({ commit }, playload) {
      commit("setLatitude", playload);
    },
    fetchModelFile({ commit }, playload) {
      commit("setModelFile", playload);
    },
  },
  getters: {
    mapLongitude(state) {
      return state.longitude;
    },
    mapLatitude(state) {
      return state.latitude;
    },
    placedModelFile(state) {
      return state.modelFile;
    },
  },
  modules: {},
});
