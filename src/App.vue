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
            <!-- <b-menu-list label="Games">
              <b-menu-item icon="gamepad" label="Identify"></b-menu-item>
              <b-menu-item icon="gamepad" label="Build"></b-menu-item>
              <b-menu-item icon="gamepad" label="Hear"> </b-menu-item>
            </b-menu-list> -->
            <!-- <b-button @click="changeBackground()" style="background-color: #ff6347; color: #fff;">Dark Mode</b-button> -->
            <b-menu-list label="Account">
              <b-menu-item icon="user" label="My Account">
                <b-menu-item label="Account data"></b-menu-item>
                <b-menu-item label="Addresses"></b-menu-item>
              </b-menu-item>
              <b-menu-item label="Logout"></b-menu-item>
            </b-menu-list>
            <b-switch
              @input="changeBackground()"
              v-model="lightMode"
              passive-type="is-dark"
              type="is-warning"
            >
              {{ lightMode ? "Light Mode" : "Dark Mode" }}
            </b-switch>
          </b-menu>
        </div>
      </b-sidebar>
      <b-button
        @click="open = true"
        icon-right="bars"
        type="is-ghost is-rounded"
      ></b-button>
    </section>

    <section class="section">
      <div class="has-text-centered" style="margin-bottom: 20px">
        <router-link to="/IdentifyGame">
          <b-button @click="showGame = !showGame" type="is-rounded"
            >Scale Identification</b-button
          >
        </router-link>
        <router-link to="/BuildGame">
          <b-button @click="showBuild = !showBuild" type="is-rounded"
            >Scale Building</b-button
          >
        </router-link>
        <router-link to="/ListeningGame">
          <b-button @click="showInterval = !showInterval" type="is-rounded"
            >Ear Training</b-button
          >
        </router-link>
      </div>
      <!-- <b-button class="is-pulled-right" icon-left="user"> Profile </b-button> -->
      <div v-if="!showGame && !showBuild && !showInterval">
        <div class="container" v-for="editor in editors" v-bind:key="editor">
          <!--<note-select />-->
          <Editor v-on:remove-fretboard="remove(editor)" />
        </div>
      </div>
      <div
        class="has-text-centered"
        v-if="!showGame && !showBuild && !showInterval"
      >
        <a @click="add">+ Add Fretboard</a>
      </div>
      <IdentifyGame v-if="showGame" />
      <BuildGame v-if="showBuild" />
      <ListeningGame v-if="showInterval" />
    </section>
  </div>
</template>

<script>
import Editor from "./components/Editor.vue";
import IdentifyGame from "./Views/IdentifyGame.vue";
import BuildGame from "./Views/BuildGame.vue";
import ListeningGame from "./Views/ListeningGame.vue";
// import NoteSelect from "./components/NoteSelect.vue";

export default {
  name: "App",
  components: {
    Editor,
    IdentifyGame,
    BuildGame,
    ListeningGame,
    // NoteSelect
  },
  data() {
    return {
      editors: [1],
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
