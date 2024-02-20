<template>
  <div>
    <b-dropdown append-to-body aria-role="menu" trap-focus>
      <b-button class="button" slot="trigger" icon-left="cog"
        >Identify Settings</b-button
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
              <b-field label="Show hello">
                <b-field>
                  <b-radio-button v-model="ShowChords" native-value="true">
                    <span>True</span>
                  </b-radio-button>
                  <b-radio-button v-model="ShowChords" native-value="false">
                    <span>False</span>
                  </b-radio-button>
                </b-field>
              </b-field>
              <b-field label="Notation">
                <b-radio-button
                  v-model="fretboardNotation"
                  native-value="Intervals"
                >
                  <span>Interval</span>
                </b-radio-button>
                <b-radio-button
                  v-model="fretboardNotation"
                  native-value="sharp"
                >
                  <span>Notes</span>
                </b-radio-button>
                <b-radio-button v-model="fretboardNotation" native-value="test">
                  <span>Test</span>
                </b-radio-button>
              </b-field>
            </section>
          </div>
        </form>
      </b-dropdown-item>
    </b-dropdown>
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
        <b-field label="Enter Your Settings">
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
        </b-field>
        <b-field>
          <TuningSelection />
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
          </div>
        </b-field>
        <b-button
          @click="submit_answer"
          label="Submit"
          style="margin-top: 10px"
        />
      </div>

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
    <Notation
      v-if="this.ShowMusicSheet == 'true'"
      :scale="scale_info"
      :scale-name="scale_info.name"
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
      usr_tuning: localStorage.getItem("tuning") || "E A D G B E",
      sharps: "sharps",
      frets: 18,
      scale: { tonic: "F", type: "minor" },
      ShowMusicSheet: "false",
      ShowChords: "false",
      gameDifficulty: "Medium",
      fretboardNotation: "Intervals",
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
    start_game() {
      console.log("Game Started");
      this.calculate_tonic(); //set initial answer
      this.calculate_scale_type(); //create scale based on difficulty 
      // console.log("there")
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
    submit_answer() {
    this.playerTonic = this.playerTonic.toUpperCase();

      if ((this.playerTonic + this.playerScale) == (this.scale.tonic + this.scale.type)) {
        //if user ans == displayed scale
        this.userScore += 10; //update userscore/progress bar
      }
      this.calculate_scale_type(); //calculate if next question is major/minor etc 
      this.calculate_tonic(); //resets fretboard with tonic of new scale
      this.playerTonic = null;  //reset tonic input
      this.playerScale = null;  //reset scale type input 
    },
    show_settings(){
      this.ShowSettings = true;  //show settings like tuning and difficulty 
      this.ShowBegin = false; //hide Begin button 
    },
    submit_settings(){
      this.StartGame = true;    //start game once users have submit settings 
      this.ShowSettings = false; //hide settings menu 
      this.start_game() //start game
    },
    test_method() {

      // console.log("test method called ");
      this.calculate_scale_type(); //calculate if next question is major/minor etc 
      this.calculate_tonic(); //resets fretboard with tonic of new scale
      console.log(this.scale.tonic + " " + this.scale.type);

      // this.calculate_tonic();
    
      // this.scale.type = "minor"
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
  font-size: 20px;
  font-weight: bold;
}
</style>
