<template>
  <div>
    <!-- <h1> Identify Scale Game </h1> -->
    <h1 v-if="StartGame" class="has-text-centered">What Scale is This?</h1>
    <div class="card-image" style="text-align: center; overflow-x: auto">
      <IdentifyFretboard
        :tuning="tuning"
        :notes="notes"
        :notation="fretboardNotation"
        :frets="frets"
        :root="root"
        :scale="scale_info"
      />
    </div>

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
      <div v-if="StartGame">
        <b-field label="Enter Your Answer">
          <div
            class="columns is-multiline is-centered"
            style="margin-top: 10px"
          >
            <b-field class="Tonic" label="Tonic:">
              <b-input
                v-model="playerTonic"
                icon="music"
                style="max-width: 100px"
              ></b-input>
            </b-field>
            <b-field class="Scale" label="Scale ">
              <b-autocomplete
                v-model="playerScale"
                :data="scale_search"
                open-on-focus
                clearable
                append-to-body
              ></b-autocomplete>
            </b-field>
            <b-button
              @click="submit_answer"
              label="Submit"
              style="margin-top: 32px"
            />
          </div>
        </b-field>
      </div>
      <Notation
        v-if="this.ShowMusicSheet == 'true'"
        :scale="scale_info"
        :scale-name="scale_info.name"
      />

      <b-button
        @click="test_method"
        label="TESTBUTTON"
        style="margin-top: 40px"
      />
    </section>
    <b-progress
      v-if="StartGame"
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
  </div>
</template>

<script>
/* eslint-disable */
import IdentifyFretboard from "../components/IdentifyFretboard.vue";
import Chords from "../components/Chords.vue";
import Notation from "../components/Notation.vue";
import TuningSelection from "../components/TuningSelection.vue";
// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, Midi, ScaleType, Mode } from "@tonaljs/tonal";
import { Tunings } from "../tunings.js";

var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

const tonicArray = ["A", "B", "C", "D", "E", "F", "G"];
// let answerSet = new Set(); //This variable may later be needed

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
      ShowMusicSheet: "false",
      ShowChords: "false",
      gameDifficulty: "Medium",
      gameMode:"Note",
      fretboardNotation: "sharp",
      ShowSettings: false,
      StartGame:false,
      ShowBegin: true,
      playerTonic: null,
      playerScale: null,
      correctAnswer: null,
      tonicArray: tonicArray,
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
        return (
          option
            .toString()
            .toLowerCase()
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
    handleTuning(tuning){
      this.usr_tuning = tuning;
      this.saveSettings()
    },

    show_settings(){
      this.ShowSettings = true;  //show settings like tuning and difficulty 
      this.ShowBegin = false; //hide Begin button 
    },
    submit_settings(){
      this.StartGame = true;    //start game once users have submit settings 
      this.ShowSettings = false; //hide settings menu
      if(this.gameMode == "Interval"){
        this.fretboardNotation = "Intervals"
        this.start_game() //start game
        return
      } 
      this.ShowMusicSheet = 'true';
      this.start_game() //start game
    },
    start_game() {
      console.log("Game Started");
      this.calculate_tonic(); //set initial answer
      this.calculate_scale_type(); //create scale based on difficulty 
      console.log("tonic " + this.scale.tonic)
      console.log("type " + this.scale.type)
      // console.log("there")
    },

    submit_answer() {
    this.playerTonic = this.playerTonic.toUpperCase();
      if ((this.playerTonic + this.playerScale) == (this.scale.tonic + this.scale.type)) {
        //if user ans == displayed scale
        this.userScore += 10; //update userscore/progress bar
      }
      this.calculate_scale_type(); //calculate scale according to difficulty
      this.calculate_tonic(); //resets fretboard with tonic of new scale
      this.playerTonic = null;  //reset tonic input
      this.playerScale = null;  //reset scale type input 
      console.log("tonic " + this.scale.tonic)
      console.log("type " + this.scale.type)
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
      this.correctAnswer = tonic;
      this.scale.tonic = tonic; //update on screen fretboard with new tonic

      return tonic;
    },
    //this function calculates the type of scale (maj,min) given the chosen difficulty
    calculate_scale_type(){
      let randInt = Math.random()
      switch(this.gameDifficulty){
        case "Easy":
          if(randInt < .5){
            this.scale.type = "minor pentatonic"
            return
          }
          this.scale.type = "major pentatonic"
          return
        case "Medium":
          if(randInt < .5){
            this.scale.type = "minor"
            return
          }
          this.scale.type = "major"
          return
        case "Hard":
          this.scale.type = "harmonic minor"

      }
    },
    test_method() {

      this.calculate_scale_type(); //calculate scale according to difficulty
      this.calculate_tonic(); //resets fretboard with tonic of new scale
      // console.log(this.scale.tonic + " " + this.scale.type);
      console.log("scale before" + this.scale.type)
      this.scale.type = "chromatic"
      console.log("scale after" + this.scale.type)
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
h2{
  font-size:25px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
