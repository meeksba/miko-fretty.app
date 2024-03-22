<template>
  <section>
    <b-button @click="testMethod()">testaccountpage </b-button>
    <b-table :data="information" striped label="Identify Scale Game">
      <b-table-column field="userID" label="Name of Game" width="40">
        Identify Scale Game
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
          {{ new Date(props.row.date).toLocaleString() }}
        </span>
      </b-table-column>
      <b-table-column
        field="mode"
        label="Mode"
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
        field="tuning"
        label="Tuning"
        :td-attrs="columnTdAttrs"
        v-slot="props"
      >
        {{ props.row.tuning }}
      </b-table-column>
      <b-table-column
        field="score"
        label="Score"
        :td-attrs="columnTdAttrs"
        numeric
        v-slot="props"
      >
        {{ props.row.score }}
      </b-table-column>

      <b-table-column
        field="questions"
        label="Questions"
        :td-attrs="columnTdAttrs"
        centered
        v-slot="props"
      >
        <div v-for="(info, index) in props.row.questions" :key="index">
          Correct Answer: {{ info.Answer }} | Player Answer:
          {{ info.Player_Answer }} <br />
        </div>
      </b-table-column>
    </b-table>
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
      information: ref([]),
      identifyQuestions: [],
      columns: [
        { field: "userID", label: "User ID" },
        { field: "date", label: "Date" },
        { field: "mode", label: "Mode" },
        { field: "difficulty", label: "Difficulty" },
        { field: "tuning", label: "Tuning" },
        { field: "score", label: "Score" },
        { field: "Answer", label: "Answer" },
        { field: "Player_Answer", label: "Player Answer" },
      ],
    };
  },

  mounted() {
    let temp = this.getData();
    console.log("data: ", temp);
  },

  methods: {
    testMethod() {
      // let user = firebase.auth().currentUser.uid;
      // let temp = this.getData();
      // console.log("info ", temp);
      // console.log("identifyquestions ", this.identifyQuestions);
      console.log("userID", firebase.auth().currentUser.uid);
    },
    getData() {
      let currentQuery = query(
        collection(db, "IdentifyQuizzes"),
        where("userID", "==", firebase.auth().currentUser.uid)
      );
      onSnapshot(currentQuery, (snapshot) => {
        this.information = snapshot.docs.map((doc) => {
          this.identifyQuestions.push({
            Answer: doc.data().Answer,
            Player_Answer: doc.data().Player_Answer,
          });
          return doc.data();
        });
      });
    },
  },
};
</script>
