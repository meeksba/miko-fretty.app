<template>
  <div>
    <section>
      <b-sidebar
        type="is-light"
        :fullheight="fullheight"
        :fullwidth="fullwidth"
        :overlay="overlay"
        :right="right"
        v-model="open"
      >
        <div class="p-1">
          <b-menu>
            <b-menu-list label="Games">
              <b-menu-item icon="gamepad" label="Identify"></b-menu-item>
              <b-menu-item icon="gamepad" label="Build"></b-menu-item>
              <b-menu-item icon="gamepad" label="Hear"> </b-menu-item>
              <b-menu-item icon="user" label="My Account">
                <b-menu-item label="Account data"></b-menu-item>
                <b-menu-item label="Addresses"></b-menu-item>
              </b-menu-item>
            </b-menu-list>
            <b-menu-list>
              <b-menu-item
                label="Expo"
                tag="router-link"
                target="_blank"
                to="/expo"
              ></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
              <b-menu-item label="Logout"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>
      <!-- <div class="block">
      <b-field grouped group-multiline>
        <div class="control">
          <b-switch v-model="overlay">Overlay</b-switch>
        </div>
        <div class="control">
          <b-switch v-model="fullheight">Fullheight</b-switch>
        </div>
        <div class="control">
          <b-switch v-model="fullwidth">Fullwidth</b-switch>
        </div>
        <div class="control">
          <b-switch v-model="right">Right</b-switch>
        </div>
      </b-field>
    </div> -->
      <b-button @click="open = true" icon-right="bars"></b-button>
    </section>

    <section class="section">
      <div class="has-text-centered" style="margin-bottom: 20px">
        <router-link to="/IdentifyGame">
          <b-button @click="showGame = !showGame">Identify</b-button>
        </router-link>
        <router-link to="/BuildGame">
          <b-button @click="showBuild = !showBuild">Build</b-button>
        </router-link>
        <router-link to="/ListeningGame">
          <b-button @click="showInterval = !showInterval"
            >Ear Training</b-button
          >
        </router-link>
        <b-button @click="changeBackground()">Color</b-button>
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
      overlay: false,
      fullheight: true,
      fullwidth: false,
      right: false,
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
      document.body.style.backgroundColor = "lightgrey";
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
