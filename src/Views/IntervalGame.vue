<template>
  <div>
    <b-button
      @click="testMethod"
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
      <IntervalFretboard
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
        @click="showSettings()"
        label="Begin"
        type="is-link"
      />
      <!-- <b-button v-if="ShowBegin" @click="showSettings()" label="Begin"/> -->
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
        <b-button @click="submitSettings()" label="Begin Game" />
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
            <b-radio-button v-model="playerAns" native-value="maj">
              <span>Major</span>
            </b-radio-button>
            <b-radio-button v-model="playerAns" native-value="min">
              <span>Minor</span>
            </b-radio-button>
            <b-radio-button v-model="playerAns" native-value="maj7">
              <span>Maj7</span>
            </b-radio-button>
            <b-radio-button v-model="playerAns" native-value="min7">
              <span>Min7</span>
            </b-radio-button>
            <b-radio-button v-model="playerAns" native-value="7">
              <span>7th</span>
            </b-radio-button>
          </b-field>
          <!-- Submit Answer Button -->
          <b-button
          @click="submitAnswer"
          label="Submit"
          style="margin-left: 20px"
          type="is-link"
          />
        </div>
        <h4>Questions Remaining: {{ questionCount }}</h4>
      </b-field>
    </div>
      <!-- Question Count -->
    <div v-if="StartGame && gameMode == 'IntervalMode'">
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
import IntervalFretboard from "../components/IntervalFretboard.vue";
import Chords from "../components/Chords.vue";
import Notation from "../components/Notation.vue";
import TuningSelection from "../components/TuningSelection.vue";
// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, Midi, ScaleType, Mode, Chord } from "tonal";
// import { Chord } from "tonal";
import { Tunings } from "../tunings.js";
import * as guitarSounds from "../guitarsounds";


var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

export default {
  name: "IdentifyGame",

  components: {
    IntervalFretboard,
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
      chordAns: null,
      playerAns: null,
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
    calculateRandomElement(inputArray) {
      //this function returns a random element of an array
      let random = Math.floor(Math.random() * inputArray.length); //find random index given array of inputArray
      let elem = inputArray[random]; //select random element of inputArray
      return elem;
    },

    calculateTonic() {
      let tonic = this.calculateRandomElement(this.tonicArray);
      //this loop ensures the same tonic wont be chosen twice in a row
      while (tonic == this.scale.tonic) {
        tonic = this.calculateRandomElement(this.tonicArray);
        //if new tonic is different from current tonic (this.scale.tonic) break the loop
        if (tonic != this.scale.tonic) {
          break;
        }
      }
      this.scale.tonic = tonic; //update on screen fretboard with new tonic
      return tonic;
    },

    //This function calculates a random chord type for the chord game
    calculateChordAns() {
      let randInt = Math.floor(Math.random() * 5);
      switch (randInt) {
        case 0:
          this.chordAns = "maj";
          break
        case 1:
          this.chordAns = "min";
          break
        case 2:
          this.chordAns = "maj7";
          break
        case 3:
          this.chordAns = "min7";
          break
        case 4:
          this.chordAns = "7";
          break
  }
},
    playChord() {
      let chord = Chord.getChord(this.chordAns,this.scale.tonic)
      guitarSounds.playChord(chord.notes);
    },
    showSettings() {
      this.ShowSettings = true; //Show Game Settings Menu
      this.ShowBegin = false; //Hide Begin button
    },
    submitSettings() {
      this.StartGame = true; //Start Game flag when users submit settings
      this.ShowSettings = false; //Hide Settings Menu
      // this.ShowMusicSheet = true;
      this.startGame(); //Start Game
    },
    startGame() {
      if(this.gameMode == "InteralMode"){
        this.scale.tonic = "C"
        this.scale.type = "chromatic"
        return;
      }
      this.calculateTonic(); //Set Initial Tonic
      this.calculateChordAns(); //Calculate Initial Answer
      this.scale.type = "major"

    },

    submitAnswer() {
      // console.log("Submitted")
      console.log("playerans: ", this.playerAns)
      console.log("chordans: ", this.chordAns)
      if(this.playerAns == this.chordAns){
        this.userScore += 20;
        this.playerAns = null;
        this.alertMessages("correct")
      }
      else {
        this.playerAns = null;
        this.alertMessages("wrong");

      }
      this.questionCount--;
      if (this.questionCount == 0 && this.gameMode == "ChordMode") {
        this.alertMessages("endChord");
      }
      this.calculateTonic(); //Change Tonic For Next Question
      this.calculateChordAns(); //Change Answer for Next Question
    },

    alertMessages(message) {
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
        case "endChord":
          this.$buefy.dialog.alert({
            message: `Thank you for playing the Chord Ear Training Game! You scored ${this.userScore}% `,
          });
          this.StartGame = false;
          this.ShowBegin = true;
          this.questionCount = 5;
          this.userScore = 0;
          // this.ShowMusicSheet = false;
          return;
        case "end":
          this.$buefy.dialog.alert({
            message: `Thank you for playing the Identify Scale Game! You scored ${this.userScore}% `,
          });
          this.StartGame = false;
          this.ShowBegin = true;
          this.questionCount = 5;
          this.userScore = 0;
          // this.ShowMusicSheet = false;
      }
    },

    clickHandle(note) {
      guitarSounds.playNote(note.key);
      // console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));
    },

    testMethod() {
      // let chord = Chord.getChord("7",this.scale.tonic)
      console.log("chordAns: ", this.chordAns)
      // this.scale.type = "chromatic"
      // console.log("test chord ", chord)
      // guitarSounds.playChord(chord.notes);

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
