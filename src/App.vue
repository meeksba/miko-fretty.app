<template>
  <section class="section">
    <div class="has-text-centered">
      <router-link to="/FretboardGame">
        <b-button @click="showGame = !showGame">Identify</b-button>
      </router-link>
      <router-link to="/BuildGame">
        <b-button @click="showBuild = !showBuild">Build</b-button>
      </router-link>
    </div>
    <b-button class="is-pulled-right" icon-left="user"> Profile </b-button>
    <div v-if="!showGame && !showBuild">
      <div class="container" v-for="editor in editors" v-bind:key="editor">
        <!--<note-select />-->
        <Editor v-on:remove-fretboard="remove(editor)" />
      </div>
    </div>
    <div class="has-text-centered" v-if="!showGame">
      <a @click="add">+ Add Fretboard</a>
    </div>
    <FretboardGame v-if="showGame" />
    <BuildGame v-if="showBuild" />
  </section>
</template>

<script>
import Editor from "./components/Editor.vue";
import FretboardGame from "./Views/FretboardGame.vue";
import BuildGame from "./Views/BuildGame.vue";
// import NoteSelect from "./components/NoteSelect.vue";

export default {
  name: "App",
  components: {
    Editor,
    FretboardGame,
    BuildGame,
    // NoteSelect
  },
  data() {
    return {
      editors: [1],
      showGame: false,
      showBuild: false,
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
