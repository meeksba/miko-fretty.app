import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    showEditor: true, //do NOT render if false, else render, ensures initial render
  },
  mutations: {
    setShowEditor(state, val) {
      state.showEditor = val;
      localStorage.setItem("showEditor", val);
    },
  },
  actions: {
    toggleEditor({ commit }) {
      let temp = !this.state.showEditor;
      commit("setShowEditor", temp);
    },
  },
  getters: {
    getShowEditor(state) {
      return state.showEditor;
    },
  },
});
