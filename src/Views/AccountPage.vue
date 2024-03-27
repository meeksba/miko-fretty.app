<!-- https://www.youtube.com/watch?v=skaPoOhp4OI -->
<template>
  <section>
    <!-- Navigation Buttons -->
    <div class="has-text-centered">
      <b-button
        @click="
          showIdentity = true;
          showBuild = false;
          showEar = false;
        "
        type="is-rounded is-info is-light"
        outlined
        >Scale Identification History</b-button
      >
      <b-button
        @click="
          showBuild = true;
          showIdentity = false;
          showEar = false;
        "
        type="is-rounded is-info is-light"
        outlined
        >Scale Building History</b-button
      >
      <b-button
        @click="
          showEar = true;
          showIdentity = false;
          showBuild = false;
        "
        type="is-rounded is-info is-light"
        outlined
        >Ear Training History</b-button
      >
    </div>
    <!-- <b-button @click="testMethod()">testaccountpage </b-button> -->
    <!-- Identify Table -->
    <div v-if="showIdentity">
      <b-table :data="identityInfo" striped>
        <b-table-column field="userID" label="Name of Game" width="40">
          Scale Identification
        </b-table-column>

        <b-table-column
          field="date"
          label="Date"
          :th-attrs="dateThAttrs"
          :td-attrs="columnTdAttrs"
          centered
          v-slot="props"
        >
          <span class="tag is-success">
            {{ new Date(props.row.date).toLocaleDateString() }}
          </span>
        </b-table-column>
        <b-table-column
          field="tuning"
          label="Tuning"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.tuning }}
        </b-table-column>
        <b-table-column
          field="difficulty"
          label="Difficulty"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.difficulty }}
        </b-table-column>
        <b-table-column
          field="mode"
          label="Notation Mode"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.mode }}
        </b-table-column>

        <b-table-column
          field="score"
          label="Score"
          :td-attrs="columnTdAttrs"
          numeric
          v-slot="props"
        >
          {{ props.row.score }}%
        </b-table-column>

        <b-table-column
          field="correctNotes"
          label="Correct Answer"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          <div v-for="(elem, index) in props.row.questions" :key="index">
            {{ elem.Answer }}
          </div>
        </b-table-column>

        <b-table-column
          field="playerAnser"
          label="Player Answer"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          <div v-for="(elem, index) in props.row.questions" :key="index">
            {{ elem.Player_Answer }}
          </div>
        </b-table-column>
      </b-table>
    </div>
    <!-- Build Table -->
    <div v-if="showBuild">
      <b-table :data="buildInfo" striped label="Identify Scale Game">
        <b-table-column field="userID" label="Name of Game" width="40">
          Scale Building
        </b-table-column>

        <b-table-column
          field="date"
          label="Date"
          :th-attrs="dateThAttrs"
          :td-attrs="columnTdAttrs"
          centered
          v-slot="props"
        >
          <span class="tag is-success">
            {{ new Date(props.row.date).toLocaleDateString() }}
          </span>
        </b-table-column>
        <b-table-column
          field="tuning"
          label="Tuning"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.tuning }}
        </b-table-column>

        <b-table-column
          field="difficulty"
          label="Difficulty"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.difficulty }}
        </b-table-column>
        <b-table-column
          field="notationMode"
          label="Notation Mode"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.notationMode }}
        </b-table-column>
        <b-table-column
          field="gameMode"
          label="Game Mode"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.gameMode }}
        </b-table-column>

        <b-table-column
          field="scaleName"
          label="Scale/Arpeggio Name"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.scaleName }}
        </b-table-column>
        <b-table-column
          field="correctNotes"
          label="Scale/Arpeggio Notes"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          <span v-for="note in props.row.correctNotes" :key="note">
            {{ note }}
          </span>
        </b-table-column>

        <b-table-column
          field="Incorrect Notes"
          label="Wrong Notes Clicked"
          :td-attrs="columnTdAttrs"
          numeric
          v-slot="props"
        >
          <span v-for="note in props.row.incorrectNotes" :key="note">
            {{ note }}
          </span>
        </b-table-column>
      </b-table>
    </div>
    <!-- Ear Training Table -->
    <div v-if="showEar">
      <b-table :data="earInfo" striped label="Ear Training Game">
        <b-table-column field="userID" label="Name of Game" width="40">
          Ear Training
        </b-table-column>

        <b-table-column
          field="date"
          label="Date"
          :th-attrs="dateThAttrs"
          :td-attrs="columnTdAttrs"
          centered
          v-slot="props"
        >
          <span class="tag is-success">
            {{ new Date(props.row.date).toLocaleDateString() }}
          </span>
        </b-table-column>

        <b-table-column
          field="gameMode"
          label="Game Mode"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.mode }}
        </b-table-column>
        <b-table-column
          field="difficulty"
          label="Difficulty"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.difficulty }}
        </b-table-column>

        <b-table-column
          field="score"
          label="Score"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.score }}%
        </b-table-column>

        <b-table-column
          field="correctNotes"
          label="Correct Answer"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          <div v-for="(elem, index) in props.row.questions" :key="index">
            {{ elem.Answer }}
          </div>
        </b-table-column>

        <b-table-column
          field="playerAnser"
          label="Player Answer"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          <div v-for="(elem, index) in props.row.questions" :key="index">
            {{ elem.Player_Answer }}
          </div>
        </b-table-column>
      </b-table>
    </div>
  </section>
