// import {Sampler, start, Tone} from 'tone';
/* eslint-disable */
// https://tonejs.github.io

// https://github.com/nbrosowsky/tonejs-instruments?tab=readme-ov-file
// Sounds from above
import { Sampler, start, Transport, Sequence }from 'tone';
import { Chord } from 'tonal';

export const guitarSounds = new Sampler({
	urls: {
        'F4': 'F4.[mp3|ogg]',
        'F#2': 'Fs2.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        'G2': 'G2.[mp3|ogg]',
        'G3': 'G3.[mp3|ogg]',
        'G4': 'G4.[mp3|ogg]',
        'G#2': 'Gs2.[mp3|ogg]',
        'G#3': 'Gs3.[mp3|ogg]',
        'G#4': 'Gs4.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A#2': 'As2.[mp3|ogg]',
        'A#3': 'As3.[mp3|ogg]',
        'A#4': 'As4.[mp3|ogg]',
        'B2': 'B2.[mp3|ogg]',
        'B3': 'B3.[mp3|ogg]',
        'B4': 'B4.[mp3|ogg]',
        'C3': 'C3.[mp3|ogg]',
        'C4': 'C4.[mp3|ogg]',
        'C5': 'C5.[mp3|ogg]',
        'C#3': 'Cs3.[mp3|ogg]',
        'C#4': 'Cs4.[mp3|ogg]',
        'C#5': 'Cs5.[mp3|ogg]',
        'D2': 'D2.[mp3|ogg]',
        'D3': 'D3.[mp3|ogg]',
        'D4': 'D4.[mp3|ogg]',
        'D5': 'D5.[mp3|ogg]',
        'D#2': 'Ds2.[mp3|ogg]',
        'D#3': 'Ds3.[mp3|ogg]',
        'D#4': 'Ds4.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'F2': 'F2.[mp3|ogg]',
        'F3': 'F3.[mp3|ogg]'
	},
	baseUrl: "/samples/guitar-acoustic/",

}).toDestination();

//maps frets to their note 
const fretNote = {

    'n0_0': 'E4',
    'n0_1': 'F4',
    'n0_2': 'F#4',
    'n0_3': 'G4',
    'n0_4': 'G#4',
    'n0_5': 'A4',
    'n0_6': 'A#4',
    'n0_7': 'B4',
    'n0_8': 'C5',
    'n0_9': 'C#5', // n0 = High E String
    'n0_10': 'D5',
    'n0_11': 'D#5',
    'n0_12': 'E5',
    'n0_13': 'F5',
    'n0_14': 'F#5',
    'n0_15': 'G5',
    'n0_16': 'G#5',
    'n0_17': 'A5',
    'n0_18': 'A#5',


    'n1_0': 'B3',
    'n1_1': 'C4',
    'n1_2': 'C#4',
    'n1_3': 'D4',
    'n1_4': 'D#4',
    'n1_5': 'E4',
    'n1_6': 'F4',
    'n1_7': 'F#4',
    'n1_8': 'G4',
    'n1_9': 'G#4',  //n1 = b String
    'n1_10': 'A4',
    'n1_11': 'A#4',
    'n1_12': 'B4',
    'n1_13': 'C5',
    'n1_14': 'C#5',
    'n1_15': 'D5',
    'n1_16': 'D#5',
    'n1_17': 'E5',
    'n1_18': 'F5',

    'n2_0': 'G3',
    'n2_1': 'G#3',
    'n2_2': 'A3',
    'n2_3': 'A#3',
    'n2_4': 'B3',
    'n2_5': 'C4',
    'n2_6': 'C#4',
    'n2_7': 'D4',
    'n2_8': 'D#4',
    'n2_9': 'E4',  //n2 = G String
    'n2_10': 'F4',
    'n2_11': 'F#4',
    'n2_12': 'G4',
    'n2_13': 'G#4',
    'n2_14': 'A4',
    'n2_15': 'A#4',
    'n2_16': 'B4',
    'n2_17': 'C5',
    'n2_18': 'C#5',

    'n3_0': 'D3',
    'n3_1': 'D#3',
    'n3_2': 'E3',
    'n3_3': 'F3',
    'n3_4': 'F#3',
    'n3_5': 'G3',
    'n3_6': 'G#3',
    'n3_7': 'A3',
    'n3_8': 'A#3',
    'n3_9': 'B3',  //n3 = D string
    'n3_10': 'C4',
    'n3_11': 'C#4',
    'n3_12': 'D4',
    'n3_13': 'D#4',
    'n3_14': 'E4',
    'n3_15': 'F4',
    'n3_16': 'F#4',
    'n3_17': 'G4',
    'n3_18': 'G#4',

    'n4_0': 'A2',
    'n4_1': 'A#2',
    'n4_2': 'B2',
    'n4_3': 'C3',
    'n4_4': 'C#3',
    'n4_5': 'D3',
    'n4_6': 'D#3',
    'n4_7': 'E3',
    'n4_8': 'F3',
    'n4_9': 'F#3', //n4 = A string
    'n4_10': 'G3',
    'n4_11': 'G#3',
    'n4_12': 'A3',
    'n4_13': 'A#3',
    'n4_14': 'B3',
    'n4_15': 'C4',
    'n4_16': 'C#4',
    'n4_17': 'D4',
    'n4_18': 'D#4',

    'n5_0': 'E2',
    'n5_1': 'F2',
    'n5_2': 'F#2',
    'n5_3': 'G2',
    'n5_4': 'G#2',
    'n5_5': 'A2',
    'n5_6': 'A#2',
    'n5_7': 'B2',
    'n5_8': 'C3',
    'n5_9': 'C#3', //n5 = low E String
    'n5_10': 'D3',
    'n5_11': 'D#3',
    'n5_12': 'E3',
    'n5_13': 'F3',
    'n5_14': 'F#3',
    'n5_15': 'G3',
    'n5_16': 'G#3',
    'n5_17': 'A3',
    'n5_18': 'A#3',
}

//Converts Scale to all sharp notation for further use (sound)
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

export function playNote(key){
    let note = fretNote[key]
    start();
    guitarSounds.triggerAttackRelease([note] , 0.75);
}
export function playNoteByName(name){
    start();
    guitarSounds.triggerAttackRelease(name , 0.75);
}

export function playChord(type, root){
    let chord = Chord.notes(type, root + "3");
    chord.push(root + "4");  //Add octave to make fuller sound
    console.log("chord ",chord)
    start();
    guitarSounds.triggerAttackRelease(chord,1)

}

export function playChordIndividually(type, root){
    let chord = Chord.notes(type, root + "3");
    chord.push(root + "4");  //Add octave to make fuller sound
    start();
    let index = 0;
    const seq = new Sequence((time, note) => {
	    playNoteByName(note);
        index++
        if(index == chord.length){
            seq.stop();
            Transport.stop();
        }
        }, chord,'4n').start(0);
        Transport.start();
}

export function playInterval(notes){
    start()
    let index = 0;
    const seq = new Sequence((time, note) => {
	    playNoteByName(note);
        index++
        if(index == notes.length){
            seq.stop();
            Transport.stop();
        }
        }, notes,'4n').start(0);
        Transport.start();
}

export function playScale(scale){
    start()
    let index = 0
    const seq = new Sequence((time, note) => {
	    playNoteByName(note);
        index++
        if(index == scale.length){
            seq.stop();
            Transport.stop();
        }
        }, scale,'4n').start(0);
        Transport.start();
}
