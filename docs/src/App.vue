<template>
  <div>
    <section>
      <!-- <b-button @click="testMethod()"> LoggedIn? </b-button> -->

      <!-- Home Page Button -->
      <b-field>
        <router-link to="/">
          <b-tooltip label="Home Page" position="is-right">
            <b-button
              @click="homePage()"
              size="is-medium"
              icon-right="home"
              type="is-ghost is-rounded"
              outlined
            ></b-button>
          </b-tooltip>
        </router-link>
        <!-- Account Button (Dropdown) -->
        <b-dropdown aria-role="list">
          <template #trigger="{}">
            <b-button
              :label="userLoggedIn ? 'Signed In' : ''"
              icon-left="user"
              type="is-ghost is-rounded"
              style="margin-top: 5px"
              outlined
            />
          </template>
          <!-- Login -->
          <b-dropdown-item v-if="!userLoggedIn" @click="showLogin = true">
            Login
          </b-dropdown-item>
          <!-- Register -->
          <b-dropdown-item v-if="!userLoggedIn" @click="showRegister = true">
            Register
          </b-dropdown-item>
          <!-- Account Info -->
          <router-link to="/AccountPage">
            <b-dropdown-item
              v-if="userLoggedIn"
              @click="
                showHome = false;
                showAccountInfo = true;
              "
            >
              Account Info
            </b-dropdown-item>
          </router-link>
          <!-- Logout -->
          <b-dropdown-item v-if="userLoggedIn" @click="logOut()">
            Logout
          </b-dropdown-item>
        </b-dropdown>
        <!-- Dark Mode Switch -->
        <b-switch
          @input="changeBackground()"
          v-model="lightMode"
          passive-type="is-dark"
          type="is-warning"
        >
          {{ lightMode ? "Light Mode" : "Dark Mode" }}
        </b-switch>
      </b-field>
    </section>

    <section class="section">
      <div
        v-if="!showAccountInfo"
        class="has-text-centered"
        style="margin-top: -20px"
      >
        <!-- Scale Identification Button -->
        <router-link to="/IdentifyGame">
          <b-button
            @click="
              showIdentify = !showIdentify;
              showHome = false;
            "
            type="is-rounded is-info is-light"
            outlined
            >Scale Identification</b-button
          >
        </router-link>
        <!-- Scale Building Button -->
        <router-link to="/BuildGame">
          <b-button
            @click="
              showBuild = !showBuild;
              showHome = false;
            "
            type="is-rounded is-info is-light"
            outlined
            >Scale Building</b-button
          >
        </router-link>
        <!-- Ear Training Button -->
        <router-link to="/EarTraining">
          <b-button
            @click="
              showInterval = !showInterval;
              showHome = false;
            "
            type="is-rounded is-info is-light"
            outlined
            >Ear Training</b-button
          >
        </router-link>
        <!-- Explore Space Button -->
        <router-link to="/ExploreSpace">
          <b-button
            @click="
              showInterval = !showInterval;
              showHome = false;
            "
            type="is-rounded is-info is-light"
            outlined
            >Explore Space</b-button
          >
        </router-link>
      </div>
      <!-- <b-button @click="loginStatus()">TEST</b-button> -->
      <div v-if="showHome">
        <div
          class="container"
          v-for="editor in editors"
          v-bind:key="editor"
          style="margin-top: 30px"
        >
          <!--<note-select />-->
          <Editor v-on:remove-fretboard="remove(editor)" />
        </div>
        <div class="has-text-centered">
          <a @click="add">+ Add Fretboard</a>
        </div>
      </div>
    </section>
    <router-view></router-view>
    <!-- Login Form -->
    <b-modal
      v-model="showLogin"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Login Form"
      close-button-aria-label="Close"
      aria-modal
    >
      <template #default="props">
        <LoginForm @close="props.close"></LoginForm>
      </template>
    </b-modal>
    <!-- Register Form -->
    <b-modal
      v-model="showRegister"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Register Form"
      close-button-aria-label="Close"
      aria-modal
    >
      <template #default="props">
        <RegisterForm @close="props.close"></RegisterForm>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Editor from "./components/Editor.vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "firebase/compat/auth";
// import IdentifyGame from "./Views/IdentifyGame.vue";
// import BuildGame from "./Views/BuildGame.vue";
// import EarTraining from "./Views/EarTraining.vue";
// import NoteSelect from "./components/NoteSelect.vue";

export default {
  name: "App",
  components: {
    Editor,
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      editors: [1],
      showHome: true,
      showAccountInfo: false,
      showIdentify: false,
      showBuild: false,
      showInterval: false,
      userLoggedIn: false,
      open: false,
      lightMode: true,
      showLogin: false,
      showRegister: false,
    };
  },
  mounted() {
    this.loginStatus();
  },
  methods: {
    add: function () {
      this.editors.push(Math.max(...this.editors) + 1);
    },
    remove: function (editor) {
      const index = this.editors.indexOf(editor);
      if (index > -1) {
        this.editors.splice(index, 1);
      }
    },
    changeBackground() {
      document.body.style.backgroundColor = this.lightMode
        ? "white"
        : "dimgrey";
      document.getElementById("foot").style.backgroundColor = this.lightMode
        ? "white"
        : "dimgrey";
    },
    homePage() {
      this.showHome = true;
      this.showAccountInfo = false;
      this.showBuild = false;
      this.showIdentify = false;
      this.showInterval = false;
    },
    logOut() {
      if (!this.userLoggedIn) {
        this.$buefy.dialog.alert({
          title: "Error",
          message: "No User Currently Logged In",
          type: "is-danger",
          confirmText: "Ok",
        });
        return;
      }
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("logged out");
          this.$buefy.dialog.alert({
            title: "Success",
            message: "You Have Successfully Logged Out",
            type: "is-success",
            confirmText: "Ok",
          });
        })
        .catch((error) => {
          console.log("log out error");
          this.$buefy.dialog.alert({
            title: "Error",
            message: error.message,
            type: "is-danger",
            confirmText: "Ok",
          });
        });
    },
    loginStatus() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("logged in");
          this.userLoggedIn = true;
          return;
        } else {
          console.log("not logged in");
          this.userLoggedIn = false;
        }
      });
    },
    testMethod() {
      this.loginStatus();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
