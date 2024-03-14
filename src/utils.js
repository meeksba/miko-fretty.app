import { Midi, Scale } from "tonal";

export function flatToSharp(scale) {
  let equivalent = {
    Ab: "G#",
    Bb: "A#",
    Cb: "B#",
    Db: "C#",
    Eb: "D#",
    Fb: "E#",
    Gb: "F#",
  };
  for (let i = 0; i < scale.length; i++) {
    if (scale[i] in equivalent) {
      scale[i] = equivalent[scale[i]];
    }
  }
  return scale;
}

export function toNameInterval(x, scaleTonic) {
  let name = Midi.midiToNoteName(x, {
    sharps: true, //all note names default to sharp
    pitchClass: true,
  });
  let chromaticScale = Scale.get(scaleTonic + " chromatic");
  let chromaticNotes = this.flatToSharp(chromaticScale.notes); //convert chrom scale to sharp to match note names
  var index = chromaticNotes.indexOf(name);
  if (index == -1) {
    if (name == "B") {
      return "5d"; //edge case
    }
    console.log("chromaticNotes: ", chromaticNotes);
    console.log("name: ", name);
    return "?";
  }
  return chromaticScale.intervals[index];
}

export function toName(x, notation, scaleNotes) {
  if (notation == "Intervals") {
    return toNameInterval(x);
  }
  let isSharp = true;
  if (scaleNotes.some((f) => f.includes("b"))) {
    isSharp = false; //if a flat is detected in the scale, set flag to false
  }
  let name = Midi.midiToNoteName(x, {
    sharps: isSharp, //if false (flat in scale), set notation to flat mode
    pitchClass: true,
  });
  return name;
}