</template>

<script>
import firebase from "firebase/compat/app";
import {
  // getFirestore,
  onSnapshot,
  collection,
  // doc,
  // setDoc,
  // addDoc,
  // orderBy,
  query,
  where,
} from "firebase/firestore";
import { ref } from "vue";
import { db } from "../main.js";
export default {
  data: function () {
    return {
      identityInfo: ref([]),
      buildInfo: ref([]),
      earInfo: ref([]),
      showIdentity: false,
      showBuild: false,
      showEar: false,
    };
  },

  mounted() {
    this.getIdentityData("IdentifyQuizzes");
    this.getBuildData("BuildQuizzes");
    this.getEarData("EarTrainingQuizzes");
    // this.getData("BuildQuizzes");
  },

  methods: {
    testMethod() {
      // let user = firebase.auth().currentUser.uid;
      // let temp = this.getData();
      // console.log("info ", temp);
      // console.log("identifyquestions ", this.identifyQuestions);
      console.log("userID", firebase.auth().currentUser.uid);
    },
    // https://stackoverflow.com/questions/70460935/read-collection-in-firebase-from-vue-js
    // https://stackoverflow.com/questions/47065982/how-to-query-one-field-then-order-by-another-one-in-firebase-cloud-firestore
    getIdentityData(collectionName) {
      let currentQuery = query(
        collection(db, collectionName),
        where("userID", "==", firebase.auth().currentUser.uid)
      );
      onSnapshot(currentQuery, (snapshot) => {
        this.identityInfo = snapshot.docs.map((doc) => {
          console.log("grabbingData from: ", collectionName);
          return doc.data();
        });
      });
    },
    getBuildData(collectionName) {
      let currentQuery = query(
        collection(db, collectionName),
        where("userID", "==", firebase.auth().currentUser.uid)
      );
      onSnapshot(currentQuery, (snapshot) => {
        this.buildInfo = snapshot.docs.map((doc) => {
          console.log("grabbingData from: ", collectionName);
          return doc.data();
        });
      });
    },
    getEarData(collectionName) {
      let currentQuery = query(
        collection(db, collectionName),
        where("userID", "==", firebase.auth().currentUser.uid)
      );
      onSnapshot(currentQuery, (snapshot) => {
        this.earInfo = snapshot.docs.map((doc) => {
          console.log("grabbingData from: ", collectionName);
          return doc.data();
        });
      });
    },
  },
};
</script>
