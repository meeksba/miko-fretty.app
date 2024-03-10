<template>
  <div>
    <b-button
      @click="test_method"
      label="test button"
      style="margin-top: 40px"
      class="has-text-centered"
    />
    <h1 v-if="ShowBegin" class="has-text-centered">Ear Training Games</h1>
    <h1 v-if="StartGame && gameMode == 'ChordMode'" class="has-text-centered">
      What Chord Has Played?
    </h1>
    <!-- <b-button @click="playChord()" label="Play Sound"/> -->
    <h1
      v-if="StartGame && gameMode == 'IntervalMode'"
      class="has-text-centered"
    >
      What Interval Has Played?
    </h1>
    <div class="card-image" style="text-align: center; overflow-x: auto">
      <IdentifyFretboard
        :tuning="tuning"
        :notes="notes"
        :notation="fretboardNotation"
        :frets="frets"
        :root="root"
        :scale="scale_info"
        @clickNote="clickHandle"
      />
    </div>

    <section
      class="has-text-centered"
      style="display: flex; flex-direction: column; align-items: center"
    >
      <!-- Begin Button -->
      <b-button
        v-if="ShowBegin"
        @click="show_settings()"
        label="Begin"
        type="is-link"
      />
      <!-- <b-button v-if="ShowBegin" @click="show_settings()" label="Begin"/> -->
      <div v-if="ShowSettings">
        <!-- Settings Before Game -->
        <h2>Choose Your Game Mode</h2>
        <b-field>
          <!-- Game Mode Setting -->
          <div>
            <b-radio-button v-model="gameMode" native-value="ChordMode">
              <span>Chord Training</span>
            </b-radio-button>
            <b-radio-button v-model="gameMode" native-value="IntervalMode">
              <span>Interval Training</span>
            </b-radio-button>
          </div>
          <!-- </b-field> -->
        </b-field>
        <b-field>
          <!-- Tuning -->
          <TuningSelection
            @tuningChange="handleTuning"
            style="margin-top: 20px"
          />
        </b-field>
        <b-button @click="submit_settings()" label="Begin Game" />
      </div>
      <!-- Input Fields -->
      <div v-if="StartGame && gameMode == 'ChordMode'">
        <b-button
          @click="playChord()"
          label="Play Chord"
          type="is-info "
          outlined
          style="margin-bottom: 20px"
        />
        <b-field label="Choose Your Answer">
          <div
            class="columns is-multiline is-centered"
            style="margin-top: 10px"
          >
            <b-field>
              <b-radio-button v-model="chordAns" native-value="maj">
                <span>Major</span>
              </b-radio-button>
              <b-radio-button v-model="chordAns" native-value="min">
                <span>Minor</span>
              </b-radio-button>
              <b-radio-button v-model="chordAns" native-value="maj7">
                <span>Maj7</span>
              </b-radio-button>
              <b-radio-button v-model="chordAns" native-value="min7">
                <span>Min7</span>
              </b-radio-button>
              <b-radio-button v-model="chordAns" native-value="dom7">
                <span>7th</span>
              </b-radio-button>
            </b-field>
            <!-- Submit Answer Button -->
            <b-button
              @click="submit_answer"
              label="Submit"
              style="margin-left: 20px"
              type="is-link"
            />
          </div>
        </b-field>
        <!-- Question Count -->
        <h4>Questions Remaining: {{ questionCount }}</h4>
      </div>
      <h3 v-if="StartGame" class="has-text-centered" style="margin-top: 20px">
        Score
      </h3>
    </section>
    <!-- Progress Bar -->
    <b-progress
      v-if="StartGame"
      v-model="userScore"
      style="margin-top: 10px"
      type="is-info"
      show-value
    ></b-progress>
    <Notation
      v-if="this.ShowMusicSheet"
      :scale="scale_info"
      :scale-name="scale_info.name"
    />

    <Chords
      v-if="this.ShowChords"
      :chords="scaleChords"
      style="margin-bottom: 50px"
    />
  </div>
</template>

<script>
import IdentifyFretboard from "../components/IdentifyFretboard.vue";
import Chords from "../components/Chords.vue";
import Notation from "../components/Notation.vue";
import TuningSelection from "../components/TuningSelection.vue";
// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, Midi, ScaleType, Mode, Chord } from "@tonaljs/tonal";
// import { Chord } from "tonal";
import { Tunings } from "../tunings.js";
import { playNote, playChord } from "../guitarsounds";

var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

