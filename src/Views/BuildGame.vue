<template>
  <div>
    <b-dropdown append-to-body aria-role="menu" trap-focus>
      <b-button class="button" slot="trigger" icon-left="cog"
        >Build Settings</b-button
      >
      <b-dropdown-item aria-role="menu-item" :focusable="false" paddingless>
        <form action>
          <div class="modal-card" style="width: 300px">
            <section class="modal-card-body">
              <b-field label="Music Sheet">
                <b-field>
                  <b-radio-button v-model="ShowMusicSheet" native-value="true">
                    <span>True</span>
                  </b-radio-button>
                  <b-radio-button v-model="ShowMusicSheet" native-value="false">
                    <span>False</span>
                  </b-radio-button>
                </b-field>
              </b-field>
              <b-field label="Show Chords">
                <b-field>
                  <b-radio-button v-model="ShowChords" native-value="true">
                    <span>True</span>
                  </b-radio-button>
                  <b-radio-button v-model="ShowChords" native-value="false">
                    <span>False</span>
                  </b-radio-button>
                </b-field>
              </b-field>
            </section>
          </div>
        </form>
      </b-dropdown-item>
    </b-dropdown>
    <div class="card-image" style="text-align: center; overflow-x: auto">
      <BuildFretboard
        :tuning="tuning"
        :notes="notes"
        :notation="notation"
        :frets="frets"
        :root="root"
        :scale="[]"
        :clickedKeys="clickedKeys"
        @clickNote="clickHandle"
      />
    </div>

    <h1 v-if="ShowBegin" class="has-text-centered" style="margin-bottom: 30px">
      Build the Scale Given!
    </h1>
    <section
      class="has-text-centered"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1rem;
      "
    >
      <b-button v-if="ShowBegin" @click="show_settings()" label="Begin" />

      <div v-if="ShowSettings">
        <h2>Choose Your Settings</h2>
        <b-field>
          <b-field label="Difficulty">
            <b-radio-button v-model="gameDifficulty" native-value="Easy">
              <span>Easy</span>
            </b-radio-button>
            <b-radio-button v-model="gameDifficulty" native-value="Medium">
              <span>Medium</span>
            </b-radio-button>
            <b-radio-button v-model="gameDifficulty" native-value="Hard">
              <span>Hard</span>
            </b-radio-button>
          </b-field>
          <b-field label="Notation" style="margin-left: 20px">
            <b-radio-button v-model="gameMode" native-value="Note">
              <span>Note</span>
            </b-radio-button>
            <b-radio-button v-model="gameMode" native-value="Interval">
              <span>Interval</span>
            </b-radio-button>
          </b-field>
        </b-field>
        <b-field>
          <TuningSelection @tuningChange="handleTuning" />
        </b-field>
        <b-button @click="submit_settings()" label="Begin Game" />
      </div>

      <h1 v-if="StartGame" class="has-text-centered">
        Build <b>{{ scale.tonic }} {{ scale.type }} </b> on the Fretboard Above
      </h1>
      <b-button
        @click="test_method"
        label="TESTBUTTON"
        style="margin-top: 20px"
      />
    </section>
    <b-progress
      v-if="!showBegin"
      v-model="userScore"
      type="is-info"
      show-value
      style="margin-top: 20px"
    ></b-progress>
    <Chords
      v-if="this.ShowChords == 'true'"
      :chords="scaleChords"
      style="margin-bottom: 50px"
    />
    <Notation
      v-if="this.ShowMusicSheet == 'true'"
      :scale="scale_info"
      :scale-name="scale_info.name"
    />
  </div>
</template>

<script>
import BuildFretboard from "../components/BuildFretboard.vue";
import Chords from "../components/Chords.vue";
import Notation from "../components/Notation.vue";
// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, Midi, ScaleType, Mode } from "@tonaljs/tonal";
import { Tunings } from "../tunings.js";
import { playNote } from "../guitarsounds";
var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

const tonicArray = ["A", "B", "C", "D", "E", "F", "G"];

