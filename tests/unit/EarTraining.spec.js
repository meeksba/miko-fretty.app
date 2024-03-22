import { shallowMount } from "@vue/test-utils";
import EarTraining from '../../src/Views/EarTraining.vue';

// https://stackoverflow.com/questions/66565117/tone-js-test-with-jest-error-referenceerror-audiobuffer-is-not-defined
jest.mock("tone", () => {
  return {
    start: jest.fn(),
    Sampler: jest.fn().mockImplementation(() => {
      return { toDestination: jest.fn() };
    }),
  };
});
describe("EarTraining.vue", () => {
  it("Renders", () => {
    const wrapper = shallowMount(EarTraining);
    expect(wrapper.exists()).toBe(true);
  });
});