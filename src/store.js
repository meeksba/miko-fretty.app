import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    showEditor: true, //not sure 
  },
  mutations: {
    setShowEditor(state, val) {
      state.showEditor = val;
      localStorage.setItem("showEditor", val);
    },
  },
  actions: {
    toggleEditor({ commit }) {
      let temp = !this.state.showEditor; //sets showEditor to the its opposite value
      console.log("herehere");
      commit("setShowEditor", temp);
    },
  },
  getters: {
    getShowEditor(state) {
      return state.showEditor;
    },
  },
});
