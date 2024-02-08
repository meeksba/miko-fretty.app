import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import FretboardGame from "./Views/FretboardGame.vue";
import BuildGame from "./Views/BuildGame.vue";
import store from "./store.js";

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
  Select,
  Progress,
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
);
Vue.component("vue-fontawesome", FontAwesomeIcon);

import "./assets/scss/app.scss";

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
Vue.use(Select);
Vue.use(Progress);

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
    path: "/FretboardGame",
    name: "FretboardGame",
    component: FretboardGame,
  },
  {
    path: "/BuildGame",
    name: "BuildGame",
    component: BuildGame,
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