export default {
  name: "BuildGame",

  components: {
    BuildFretboard,
    Chords,
    Notation,
  },

  data: function () {
    return {
      usr_tuning: localStorage.getItem("tuning") || "E A D G B E",
      sharps: "sharps",
      frets: 18,
      scale: { tonic: "A", type: "major" },
      ShowMusicSheet: "false",
      ShowChords: "false",
      ShowSettings: false,
      StartGame: false,
      ShowBegin: true,
      playerAnswer: null,
      tonicArray: tonicArray,
      userScore: 0,
      tonicCount: 0,
      clickedKeys: [],
      clickedNotes: [],
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
    // notes: function () {
    //   // return this.scale_info.notes.map(Note.chroma);
    //   return null; //notes now relies on the clickedNotes array which is populated when a user clicks a note
    // },
    scale_info: function () {
      let name = this.scale.tonic + " " + this.scale.type;
      return Scale.get(name);
    },
    scale_notes: function () {
      return this.scale_info.notes;
    },
    scaleChords: function () {
      return Mode.triads(this.scale_info.type, this.scale_info.tonic);
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
    // normalize(notes) {
    //   return notes.map((x) => x % 12);
    // },
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
    show_settings() {
      this.ShowSettings = true; //show settings like tuning and difficulty
      this.ShowBegin = false; //hide Begin button
    },
    submit_settings() {
      this.StartGame = true; //start game once users have submit settings
      this.ShowSettings = false; //hide settings menu
      this.start_game(); //start game
    },
    start_game() {
      this.clickedKeys = [];
      console.log("Game Started");
      let temp = this.calculate_tonic(); //set initial answer

      this.scale.tonic = temp; //show initial fretboard (1st question)
    },

    calculate_scale_type() {
      let randInt = Math.random();
      switch (this.gameDifficulty) {
        case "Easy":
          if (randInt < 0.5) {
            this.scale.type = "minor pentatonic";
            return;
          }
          this.scale.type = "major pentatonic";
          return;
        case "Medium":
          if (randInt < 0.5) {
            this.scale.type = "minor";
            return;
          }
          this.scale.type = "major";
          return;
        case "Hard":
          this.scale.type = "harmonic minor";
      }
    },

    calculate_random_element(inputArray) {
      //this function returns a random element of an array
      let random = Math.floor(Math.random() * inputArray.length); //find random index given array of inputArray
      let elem = inputArray[random]; //select random element of inputArray
      return elem;
    },
    calculate_tonic() {
      let tonic = this.calculate_random_element(tonicArray);
      while (tonic == this.scale.tonic) {
        //this loop ensures the same tonic wont be chosen twice in a row
        tonic = this.calculate_random_element(tonicArray);
        if (tonic != this.scale.tonic) {
          //if new tonic is different from displayed tonic (this.scale.tonic) break the loop
          break;
        }
      }
      this.scale.tonic = tonic; //update on screen fretboard with new tonic

      return tonic;
    },
    submit_answer() {
      // if (this.playerAnswer == this.correctAnswer) {
      //   this.userScore += 10;
      // }

      this.calculate_tonic();
    },
    test_method() {
      console.log("scale notes " + this.scale_notes);
      this.tonicCount = 0;
    },
    calculate_scale_notes() {
      console.log("clear notes ");
      return this.scale_info.notes.map(Note.chroma);
    },
    //this method is called from the click handler and pushes the clicked note onto the clickedNotes array
    clickHandle(note) {
      if (
        this.clickedNotes.includes(note.name) &&
        note.name != this.scale.tonic
      ) {
        alert(
          "You cannot select more than 1 of a non root note, please try again"
        );
        return;
      }

      if (note.name == this.scale.tonic) {
        this.tonicCount++; //counter only allows tonic note and its octave
        if (this.tonicCount >= 3) {
          alert("Cannot select more than 2 of the root note ");
          return;
        }
      }
      if (!this.scale_info.notes.includes(note.name)) {
        alert("Please try again, the note you selected is not correct");
        return;
      }
      this.clickedKeys.push(note.key); //key recorded to only render single note - need to double check
      this.clickedNotes.push(note.name); //records notes pressed to prevent non root duplicates

      playNote(note.key);
      // console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
