<template>
  <div>
    <b-dropdown append-to-body aria-role="menu" trap-focus>
      <b-button class="button" slot="trigger" icon-left="cog"
        >Settings</b-button
      >

      <b-dropdown-item aria-role="menu-item" :focusable="false" paddingless>
        <form action>
          <div class="modal-card" style="width: 300px">
            <section class="modal-card-body">
              <b-field label="Difficulty">
                <b-radio-button
                  v-model="radioButton"
                  native-value="Easy"
                  type="is-primary is-light is-outlined"
                >
                  Easy
                </b-radio-button>
                <b-radio-button
                  v-model="radioButton"
                  native-value="Medium"
                  type="is-primary is-light is-outlined"
                >
                  Medium
                </b-radio-button>
                <b-radio-button
                  v-model="radioButton"
                  native-value="Hard"
                  type="is-primary is-light is-outlined"
                >
                  Hard
                </b-radio-button>
              </b-field>
              <b-field label="Test">
                <b-radio-button native-value="true">
                  <span>True</span>
                </b-radio-button>
              </b-field>
            </section>
          </div>
        </form>
      </b-dropdown-item>
    </b-dropdown>
    <div class="card-image" style="text-align: center; overflow-x: auto">
      <Fretboard
        :tuning="tuning"
        :notes="notes"
        :notation="notation"
        :frets="frets"
        :root="root"
        :scale="scale_info"
      />
    </div>
    <h1 class="has-text-centered">Guess the Scale!</h1>

    <section
      class="has-text-centered"
      style="display: flex; justify-content: space-between"
    >
      <b-dropdown aria-role="list">
        <template #trigger="{ active }">
          <b-button
            label="Answers"
            :icon-right="active ? 'caret-up' : 'caret-down'"
          />
        </template>

        <b-dropdown-item aria-role="listitem">Action</b-dropdown-item>
        <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
        <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
      </b-dropdown>
      <b-button @click="test_method()" label="Begin" />
    </section>
    <!-- <Chords
        v-if="this.ShowChords == 'true'"
        :chords="scaleChords"
        style="margin-bottom: 50px"
      /> -->
    <!-- <Notation
        v-if="this.ShowMusicSheet == 'true'"
        :scale="scale_info"
        :scale-name="scale_info.name"
      /> -->
  </div>
</template>

<script>
import Fretboard from "../components/Fretboard.vue";
// import Chords from "../components/Chords.vue";
// import Notation from "../components/Notation.vue";
// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, Midi, ScaleType, Mode } from "@tonaljs/tonal";
import { Tunings } from "../tunings.js";

var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

export default {
  name: "FretboardGame",

  components: {
    Fretboard,
    // Chords,
    // Notation,
    // NoteSelect,
  },

  data: function () {
    return {
      usr_tuning: localStorage.getItem("tuning") || "E A D G",
      sharps: "sharps",
      frets: 18,
      scale: { tonic: "A", type: "minor" },
      ShowMusicSheet: "true",
      ShowChords: "true",
    };
  },

  computed: {
    tuning: function () {
      if (!this.usr_tuning) return [];
      return this.usr_tuning.trim().split(" ").map(Note.chroma).reverse();
    },
    root: function () {
      return Note.chroma(this.scale.tonic);
    },
    notes: function () {
      return this.scale_info.notes.map(Note.chroma);
    },
    scale_info: function () {
      let name = this.scale.tonic + " " + this.scale.type;
      return Scale.get(name);
    },
    scaleChords: function () {
      return Mode.triads(this.scale_info.type, this.scale_info.tonic);
    },
    // scale_search: function () {
    //   return ALL_SCALES.filter((option) => {
    //     return (
    //       option
    //         .toString()
    //         .toLowerCase()
    //         .indexOf(this.scale.type.toLowerCase()) >= 0
    //     );
    //   });
    // },
    tuning_search() {
      const newData = [];
      Tunings.forEach((element) => {
        const items = element.tunings.filter(
          (item) =>
            item.tuning.toLowerCase().indexOf(this.usr_tuning.toLowerCase()) >=
            0
        );
        if (items.length) {
          newData.push({ instrument: element.instrument, tunings: items });
        }
      });
      return newData;
    },
  },

  methods: {
    saveSettings() {
      localStorage.setItem("tuning", this.usr_tuning);
    },
    normalize(notes) {
      return notes.map((x) => x % 12);
    },
    toname(x) {
      return Midi.midiToNoteName(x, {
        sharps: this.notation != "flat",
        pitchClass: true,
      });
    },
    scale_input(x) {
      if (x == "") {
        return;
      }
    },
    test_method() {
      console.log("printing from begin");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
