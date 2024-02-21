import * as Tone from 'tone';


export const guitarSounds = new Tone.Sampler({
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
        'D#4': 'Ds3.[mp3|ogg]',
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
    'n5_0': 'E2',
    'n5_1': 'F2',
    'n5_2': 'F#1',
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

export function playNote(key){
    console.log("playnote key " + key)
    let note = fretNote[key]
    console.log("fretnote  " + note)
    Tone.start();
      guitarSounds.triggerAttackRelease([note] , 0.75);
}