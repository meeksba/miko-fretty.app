<template>
  <div>
    <b-field label="Tuning">
      <b-autocomplete
        v-model="usr_tuning"
        :data="tuning_search"
        @select="(option) => (selected = option.name)"
        group-field="instrument"
        group-options="tunings"
        open-on-focus
        clearable
        field="tuning"
        icon="guitar"
        style="min-width: 100px"
        @input="saveSettings"
        @click.stop
      >
        <template slot-scope="props">
          <div style="display: flex">
            <div style="flex: 1 1 0px">{{ props.option.name }}</div>
            <div style="flex: 1 1 0px">{{ props.option.tuning }}</div>
          </div>
        </template>
      </b-autocomplete>
    </b-field>
  </div>
</template>

<script>
// import NoteSelect from "./NoteSelect.vue";
import { Note, ScaleType } from "@tonaljs/tonal";
import { Tunings } from "../tunings.js";

var ALL_SCALES = [];
for (var scale of ScaleType.all()) {
  ALL_SCALES.push(scale.name);
  ALL_SCALES.push(...scale.aliases);
}

export default {
  name: "TuningSelection",

  props: {},
  components: {},

  data: function () {
    return {
      usr_tuning: localStorage.getItem("identifyTuning") || "E A D G B E",
    };
  },

  computed: {
    tuning: function () {
      if (!this.usr_tuning) return [];
      return this.usr_tuning.trim().split(" ").map(Note.chroma).reverse();
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
    // saveSettings() {
    //   localStorage.setItem("identifyTuning", this.usr_tuning);
    // },
    saveSettings() {
      this.$emit("tuningChange", this.usr_tuning);
    },
    scale_input(x) {
      if (x == "") {
        return;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
