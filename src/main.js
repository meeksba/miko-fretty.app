import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import IdentifyGame from "./Views/IdentifyGame.vue";
import BuildGame from "./Views/BuildGame.vue";
import ListeningGame from "./Views/ListeningGame.vue";
import store from "./store.js";
// import Buefy from "buefy/src";
import {
  ConfigProgrammatic,
  Autocomplete,
  Input,
  Field,
  Button,
  Dropdown,
  Numberinput,
  Radio,
  Table,
  Icon,
  Checkbox,
} from "buefy/src";

import { library } from "@fortawesome/fontawesome-svg-core";
// internal icons
import {
  faPlus,
  faMinus,
  faTimesCircle,
  faAngleDown,
  faCog,
  faCaretUp,
  faCaretDown,
  faTrash,
  faMusic,
  faGuitar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faPlus,
  faMinus,
  faTimesCircle,
  faAngleDown,
  faCog,
  faCaretUp,
  faCaretDown,
  faTrash,
  faMusic,
  faGuitar,
  faUser
);
Vue.component("vue-fontawesome", FontAwesomeIcon);

import "./assets/scss/app.scss";

Vue.use(ConfigProgrammatic);
Vue.use(Autocomplete);
Vue.use(Input);
Vue.use(Field);
Vue.use(Button);
Vue.use(Dropdown);
Vue.use(Numberinput);
Vue.use(Radio);
Vue.use(Table);
Vue.use(Icon);
Vue.use(Checkbox);

// https://buefy.org/documentation/constructor-options
ConfigProgrammatic.setOptions({
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
  defaultContainerElement: "#content",
});

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path: "/IdentifyGame",
    name: "IdentifyGame",
    component: IdentifyGame,
  },
  {
    path: "/BuildGame",
    name: "BuildGame",
    component: BuildGame,
  },
  {
    path: "/ListeningGame",
    name: "ListeningGame",
    component: ListeningGame,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

window.onload = function () {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
};
