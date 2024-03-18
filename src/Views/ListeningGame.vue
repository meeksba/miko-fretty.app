<template>
  <div>
    <h1 v-if="ShowBegin" class="has-text-centered" style="margin-top: 50px">
      Ear Training Games
    </h1>
    <h1
      v-if="StartGame && gameMode == 'ChordMode'"
      class="has-text-centered"
      style="margin-top: 50px"
    >
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
      <ListeningFretboard
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
      <!-- Settings Before Game -->
      <div v-if="ShowSettings">
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
        </b-field>
        <b-field>
          <div v-if="gameMode == 'IntervalMode'">
            <h5>Difficulty</h5>
            <b-radio-button v-model="gameDifficulty" native-value="Easy">
              <span>Easy</span>
            </b-radio-button>
            <b-radio-button v-model="gameDifficulty" native-value="Hard">
              <span>Hard</span>
            </b-radio-button>
          </div>
          <!-- Tuning -->
          <!-- <TuningSelection
        @tuningChange="handleTuning"
        style="margin-top: 20px"
        /> -->
        </b-field>
        <b-button
          @click="submitSettings()"
          label="Begin Game"
          type="is-link"
          outlined
        />
      </div>
      <!-- Chord Mode Input Fields -->
      <div v-if="StartGame && gameMode == 'ChordMode'">
        <b-button
          @click="playChord()"
          label="Play Chord"
          type="is-info "
          outlined
          style="margin-bottom: 20px"
        />
        <b-button
          @click="playChordIndividually()"
          label="Play Notes Individually"
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
                <span>(Dom)7</span>
              </b-radio-button>
            </b-field>
            <!-- Chord Mode Submit Answer Button -->
            <b-button
              @click="submitAnswerChordGame()"
              label="Submit"
              style="margin-left: 20px"
              type="is-link"
            />
          </div>
          <h4>Questions Remaining: {{ questionCount }}</h4>
        </b-field>
      </div>
      <!-- Interval Mode Input Fields -->
      <div v-if="StartGame && gameMode == 'IntervalMode'">
        <b-button
          @click="playInterval()"
          label="Play Interval"
          type="is-info"
          outlined
          style="margin-bottom: 20px"
        />
        <b-field label="Choose Your Answer">
          <div
            class="columns is-multiline is-centered"
            style="margin-top: 10px"
          >
            <!-- Interval Select -->
            <b-field>
              <b-select
                v-model="playerAns"
                placeholder="Select an Interval"
                icon="account"
              >
                <option value="2m">Minor 2nd</option>
                <option value="2M">Major 2nd</option>
                <option value="3m">Minor 3rd</option>
                <option value="3M">Major 3rd</option>
                <option value="4P">Perfect 4th</option>
                <option value="5d">Diminished 5th</option>
                <option value="5P">Perfect 5th</option>
                <option value="6m">Minor 6th</option>
                <option value="6M">Major 6th</option>
                <option value="7m">Minor 7th</option>
                <option value="7M">Major 7th</option>
                <option value="8P">Octave</option>
              </b-select>
            </b-field>
            <!-- Interval Mode Submit Answer Button -->
            <b-button
              @click="submitAnswerIntervalGame()"
              label="Submit"
              style="margin-left: 20px"
              type="is-link"
            />
          </div>
          <h4>Questions Remaining: {{ questionCount }}</h4>
        </b-field>
      </div>
      <b-button
        @click="testMethod"
        label="test button"
        style="margin-top: 40px"
        class="has-text-centered"
      />
      <!-- Score Header -->
      <h3 v-if="StartGame" class="has-text-centered" style="margin-top: 20px">
        Score
      </h3>
    </section>
    <!-- Score Bar -->
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
import ListeningFretboard from "../components/ListeningFretboard.vue";
import Chords from "../components/Chords.vue";
import Notation from "../components/Notation.vue";
// import TuningSelection from "../components/TuningSelection.vue";
// import NoteSelect from "./NoteSelect.vue";
// import { Note, Scale, Midi, ScaleType, Mode, Chord, Interval } from "tonal";
import { Note, Scale, Midi, ScaleType, Mode } from "tonal";
import { Tunings } from "../tunings.js";
import * as guitarSounds from "../guitarsounds";

var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

