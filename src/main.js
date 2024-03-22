import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import IdentifyGame from "./Views/IdentifyGame.vue";
import BuildGame from "./Views/BuildGame.vue";
import EarTraining from "./Views/EarTraining.vue";
import ExploreSpace from "./Views/ExploreSpace.vue";
import AccountPage from "./Views/AccountPage.vue";
import store from "./store.js";
import { ToastProgrammatic as ToastNotif } from "buefy/src";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
// import 'firebase/compat/auth'
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
  Tooltip,
  Modal,
  Tag,
  Carousel,
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
  faSearch,
  faHammer,
  faHeadphones,
  faBookOpen,
  faEye,
  faEyeSlash,
  faArrowUp,
  faArrowDown,
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
  faGamepad,
  faSearch,
  faHammer,
  faHeadphones,
  faBookOpen,
  faEye,
  faEyeSlash,
  faArrowUp,
  faArrowDown
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
Vue.use(Tooltip);
Vue.use(Modal);
Vue.use(Tag);
Vue.use(Carousel);

// https://buefy.org/documentation/constructor-options
ConfigProgrammatic.setOptions({
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
  defaultContainerElement: "#content",
});

const firebaseConfig = {
  apiKey: "AIzaSyBKuHk6tBymAhCAm5ocSoRCOpcFYxhkoVM",
  authDomain: "mikofretty.firebaseapp.com",
  projectId: "mikofretty",
  storageBucket: "mikofretty.appspot.com",
  messagingSenderId: "857699131525",
  appId: "1:857699131525:web:da64b1713687c8fd2789ec",
};

firebase.initializeApp(firebaseConfig);
Vue.config.productionTip = false;

export const db = firebase.firestore();

Vue.use(VueRouter);
// Vue.use(VueFire);

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
  {
    path: "/AccountPage",
    name: "AccountPage",
    component: AccountPage,
    meta: { authRequired: true },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.authRequired)) {
    if (firebase.auth().currentUser) {
      next();
    } else {
      ToastNotif.open({
        duration: 3000,
        message: "You Must Be Logged On to Access This",
        position: "is-top",
        type: "is-danger",
      });
      return;
    }
  } else {
    next();
  }
});

window.onload = function () {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
};
