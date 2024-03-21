<template>
  <div>
    <b-table :data="data" :columns="columns"></b-table>
    <b-button @click="testMethod()"> Test </b-button>
  </div>
</template>

<script>
// import firebase from "firebase/compat/app";
import {
  // getFirestore,
  onSnapshot,
  collection,
  // doc,
  // setDoc,
  // addDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { ref } from "vue";
import { db } from "../main.js";
export default {
  data: function () {
    return {
      information: ref([]),
    };
  },

  mounted() {
    let temp = this.getData();
    console.log("data: ", temp)
  },

  methods: {
    testMethod() {
      // let user = firebase.auth().currentUser.uid;
      let temp = this.getData();
      console.log("info ", temp);
    },
    getData() {
      let currentQuery = query(
        collection(db, "IdentifyQuizzes"),
        orderBy("userID")
      );
      onSnapshot(currentQuery, (snapshot) => {
        this.information = snapshot.docs.map((doc) => {
          return doc.data();
        });
        console.log("info ", this.information);
      });
    },
  },
};
</script>
