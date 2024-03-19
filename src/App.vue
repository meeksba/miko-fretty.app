<template>
  <div>
    <section>
      <b-sidebar
        type="is-light"
        :fullheight="true"
        :fullwidth="false"
        :overlay="false"
        :right="false"
        v-model="open"
      >
        <div class="p-1">
          <b-menu>
            <b-menu-list label="Games">
              <b-menu-item
                icon="gamepad"
                label="Scale Identification Game"
              ></b-menu-item>
              <b-menu-item
                icon="gamepad"
                label="Scale Building Game"
              ></b-menu-item>
              <b-menu-item icon="gamepad" label="Ear Training Games">
              </b-menu-item>
            </b-menu-list>
            <b-menu-list label="Account">
              <b-menu-item icon="user" label="My Account">
                <b-menu-item label="Account data"></b-menu-item>
                <b-menu-item label="Addresses"></b-menu-item>
                <b-menu-item label="Logout"></b-menu-item>
              </b-menu-item>
            </b-menu-list>
            <b-menu-list label="App Settings">
              <b-switch
                @input="changeBackground()"
                v-model="lightMode"
                passive-type="is-dark"
                type="is-warning"
              >
                {{ lightMode ? "Light Mode" : "Dark Mode" }}
              </b-switch>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>
      <!-- Sidebar Button -->
      <b-button
        @click="open = true"
        size="is-medium"
        icon-right="bars"
        type="is-ghost is-rounded"
      ></b-button>
      <!-- Home Page Button -->
      <router-link to="/">
        <b-button
          @click="homePage()"
          size="is-medium"
          icon-right="home"
          type="is-ghost is-rounded"
        ></b-button>
      </router-link>
    </section>

    <section class="section">
      <div class="has-text-centered" style="margin-bottom: 20px">
        <!-- Scale Identification Button -->
        <router-link to="/IdentifyGame">
          <b-button
            @click="
              showGame = !showGame;
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
      <!-- <b-button class="is-pulled-right" icon-left="user"> Profile </b-button> -->
      <div v-if="showHome">
        <div class="container" v-for="editor in editors" v-bind:key="editor">
          <!--<note-select />-->
          <Editor v-on:remove-fretboard="remove(editor)" />
          <div class="has-text-centered">
            <a @click="add">+ Add Fretboard</a>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import Editor from "./components/Editor.vue";
// import IdentifyGame from "./Views/IdentifyGame.vue";
// import BuildGame from "./Views/BuildGame.vue";
// import EarTraining from "./Views/EarTraining.vue";
// import NoteSelect from "./components/NoteSelect.vue";

export default {
  name: "App",
  components: {
    Editor,
    // IdentifyGame,
    // BuildGame,
    // EarTraining,
    // NoteSelect
  },
  data() {
    return {
      editors: [1],
      showHome: true,
      showGame: false,
      showBuild: false,
      showInterval: false,
      open: false,
      lightMode: true,
    };
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
    },
    homePage() {
      this.showHome = true;
      this.showBuild = false;
      this.showGame = false;
      this.showInterval = false;
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
