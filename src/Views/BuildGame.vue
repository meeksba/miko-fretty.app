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
              <b-field label="Difficulty">
                <b-radio-button v-model="radioButton" native-value="Easy">
                  Easy
                </b-radio-button>
                <b-radio-button v-model="radioButton" native-value="Medium">
                  Medium
                </b-radio-button>
                <b-radio-button v-model="radioButton" native-value="Hard">
                  Hard
                </b-radio-button>
              </b-field>
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
    <h1 v-if="showBegin" class="has-text-centered">Build the Scale Given!</h1>
    <h1 v-if="!showBegin" class="has-text-centered">
      Build <b>{{ scale.tonic }} {{ scale.type }} </b> on the Fretboard Above
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
      <b-button v-if="showBegin" @click="start_game" label="Begin" />
      <b-button
        @click="test_method"
        label="TESTBUTTON"
        style="margin-top: 20px"
      />
      <!-- <b-button @click="clear_notes" label="CLEAR" /> -->
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
      // return this.scale_info.notes.map(Note.chroma);
      return this.clickedNotes.map(Note.chroma); //notes now relies on the clickedNotes array which is populated when a user clicks a note
    },
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
      this.scale.tonic = tonic; //update on screen fretboard with new tonic
      answerSet.clear();

      return tonic;
    },
    // calculate_wrong_answer() {
    //   let wrong = this.calculate_random_element(tonicArray);
    //   while (wrong == this.correctAnswer || answerSet.has(wrong)) {
    //     //ensures wrongAnswer is not correctAnswer and isnt a duplicate
    //     wrong = this.calculate_random_element(tonicArray);
    //   }
    //   answerSet.add(wrong);
    //   return wrong;
    // },
    submit_answer() {
      // if (this.playerAnswer == this.correctAnswer) {
      //   this.userScore += 10;
      // }

      this.calculate_tonic();
    },
    test_method() {
      // let temp = this.calculate_scale_notes()
      // console.log("notes " + JSON.stringify(temp, null, 2));
      // console.log("scale info " + JSON.stringify(this.scale_info.notes, null, 2));
      console.log("scale notes " + this.scale_notes);
    },
    calculate_scale_notes() {
      console.log("clear notes ");
      return this.scale_info.notes.map(Note.chroma);
    },
    clickHandle(note) {
      //this method is called from the click handler and pushes the clicked note onto the clickedNotes array
      console.log("scale notes " + this.scale_notes);
      console.log("note clicked " + JSON.stringify(note.name, null, 2));

      if (!this.scale_info.notes.includes(note.name)) {
        console.log("not in scale ");
        alert("Please try again, the note you selected is not correct");
        return;
      }
      this.clickedNotes.push(note.name); //passed to child fretboard component to be rendered
      this.clickedKeys.push(note.key); //key recorded to only render single note - need to double check
      console.log("Correct");
      // console.log("clickednotes " + JSON.stringify(this.clickedNotes, null, 2));
      // console.log("userkeys " + JSON.stringify(this.clickedKeys));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