export default {
  name: "ListeningGames",

  components: {
    ListeningFretboard,
    // TuningSelection,
    Notation,
    Chords,
  },

  data: function () {
    return {
      usr_tuning: localStorage.getItem("identifyTuning") || "E A D G B E",
      sharps: "sharps",
      frets: 18,
      scale: { tonic: "F", type: "" },
      tonicArray: ["C", "D", "E", "F", "G", "A", "B"],
      chromaticScale: [
        "C",
        "Db",
        "D",
        "Eb",
        "E",
        "F",
        "Gb",
        "G",
        "Ab",
        "A",
        "Bb",
        "B",
      ],
      chromaticIntervals: [
        "2m",
        "2M",
        "3m",
        "3M",
        "4P",
        "5d",
        "5P",
        "6m",
        "6M",
        "7m",
        "7M",
        "8P",
      ],
      gameDifficulty: "Medium",
      gameMode: "ChordMode",
      fretboardNotation: "flat",
      ShowMusicSheet: false,
      ShowChords: false,
      ShowBegin: true,
      ShowSettings: false,
      StartGame: false,
      chordAns: null,
      intervalNotes: [],
      previousIntervals: [],
      intervalAns: null,
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
    handleTuning(tuning) {
      this.usr_tuning = tuning;
      this.saveSettings();
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
      if (this.gameMode == "IntervalMode") {
        this.calculateIntervalAns();
        return;
      }
      this.calculateTonic(); //Set Initial Tonic
      this.calculateChordAns(); //Calculate Initial Chord Answer
      this.scale.type = "major";
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
      }
      this.scale.tonic = tonic; //update on screen fretboard with new tonic
      return tonic;
    },
    //This method calculates a random interval for the interval game
    calculateIntervalAns() {
      let root =
        this.gameDifficulty == "Easy"
          ? "C3"
          : this.calculateRandomElement(this.chromaticScale) + "3";
      this.intervalAns = this.calculateRandomElement(this.chromaticIntervals); //pick random interval
      while (this.previousIntervals.includes(this.intervalAns)) {
        this.intervalAns = this.calculateRandomElement(this.chromaticIntervals); //ensure duplicate intervals not chosen in easy mode
      }
      if (this.gameDifficulty == "Easy") {
        this.previousIntervals.push(this.intervalAns); // Easy mode: ensure no duplicate intervals chosen
      }
      let secondNote = Note.transpose(root, this.intervalAns); //Pass in root and interval to get 2nd note in interval

      this.intervalNotes = [root, secondNote];
    },

    //This method calculates a random chord type for the chord game
    calculateChordAns() {
      let randInt = Math.floor(Math.random() * 5);
      switch (randInt) {
        case 0:
          this.chordAns = "maj";
          break;
        case 1:
          this.chordAns = "min";
          break;
        case 2:
          this.chordAns = "maj7";
          break;
        case 3:
          this.chordAns = "min7";
          break;
        case 4:
          this.chordAns = "7";
          break;
      }
    },
    //This method plays the note clicked
    clickHandle(note) {
      guitarSounds.playNote(note.key);
      // console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));
    },
    playInterval() {
      console.log("intervalNotes: ", this.intervalNotes);
      guitarSounds.playInterval(this.intervalNotes);
    },
    playChord() {
      guitarSounds.playChord(this.chordAns, this.scale.tonic);
    },
    playChordIndividually() {
      // let chord = Chord.getChord("dim", "C");
      // console.log("chord", chord)
      guitarSounds.playChordIndividually(this.chordAns, this.scale.tonic);
    },

    submitAnswerChordGame() {
      console.log("Player Answer: ", this.playerAns);
      console.log("Correct Answer: ", this.chordAns);
      if (this.playerAns == this.chordAns) {
        this.userScore += 20;
        this.playerAns = null;
        this.alertMessages("correct");
      } else {
        this.playerAns = null;
        this.alertMessages("wrong");
      }
      this.questionCount--;
      if (this.questionCount == 0) {
        this.alertMessages("endChord");
      }
      this.calculateTonic(); //Change Tonic For Next Question
      this.calculateChordAns(); //Change Answer for Next Question
    },
    submitAnswerIntervalGame() {
      console.log("Player interval: ", this.playerAns);
      console.log("Correct interval: ", this.intervalAns);
      if (this.playerAns == this.intervalAns) {
        this.userScore += 20;
        this.playerAns = null;
        this.alertMessages("correct");
      } else {
        this.playerAns = null;
        this.alertMessages("wrong");
      }
      this.questionCount--;
      if (this.questionCount == 0) {
        this.alertMessages("endInterval");
      }
      this.intervalNotes = [];
      this.calculateIntervalAns(); //Change Answer for Next Question
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
          this.scale.tonic = "";
          this.scale.type = "";
          // this.ShowMusicSheet = false;
          return;
        case "endInterval":
          this.$buefy.dialog.alert({
            message: `Thank you for playing the Interval Ear Training Game! You scored ${this.userScore}% `,
          });
          this.StartGame = false;
          this.ShowBegin = true;
          this.questionCount = 5;
          this.userScore = 0;
          this.previousIntervals = [];
        // this.scale.tonic = "";
        // this.scale.type = "";
        // this.ShowMusicSheet = false;
      }
    },

    testMethod() {
      console.log("intervalAns: ", this.intervalAns);
      console.log("chordAns: ", this.chordAns);
      // let chord = Chord.getChord("7",this.scale.tonic)
      // console.log("chordAns: ", this.chordAns);
      // this.scale.tonic = "C";
      // this.scale.type = "chromatic";
      // let tempScale = JSON.parse(JSON.stringify(this.scale_info.notes));
      // console.log("tempScale before sharp: ", tempScale)
      // tempScale = guitarSounds.flatToSharp(tempScale)
      // console.log("tempScale after sharp: ", tempScale)
      // this.scale.type = "";
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
h5 {
  font-size: 15px;
  font-weight: bold;
  margin-top: 30px;
}
</style>
