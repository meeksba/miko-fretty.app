<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Login</p>
        <button type="button" class="delete" @click="$emit('close')"></button>
      </header>
      <section class="modal-card-body">
        <b-field label="Email">
          <b-input
            type="email"
            v-model="email"
            placeholder="Your email"
            required
          ></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Your password"
            required
          ></b-input>
        </b-field>

        <!-- <b-checkbox>Remember me</b-checkbox> -->
      </section>
      <footer class="modal-card-foot">
        <b-button label="Login" @click="login()" type="is-primary" />
      </footer>
    </div>
  </form>
</template>
<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default {
  name: "LoginForm",
  components: {},
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$buefy.dialog.alert({
            title: "Success",
            message: "Successfully Logged In!",
            type: "is-success",
            confirmText: "Ok",
          });
          this.$emit("close");
          this.$router.push("/");
        })
        .catch((error) => {
          this.$buefy.dialog.alert({
            title: "Error",
            message: error.message,
            type: "is-danger",
            confirmText: "Ok",
          });
        });
    },
  },
};
</script>
