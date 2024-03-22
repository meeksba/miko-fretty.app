<template>
  <div>
    <b-button
      @click="testMethod"
      label="TESTBUTTON"
      style="margin-top: 40px"
      class="has-text-centered"
    />
    <h1 v-if="ShowBegin" class="has-text-centered" style="margin-top: 50px">
      Identify the Scale Shown
    </h1>
    <h1 v-if="StartGame" class="has-text-centered">What Scale is This?</h1>
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
        @click="showSettings()"
        label="Begin"
        type="is-link"
      />
      <div v-if="ShowSettings">
        <!-- Settings Before Game -->
        <h2>Choose Your Settings</h2>
        <b-field>
          <!-- Difficulty Setting -->
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
          <!-- Notation Setting -->
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
          <!-- Tuning -->
          <TuningSelection
            @tuningChange="handleTuning"
            style="margin-top: 20px"
          />
        </b-field>
        <b-button
          @click="submitSettings()"
          label="Begin Game"
          type="is-link"
          outlined
        />
      </div>
      <!-- Input Fields -->
      <div v-if="StartGame">
        <b-field label="Enter Your Answer">
          <div
            class="columns is-multiline is-centered"
            style="margin-top: 10px"
          >
            <b-field class="Tonic" label="Tonic">
              <b-input
                v-model="playerTonic"
                icon="music"
                style="max-width: 100px"
              ></b-input>
            </b-field>
            <b-field class="Scale" label="Scale">
              <b-autocomplete
                v-model="playerScale"
                :data="scale_search"
                open-on-focus
                clearable
                append-to-body
              ></b-autocomplete>
            </b-field>
            <!-- Submit Answer Button -->
            <b-button
              @click="submit_answer"
              label="Submit"
              style="margin-top: 32px"
              type="is-link"
              outlined
            />
          </div>
        </b-field>
        <!-- Question Count -->
        <h4>Questions Remaining: {{ questionCount }}</h4>
      </div>
      <h3 v-if="StartGame" class="has-text-centered" style="margin-top: 15px">
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
import { collection, addDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { db } from "../main.js";
// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, Midi, ScaleType, Mode } from "tonal";
import { Tunings } from "../tunings.js";
import { playNote } from "../guitarsounds";

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
      scale: { tonic: "F", type: "minor" },
      tonicArray: ["C", "D", "E", "F", "G", "A", "B"],
      gameDifficulty: "Medium",
      gameMode: "Note",
      fretboardNotation: "sharp",
      ShowMusicSheet: false,
      ShowChords: false,
      ShowSettings: false,
      StartGame: false,
      ShowBegin: true,
      playerTonic: null,
      playerScale: null,
      questionCount: 5,
      userScore: 0,
      compiledQuizInfo: [],
      quizQuestions: [],
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
    calculateRandomElement(inputArray) {
      //this function returns a random element of an array
      let random = Math.floor(Math.random() * inputArray.length); //find random index given array of inputArray
      let elem = inputArray[random]; //select random element of inputArray
      return elem;
    },

    calculateTonic() {
      let tonic = this.calculateRandomElement(this.tonicArray);
      while (tonic == this.scale.tonic) {
        //this loop ensures the same tonic wont be chosen twice in a row
        tonic = this.calculateRandomElement(this.tonicArray);
        if (tonic != this.scale.tonic) {
          //if new tonic is different from displayed tonic (this.scale.tonic) break the loop
          break;
        }
      }
      this.scale.tonic = tonic; //update on screen fretboard with new tonic

      return tonic;
    },
    //this function calculates the type of scale (maj,min) given the chosen difficulty
    calculateScaleType() {
      let randInt = Math.random();
      switch (this.gameDifficulty) {
        case "Easy":
          this.scale.type =
            randInt < 0.5 ? "minor pentatonic" : "major pentatonic";
          return;
        case "Medium":
          this.scale.type = randInt < 0.5 ? "minor" : "major";
          return;
        case "Hard":
          this.scale.type = "harmonic minor";
      }
    },
    showSettings() {
      this.ShowSettings = true; //show settings like tuning and difficulty
      this.ShowBegin = false; //hide Begin button
    },
    submitSettings() {
      this.StartGame = true; //start game once users have submit settings
      this.ShowSettings = false; //hide settings menu
      if (this.gameMode == "Interval") {
        this.fretboardNotation = "Intervals";
        this.startGame(); //start game
        return;
      }
      this.ShowMusicSheet = true;
      this.startGame(); //start game
    },
    startGame() {
      this.calculateTonic(); //set initial answer
      this.calculateScaleType(); //create scale based on difficulty
    },

    submit_answer() {
      this.playerTonic = this.playerTonic.toUpperCase();

      this.quizQuestions.push({
        Answer: this.scale.tonic + " " + this.scale.type,
        Player_Answer: this.playerTonic + " " + this.playerScale,
      });
      if (
        this.playerTonic + this.playerScale ==
        this.scale.tonic + this.scale.type
      ) {
        //if user ans == displayed scale
        this.userScore += 20; //update userscore/progress bar
        this.alertMessages("correct");
      } else {
        this.alertMessages("wrong");
      }
      this.questionCount--;
      if (this.questionCount == 0) {
        this.alertMessages("end");
      }
      this.calculateScaleType(); //calculate scale according to difficulty
      this.calculateTonic(); //resets fretboard with tonic of new scale
      this.playerTonic = null; //reset tonic input
      this.playerScale = null; //reset scale type input
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
        case "end":
          this.$buefy.dialog.alert({
            message: `Thank you for playing the Identify Scale Game! You scored ${this.userScore}% `,
          });
          this.addToCollection();
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

    addToCollection() {
      addDoc(collection(db, "IdentifyQuizzes"), {
        userID: firebase.auth().currentUser.uid,
        date: Date.now(),
        mode: this.gameMode,
        difficulty: this.gameDifficulty,
        tuning: this.usr_tuning,
        score: this.userScore,
        questions: this.quizQuestions,
      });
    },

    testMethod() {
      console.log("Answer: " + this.scale.tonic + " " + this.scale.type);
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