export default {
  name: "IdentifyGame",

  components: {
    IdentifyFretboard,
    TuningSelection,
    Notation,
    Chords,
  },

  data: function () {
    return {
      usr_tuning: localStorage.getItem("identifyTuning") || "E A D G B E",
      sharps: "sharps",
      frets: 18,
      scale: { tonic: "F", type: "" },
      tonicArray: ["A", "B", "C", "D", "E", "F", "G"],
      gameDifficulty: "Medium",
      gameMode: "ChordMode",
      fretboardNotation: "sharp",
      ShowMusicSheet: false,
      ShowChords: false,
      ShowSettings: false,
      StartGame: false,
      ShowBegin: true,
      playerTonic: null,
      playerScale: null,
      chordAns: null,
      questionCount: 5,
      userScore: 0,
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
        return option.toString().toLowerCase();
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
      localStorage.setItem("identifyTuning", this.usr_tuning);
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
    handleTuning(tuning) {
      this.usr_tuning = tuning;
      this.saveSettings();
    },
    calculate_random_element(inputArray) {
      //this function returns a random element of an array
      let random = Math.floor(Math.random() * inputArray.length); //find random index given array of inputArray
      let elem = inputArray[random]; //select random element of inputArray
      return elem;
    },

    calculate_tonic() {
      let tonic = this.calculate_random_element(this.tonicArray);
      //this loop ensures the same tonic wont be chosen twice in a row
      while (tonic == this.scale.tonic) {
        tonic = this.calculate_random_element(this.tonicArray);
        //if new tonic is different from current tonic (this.scale.tonic) break the loop
        if (tonic != this.scale.tonic) {
          break;
        }
      }
      this.scale.tonic = tonic; //update on screen fretboard with new tonic

      return tonic;
    },
    //This function calculates answers and interval for chordGame
    calculateChordAns() {
      let randInt = Math.floor(Math.random() * 5);
      switch (randInt) {
        case 0:
          return { name: "maj", pattern: [0, 4, 7] };
        case 1:
          return { name: "min", pattern: [0, 3, 7] };
        case 2:
          return { name: "maj7", pattern: [0, 4, 7, 11] };
        case 3:
          return { name: "min7", pattern: [0, 3, 7, 10] };
        case 4:
          return { name: "dom7", pattern: [0, 4, 7, 10] };
      }
    },
    playChord() {
      this.scale.type = "chromatic";
      let scaleNotes = JSON.parse(JSON.stringify(this.scale_info.notes));
      this.scale.type = "";
      // let pattern = this.chordAns.pattern;
      // let chord = []
      // for(let i = 0; i < pattern.length; i++){
      //   chor
      // }
      playChord(scaleNotes);
    },
    show_settings() {
      this.ShowSettings = true; //Show Game Settings Menu
      this.ShowBegin = false; //Hide Begin button
    },
    submit_settings() {
      this.StartGame = true; //Start Game flag when users submit settings
      this.ShowSettings = false; //Hide Settings Menu
      // if (this.gameMode == "Interval") {
      //   this.fretboardNotation = "Intervals";
      //   this.start_game(); //start game
      //   return;
      // }
      this.ShowMusicSheet = true;
      this.start_game(); //Start Game
    },
    start_game() {
      this.calculate_tonic(); //Set Initial Tonic
      this.chordAns = this.calculateChordAns(); //Calculate Initial Answer
    },

    submit_answer() {
      // if (
      // ) {
      //   //if user ans == displayed scale
      //   this.userScore += 20; //update userscore/progress bar
      //   this.alert_messages("correct");
      // } else {
      //   this.alert_messages("wrong");
      // }
      // this.questionCount--;
      // if (this.questionCount == 0) {
      //   this.alert_messages("end");
      // }
    },

    alert_messages(message) {
      switch (message) {
        case "correct":
          this.$buefy.toast.open({
            duration: 3000,
            message: "Correct!",
            position: "is-bottom",
            type: "is-success",
          });
          return;
        case "wrong":
          this.$buefy.toast.open({
            duration: 3000,
            message: "Incorrect",
            position: "is-bottom",
            type: "is-danger",
          });
          return;
        case "end":
          this.$buefy.dialog.alert({
            message: `Thank you for playing the Identify Scale Game! You scored ${this.userScore}% `,
          });
          this.StartGame = false;
          this.ShowBegin = true;
          this.questionCount = 5;
          this.userScore = 0;
          this.ShowMusicSheet = false;
      }
    },

    clickHandle(note) {
      playNote(note.key);
      // console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));
    },

    test_method() {
      // console.log("Answer: " + this.scale.tonic + " " + this.scale.type);
      // this.scale.type = "chromatic";
      // let temp = JSON.parse(JSON.stringify(this.scale_info.notes));
      // this.scale.type = "";
      // console.log("hello ", temp);
      // console.log(this.scale_info)
      let Cee = Chord.notes("maj4", "C4");
      console.log("Cee", Cee);
      console.log("testing ", this.chordAns);
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
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
h3 {
  font-size: 25px;
  font-weight: bold;
}
h4 {
  font-size: 15px;
  font-weight: bold;
  margin-top: 30px;
  color: gray;
}
</style>
