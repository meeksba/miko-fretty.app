import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import IdentifyGame from "./Views/IdentifyGame.vue";
import BuildGame from "./Views/BuildGame.vue";
import EarTraining from "./Views/EarTraining.vue";
import ExploreSpace from "./Views/ExploreSpace.vue";
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
  Menu,
  Sidebar,
  Select,
  Toast,
  Dialog,
  Progress,
  Switch,
  Notification,
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
  faBars,
  faLink,
  faInfo,
  faHome,
  faGamepad,
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
  faUser,
  faBars,
  faLink,
  faInfo,
  faHome,
  faGamepad
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
Vue.use(Menu);
Vue.use(Sidebar);
Vue.use(Select);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Progress);
Vue.use(Switch);
Vue.use(Notification);

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
    path: "/EarTraining",
    name: "EarTraining",
    component: EarTraining,
  },
  {
    path: "/ExploreSpace",
    name: "ExploreSpace",
    component: ExploreSpace,
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
