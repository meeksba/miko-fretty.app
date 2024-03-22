import { shallowMount } from "@vue/test-utils";
import Fretboard from "../../src/components/Fretboard";
describe("Fretboard.vue", () => {
  it("Renders", () => {
    const wrapper = shallowMount(Fretboard, {
      propsData: {
        tuning: ["E", "A", "D", "G", "B", "E"],
        notes: [5, 5],
        root: 5,
        scale: { tonic: "A", notes: ["A"] },
        notation: "sharp",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
