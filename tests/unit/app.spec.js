import { shallowMount } from "@vue/test-utils";
import App from "../../src/App.vue";
// https://stackoverflow.com/questions/66565117/tone-js-test-with-jest-error-referenceerror-audiobuffer-is-not-defined
jest.mock("tone", () => {
  return {
    start: jest.fn(),
    Sampler: jest.fn().mockImplementation(() => {
      return { toDestination: jest.fn() };
    }),
  };
});
jest.mock("firebase/compat/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

describe("App.vue", () => {
  it("Renders", () => {
    const wrapper = shallowMount(App, {
      data() {
        return {
          editors: [1],
          showHome: true,
          showAccountInfo: false,
          showIdentify: false,
          showBuild: false,
          showInterval: false,
          userLoggedIn: false,
          open: false,
          lightMode: true,
          showLogin: false,
          showRegister: false,
        };
      },
    });
    expect(wrapper.find("div")).toBe(true);
  });
});
