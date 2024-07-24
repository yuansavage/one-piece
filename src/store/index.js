import { createStore } from "vuex";

export default createStore({
  state: { longitude: 0, latitude: 0, modelFile: null, modelName: "" },
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
    setModelName(state, playload) {
      console.log(playload);
      state.modelName = playload;
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
    fetchModelName({ commit }, playload) {
      commit("setModelName", playload);
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
    placedModelName(state) {
      return state.modelName;
    },
  },
  modules: {},
});
