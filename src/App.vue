<template>
  <section class="section">
    <div>
      <router-link to="/FretboardGame">
        <b-button @click="showGame = !showGame">Game</b-button>
      </router-link>
    </div>
    <div v-if="!showGame">
      <div class="container" v-for="editor in editors" v-bind:key="editor">
        <!--<note-select />-->
        <Editor v-on:remove-fretboard="remove(editor)" />
      </div>
      <div class="container has-text-centered">
        <a @click="add">+ Add Fretboard</a>
      </div>
    </div>
    <FretboardGame v-if="showGame" />
  </section>
</template>

<script>
import Editor from "./components/Editor.vue";
import FretboardGame from "./Views/FretboardGame.vue";
// import NoteSelect from "./components/NoteSelect.vue";

export default {
  name: "App",
  components: {
    Editor,
    FretboardGame,
    // NoteSelect
  },
  data() {
    return {
      editors: [1],
      showGame: false,
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
