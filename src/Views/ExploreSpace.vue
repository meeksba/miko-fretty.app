<template>
  <div>
    <h1 class="has-text-centered" style="margin-top: 50px; margin-bottom: 10px">
      Explore Space
    </h1>
    <div class="editor">
      <div class="columns is-multiline is-centered">
        <div class="column">
          <!-- <b-button @click="testMethod">Explore test</b-button> -->
          <b-field grouped group-multiline position="is-centered">
            <!-- Tuning -->
            <b-field label="Tuning">
              <b-autocomplete
                v-model="usr_tuning"
                :data="tuning_search"
                @select="(option) => (selected = option.name)"
                group-field="instrument"
                group-options="tunings"
                open-on-focus
                clearable
                field="tuning"
                icon="guitar"
                style="min-width: 350px"
                @input="saveSettings"
              >
                <template slot-scope="props">
                  <div style="display: flex">
                    <div style="flex: 1 1 0px">{{ props.option.name }}</div>
                    <div style="flex: 1 1 0px">{{ props.option.tuning }}</div>
                  </div>
                </template>
              </b-autocomplete>
            </b-field>

            <!-- Tonic + Scale -->
            <!-- <b-field label="Tonic:">
              <b-input
                v-model="scale.tonic"
                icon="music"
                style="max-width: 100px"
              ></b-input>
            </b-field>
            <b-field label="Scale:">
              <b-autocomplete
                v-model="scale.type"
                :data="scale_search"
                open-on-focus
                clearable
                append-to-body
                @select="(option) => (selected = option)"
              ></b-autocomplete>
            </b-field> -->

            <b-field>
              <!-- Clear Button and Check Chord Button -->
              <b-button @click="clearFretboard()" style="margin-right: 10px"
                >Clear Fretboard</b-button
              >
              <b-button @click="checkChord()" style="margin-right: 10px"
                >Chord Check</b-button
              >
              <!-- Settings -->
              <template slot="label">
                <span style="color: transparent; user-select: none">More</span>
              </template>

              <b-dropdown append-to-body aria-role="menu" trap-focus>
                <b-button class="button" slot="trigger" icon-left="cog"
                  >Settings</b-button
                >

                <b-dropdown-item
                  aria-role="menu-item"
                  :focusable="false"
                  custom
                  paddingless
                >
                  <form action>
                    <div class="modal-card" style="width: 300px">
                      <section class="modal-card-body">
                        <b-field label="Frets">
                          <b-numberinput
                            controls-position="compact"
                            v-model.number="frets"
                            min="1"
                            max="200"
                          ></b-numberinput>
                        </b-field>
                        <b-field label="Notation">
                          <b-radio-button
                            v-model="notation"
                            native-value="sharp"
                          >
                            <span>Notes</span>
                          </b-radio-button>
                          <b-radio-button
                            v-model="notation"
                            native-value="Intervals"
                          >
                            <span>Intervals</span>
                          </b-radio-button>
                        </b-field>
                        <!-- <b-field label="Show Chords">
                          <b-field>
                            <b-radio-button
                              v-model="ShowChords"
                              native-value="true"
                            >
                              <span>True</span>
                            </b-radio-button>

                            <b-radio-button
                              v-model="ShowChords"
                              native-value="false"
                            >
                              <span>False</span>
                            </b-radio-button>
                          </b-field>
                        </b-field> -->
                        <b-field label="Music Sheet">
                          <b-field>
                            <b-radio-button
                              v-model="ShowMusicSheet"
                              native-value="true"
                            >
                              <span>True</span>
                            </b-radio-button>

                            <b-radio-button
                              v-model="ShowMusicSheet"
                              native-value="false"
                            >
                              <span>False</span>
                            </b-radio-button>
                          </b-field>
                        </b-field>
                      </section>
                    </div>
                  </form>
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
          </b-field>
        </div>
      </div>

      <div class="card-image" style="text-align: center; overflow-x: auto">
        <ExploreFretboard
          :tuning="tuning"
          :notes="notes"
          :notation="fretboardNotation"
          :frets="frets"
          :root="root"
          :scale="scale_info"
          :clickedKeys="clickedKeys"
          @clickNote="clickHandle"
        />
        <h2 v-if="displayNotes">Notes Pressed: {{ this.clickedNotes }}</h2>
        <h2 v-if="displayChords" style="margin-top: 5px">
          Chord(s) Detected: {{ this.chordsFound }}
        </h2>
      </div>
      <!-- <Chords
        v-if="this.ShowChords == 'true'"
        :chords="scaleChords"
        style="margin-bottom: 50px"
      /> -->
      <Notation
        v-if="this.ShowMusicSheet == 'true'"
        :notes="this.clickedNotes"
      />
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import ExploreFretboard from "../components/ExploreFretboard.vue";
import Notation from "../components/Notation.vue";
import { Note, Scale, Midi, ScaleType, Mode, Chord } from "tonal";
import { Tunings } from "../tunings.js";
import { playNote } from "../guitarsounds";

var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

export default {
  name: "Editor",

  components: {
    ExploreFretboard,
    Notation,
  },

  data: function () {
    return {
      usr_tuning: localStorage.getItem("tuning") || "E A D G B E",
      sharps: "sharps",
      frets: 18,
      scale: { tonic: "E", type: "" },
      ShowMusicSheet: "true",
      ShowChords: "true",
      notation: "sharp",
      displayChords: false,
      displayNotes: false,
      clickedKeys: [],
      clickedNotes: [],
      chordsFound: "",
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
    toName(x) {
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
    clickHandle(note) {
      playNote(note.key);
      let name = note.name;
      this.clickedNotes.push(name);
      this.clickedKeys.push(note.key);
      this.displayNotes = true;
    },
    clearFretboard() {
      this.clickedNotes = [];
      this.clickedKeys = [];
      this.chordsFound = "";
      this.displayChords = false;
      this.displayNotes = false;
    },
    checkChord() {
      this.chordsFound = "";
      console.log("clickedNotes: ", this.clickedNotes);
      // let found = Chord.detect(this.clickedNotes);

      let temp = Chord.detect(this.clickedNotes);
      for (let i = 0; i < temp.length; i++) {
        this.chordsFound += temp[i] + "  |  ";
      }
      if (this.chordsFound.length > 0) {
        this.displayChords = true;
      }
      // console.log("chordsFound", found )
      // console.log("detectedChord: ", chord);
    },
    testMethod() {
      console.log("Scale Notes: " + this.scale_info.notes);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
h2 {
  font-size: 18px;
  font-weight: bold;
  margin-top: -35px;
}
</style>
