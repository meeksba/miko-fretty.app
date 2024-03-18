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
    <h1 v-if="ShowBegin" class="has-text-centered">Build the Scale Given!</h1>
    <div class="card-image" style="text-align: center; overflow-x: auto">
      <BuildFretboard
        :tuning="tuning"
        :notes="notes"
        :notation="fretboardNotation"
        :frets="frets"
        :root="root"
        :scale="scale_info"
        :clickedKeys="clickedKeys"
        @clickNote="clickHandle"
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
      <div v-if="StartGame" class="has-text-centered">
        <h1>
          Build <b>{{ scale.tonic }} {{ scale.type }} </b> on the Fretboard
          Above
        </h1>
        <!-- Question Count -->
        <h4>Questions Remaining: {{ questionCount }}</h4>
        <b-button
          @click="playScale"
          label="Play Scale"
          style="margin-top: 20px"
          type="is-link"
          outlined
        />
      </div>
      <b-button
        @click="testMethod"
        label="TESTBUTTON"
        style="margin-top: 20px"
      />
      <b-button
        @click="chordCheck()"
        label="Chord check"
        style="margin-top: 20px"
      />
    </section>
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
import TuningSelection from "../components/TuningSelection.vue";
// import * as utils from "../utils.js";
import { Note, Scale, ScaleType, Mode, Chord } from "tonal";
import { Tunings } from "../tunings.js";
import * as guitarSounds from "../guitarsounds";
var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

export default {
  name: "BuildGame",

  components: {
    BuildFretboard,
    Chords,
    Notation,
    TuningSelection,
  },

  data: function () {
    return {
      usr_tuning: localStorage.getItem("tuning") || "E A D G B E",
      sharps: "sharps",
      frets: 18,
      scale: { tonic: "A", type: "major" },
      tonicArray: ["C", "D", "E", "F", "G", "A", "B"],
      ShowMusicSheet: "false",
      ShowChords: "false",
      gameDifficulty: "Medium",
      gameMode: "Note",
      fretboardNotation: "sharp",
      ShowSettings: false,
      StartGame: false,
      ShowBegin: true,
      userScore: 0,
      tonicCount: 0,
      questionCount: 3,
      ansArray: [],
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
    // toName(x) {
    //   return Midi.midiToNoteName(x, {
    //     sharps: this.notation != "flat",
    //     pitchClass: true,
    //   });
    // },
    // scale_input(x) {
    //   if (x == "") {
    //     return;
    //   }
    // },
    handleTuning(tuning) {
      this.usr_tuning = tuning;
      this.saveSettings();
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
      this.startGame(); //start game
    },
    startGame() {
      this.clickedKeys = [];
      this.clickedNotes = [];
      this.calculateTonic(); //set initial answer
      this.calculateScaleType(); //create scale based on tonic
      this.ansArray =
        this.gameMode == "Note" ? this.scale_notes : this.scale_info.intervals;
    },

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

    //this function returns a random element of an array
    calculateRandomElement(inputArray) {
      let random = Math.floor(Math.random() * inputArray.length); //find random index given array of inputArray
      let elem = inputArray[random]; //select random element of inputArray
      return elem;
    },
    calculateTonic() {
      let tonic = this.calculateRandomElement(this.tonicArray);
      while (tonic == this.scale.tonic) {
        //this loop ensures the same tonic wont be chosen twice in a row
        tonic = this.calculateRandomElement(this.tonicArray);
      }
      this.scale.tonic = tonic; //update on screen fretboard with new tonic
      return tonic;
    },
    playScale() {
      let scale = Scale.get(this.scale.tonic + "3 " + this.scale.type);
      scale.notes.push(this.scale.tonic + "4"); //add octave of root
      guitarSounds.playScale(scale.notes);
    },

    chordCheck() {
      let temp = Chord.detect(this.clickedNotes);
      console.log("Detected Chord: ", temp);
    },
    clickHandle(note) {
      guitarSounds.playNote(note.key);
      let name = note.name;
      // this.clickedNotes.push(name);
      // this.clickedKeys.push(note.key);
      if (this.StartGame) {
        if (this.clickedKeys.includes(note.key)) {
          this.alertMessages("Duplicate");
          return;
        }
        if (this.clickedNotes.includes(name) && name != this.ansArray[0]) {
          this.alertMessages(">1nonroot");
          return;
        }
        if (name == this.ansArray[0]) {
          this.tonicCount++; //counter only allows tonic note and its octave
          if (this.tonicCount > 2) {
            this.alertMessages(">2root");
            return;
          }
        }
        if (!this.ansArray.includes(name)) {
          this.alertMessages("wrong");
          return;
        }
        this.clickedKeys.push(note.key); //key recorded to only render single note - need to double check
        this.clickedNotes.push(name); //records notes pressed to prevent non root duplicates
        if (this.clickedKeys.length == this.ansArray.length + 1) {
          console.log("Buildgame done ");
          this.alertMessages("end");
        }
        this.alertMessages("correct");
      }

      // console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));
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
        case "Duplicate":
          this.$buefy.toast.open({
            duration: 3000,
            message: "Cannot click the same note twice, please try again",
            position: "is-bottom",
            type: "is-danger",
          });
          return;
        case ">1nonroot":
          this.$buefy.toast.open({
            duration: 3000,
            message:
              "Cannot select more than 1 of a non root, please try again",
            position: "is-bottom",
            type: "is-danger",
          });
          return;
        case ">2root":
          this.$buefy.toast.open({
            duration: 3000,
            message: "Cannot select more than 2 of the root note ",
            position: "is-bottom",
            type: "is-danger",
          });
          return;
        case "wrong":
          this.$buefy.toast.open({
            duration: 3000,
            message: "Please try again, the note you selected is not correct",
            position: "is-bottom",
            type: "is-danger",
          });
          return;
        case "end":
          this.$buefy.dialog.alert({
            message: `Thank you for playing the Build Scale Game!`,
          });
          this.fretboardNotation = "sharp";
          this.StartGame = false;
          this.ShowSettings = false;
          this.ShowBegin = true;
          this.clickedKeys = [];
          this.clickedNotes = [];
          this.tonicCount = 0;
          // location.reload();

          return;
      }
    },

    testMethod() {
      // console.log("scale info ", this.scale_info);
      // console.log("ansarray: ",this.ansArray)
      console.log("clicked notes: ", this.clickedNotes);
      // console.log("ansarray: ",this.ansArray)
      // console.log("clickednotes " + JSON.stringify(this.scale_notes, null, 2));
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
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 20px;
}
h4 {
  font-size: 15px;
  font-weight: bold;
  margin-top: 30px;
  color: gray;
}
</style>
