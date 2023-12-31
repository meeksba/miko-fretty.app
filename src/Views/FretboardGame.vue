<template>
  <div>
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
    scale_search: function () {
      return ALL_SCALES.filter((option) => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.scale.type.toLowerCase()) >= 0
        );
      });
    },
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
