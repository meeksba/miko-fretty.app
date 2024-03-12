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
        :notation="fretboardNotation"
        :frets="frets"
        :root="root"
        :scale="scale_info"
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
      <!-- Begin Button -->
      <b-button
        v-if="ShowBegin"
        @click="show_settings()"
        label="Begin"
        type="is-link"
        outlined
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
          @click="submit_settings()"
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
          @click="play_scale"
          label="Play Scale"
          style="margin-top: 20px"
          type="is-link"
          outlined
        />
      </div>
      <b-button
        @click="test_method"
        label="TESTBUTTON"
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

// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, ScaleType, Mode } from "tonal";
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
      tonicArray: ["A", "B", "C", "D", "E", "F", "G"],
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
    // toname(x) {
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
    show_settings() {
      this.ShowSettings = true; //show settings like tuning and difficulty
      this.ShowBegin = false; //hide Begin button
    },
    submit_settings() {
      this.StartGame = true; //start game once users have submit settings
      this.ShowSettings = false; //hide settings menu
      if (this.gameMode == "Interval") {
        this.fretboardNotation = "Intervals";
        this.start_game(); //start game
        return;
      }
      this.start_game(); //start game
    },
    start_game() {
      this.clickedKeys = [];
      this.calculate_tonic(); //set initial answer
      this.calculate_scale_type();
      console.log("Game Started");
      if (
        this.scale_info.notes.some((f) => f.includes("b")) &&
        this.fretboardNotation == "sharp"
      ) {
        console.log("Converted to Flat Notation");
        this.fretboardNotation = "flat";
      }
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

    //this function returns a random element of an array
    calculate_random_element(inputArray) {
      let random = Math.floor(Math.random() * inputArray.length); //find random index given array of inputArray
      let elem = inputArray[random]; //select random element of inputArray
      return elem;
    },
    calculate_tonic() {
      let tonic = this.calculate_random_element(this.tonicArray);
      while (tonic == this.scale.tonic) {
        //this loop ensures the same tonic wont be chosen twice in a row
        tonic = this.calculate_random_element(this.tonicArray);
        if (tonic != this.scale.tonic) {
          //if new tonic is different from displayed tonic (this.scale.tonic) break the loop
          break;
        }
      }
      this.scale.tonic = tonic; //update on screen fretboard with new tonic

      return tonic;
    },
    calculate_scale_notes() {
      return this.scale_info.notes.map(Note.chroma);
    },
    //this function finds the correct interval of the note given its name and knowing the tonic of the scale
    intervalToNote(name) {
      console.log("name " + name);
      let chromaticIntervals = [
        "1P",
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
      ];
      let chromaticNotes = [
        "A",
        "A#",
        "B",
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
      ];
      let n = chromaticNotes.length; //also length of chromaticIntervals
      let tonicIndex = chromaticNotes.indexOf(this.scale.tonic);
      let cur = 0;
      for (let i = tonicIndex; i < 25; i++) {
        if (chromaticIntervals[cur] == name) {
          console.log("note found " + chromaticNotes[((i % n) + n) % n]);
          return chromaticNotes[((i % n) + n) % n];
        }
        cur++;
      }
    },
    //This method is called from the click handler and pushes the clicked note onto the clickedNotes array
    clickHandle(note) {
      console.log("this tuning ", this.tuning);
      guitarSounds.playNote(note.key);
      let name = note.name;
      if (this.fretboardNotation == "Intervals") {
        name = this.intervalToNote(note.name);
      }
      if (this.StartGame) {
        // console.log("note " + JSON.stringify(note, null, 2));
        if (this.clickedKeys.includes(note.key)) {
          this.alert_messages("Duplicate");
          return;
        }
        if (this.clickedNotes.includes(name) && name != this.scale.tonic) {
          this.alert_messages(">1nonroot");
          return;
        }
        if (name == this.scale.tonic) {
          this.tonicCount++; //counter only allows tonic note and its octave
          if (this.tonicCount >= 3) {
            this.alert_messages(">2root");
            return;
          }
        }
        if (!this.scale_info.notes.includes(name)) {
          this.alert_messages("wrong");
          return;
        }
        this.clickedKeys.push(note.key); //key recorded to only render single note - need to double check
        this.clickedNotes.push(name); //records notes pressed to prevent non root duplicates
        if (this.clickedKeys.length == this.scale_info.notes.length + 1) {
          this.alert_messages("end");
        }
        this.alert_messages("correct");
      }

      // console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));
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
    play_scale() {
      guitarSounds.playScale(this.scale_info.notes);
    },

    test_method() {
      // this.scale_info.tonic = "F"
      // this.scale_info.type = "major"
      console.log("scale info notes " + this.scale_info.notes);
      // this.scale.type = "major pentatonic"
      // let temp = this.flatToSharp(this.scale_info.notes)
      // console.log("temp " + temp)
      // console.log("checking " + this.scale_info.some(f=> f.includes('b')));
      // console.log("clickednotes " + JSON.stringify(this.scale_notes, null, 2));
      // console.log(typeof(this.scale_notes)
      // console.log("calc notes " + this.calculate_scale_notes());
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
h4 {
  font-size: 15px;
  font-weight: bold;
  margin-top: 30px;
  color: gray;
}
</style>
