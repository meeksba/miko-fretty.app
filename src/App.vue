<template>
  <section class="section">
    <div class="has-text-centered" style="margin-bottom: 20px">
      <router-link to="/IdentifyGame">
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
    <div class="has-text-centered" v-if="!showGame && !showBuild">
      <a @click="add">+ Add Fretboard</a>
    </div>
    <IdentifyGame v-if="showGame" />
    <BuildGame v-if="showBuild" />
    <b-button class="is-pulled-right" icon-left="user" @click="playSound()"> SOUND </b-button>
  </section>
</template>

<script>
import Editor from "./components/Editor.vue";
import IdentifyGame from "./Views/IdentifyGame.vue";
import BuildGame from "./Views/BuildGame.vue";
// import guitarSounds from "./guitarsounds";
import * as Tone from 'tone';
// import NoteSelect from "./components/NoteSelect.vue";

const guitarSounds = new Tone.Sampler({
	urls: {
        'G4': 'G4.[mp3|ogg]',
	},
	baseUrl: "/samples/guitar-acoustic/",
}).toDestination();

export default {
  name: "App",
  components: {
    Editor,
    IdentifyGame,
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
    playSound() {
        // Ensure that Tone library is started
        Tone.start().then(() => {
            console.log("sound ");
            guitarSounds.triggerAttackRelease(["G4"], 0.5);
        }).catch((error) => {
            console.error("Error starting Tone:", error);
        });
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
