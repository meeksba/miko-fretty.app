<template>
  <div>
    <b-dropdown append-to-body aria-role="menu" trap-focus>
      <b-button class="button" slot="trigger" icon-left="cog"
        >Build Settings</b-button
      >

      <b-dropdown-item aria-role="menu-item" :focusable="false" paddingless>
        <form action>
          <div class="modal-card" style="width: 500px">
            <section class="modal-card-body">
              <b-field label="Difficulty">
                <b-radio-button
                  v-model="radioButton"
                  native-value="Easy"
                  type="is-primary is-light is-outlined"
                >
                  Easy
                </b-radio-button>
                <b-radio-button
                  v-model="radioButton"
                  native-value="Medium"
                  type="is-primary is-light is-outlined"
                >
                  NOTUNLOCKED
                </b-radio-button>
                <b-radio-button
                  v-model="radioButton"
                  native-value="Hard"
                  type="is-primary is-light is-outlined"
                >
                  NOTUNLOCKED
                </b-radio-button>
              </b-field>
              <b-field label="Test">
                <b-radio-button native-value="true">
                  <span>True</span>
                </b-radio-button>
              </b-field>
            </section>
          </div>
        </form>
      </b-dropdown-item>
    </b-dropdown>
    <div class="card-image" style="text-align: center; overflow-x: auto">
      <CustomFretboard
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
    <h1 class="has-text-centered">Build the Scale Given!</h1>

    <section
      class="has-text-centered"
      style="display: flex; justify-content: space-between"
    >
      <b-field v-if="!showBegin" label="Enter Your Answer">
        <b-select
          v-model="playerAnswer"
          placeholder="Select a key"
          icon="music"
          id="playerAnswer"
        >
          <option v-for="elem in tonicArray" :value="elem" :key="elem">
            {{ elem }}
          </option>
        </b-select>
        <b-button v-if="!showBegin" @click="submit_answer" label="Submit" />
      </b-field>
      <b-button v-if="showBegin" @click="start_game" label="Begin" />
      <b-button @click="test_method" label="TESTBUTTON" />
      <b-button @click="clear_notes" label="CLEAR" />
    </section>
    <b-progress
      v-if="!showBegin"
      v-model="userScore"
      type="is-info"
      show-value
    ></b-progress>
    <!-- <Chords
        v-if="this.ShowChords == 'true'"
        :chords="scaleChords"
        style="margin-bottom: 50px"
      /> -->
    <!-- <Notation
        v-if="this.ShowMusicSheet == 'true'"
        :scale="scale_info"
        :scale-name="scale_info.name"
      /> -->
  </div>
</template>

<script>
import CustomFretboard from "../components/CustomFretboard.vue";
// import Chords from "../components/Chords.vue";
// import Notation from "../components/Notation.vue";
// import NoteSelect from "./NoteSelect.vue";
import { Note, Scale, Midi, ScaleType, Mode } from "@tonaljs/tonal";
import { Tunings } from "../tunings.js";

var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

const tonicArray = ["A", "B", "C", "D", "E", "F", "G"];
let answerSet = new Set();

export default {
  name: "BuildGame",

  components: {
    CustomFretboard,
    // Chords,
    // Notation,
    // NoteSelect,
  },

  data: function () {
    return {
      usr_tuning: localStorage.getItem("tuning") || "E A D G B E",
      sharps: "sharps",
      frets: 18,
      scale: {},
      ShowMusicSheet: "true",
      ShowChords: "true",
      showBegin: "true",
      playerAnswer: null,
      tonicArray: tonicArray,
      userScore: 0,
      correctAnswer: null,
      clickedNotes: [],
      clickedKeys: [],
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
      // return this.scale_info.notes.map(Note.chroma); --original implementation
      return this.clickedNotes.map(Note.chroma); //notes now relies on the clickedNotes array which is populated when a user clicks a note
    },
    scale_info: function () {
      let name = this.scale.tonic + " " + this.scale.type;
      return Scale.get(name);
    },
    scaleChords: function () {
      return Mode.triads(this.scale_info.type, this.scale_info.tonic);
    },
    // scale_search: function () {
    //   return ALL_SCALES.filter((option) => {
    //     return (
    //       option
    //         .toString()
    //         .toLowerCase()
    //         .indexOf(this.scale.type.toLowerCase()) >= 0
    //     );
    //   });
    // },
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
      this.showBegin = !this.showBegin; //hide begin button
      let temp = this.calculate_tonic(); //set initial answer
      this.scale.tonic = temp; //show initial fretboard (1st question)
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
      console.log(
        "Correct answer in calculate tonic method " + this.correctAnswer
      );
      this.scale.tonic = tonic; //update on screen fretboard with new tonic
      answerSet.clear();

      return tonic;
    },
    calculate_wrong_answer() {
      let wrong = this.calculate_random_element(tonicArray);
      while (wrong == this.correctAnswer || answerSet.has(wrong)) {
        //ensures wrongAnswer is not correctAnswer and isnt a duplicate
        wrong = this.calculate_random_element(tonicArray);
      }
      answerSet.add(wrong);
      return wrong;
    },
    submit_answer() {
      console.log("Player answer " + this.playerAnswer);
      console.log("Correct answer " + this.correctAnswer);
      if (this.playerAnswer == this.correctAnswer) {
        this.userScore += 10;
      }
      this.calculate_tonic();
      this.calculate_wrong_answer();
      console.log("Submitted Answer");
    },
    test_method() {
      console.log("notes " + this.notes);
    },
    clear_notes() {
      console.log("clear notes ");
    },
    clickHandle(note) {
      //this method is called from the click handler and pushes the clicked note onto the clickedNotes array
      this.clickedNotes.push(note.name);
      console.log("note clicked " + JSON.stringify(note, null, 2));
      console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));

      this.clickedKeys.push(note.key);
      console.log("userkey " + JSON.stringify(this.clickedKeys));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
