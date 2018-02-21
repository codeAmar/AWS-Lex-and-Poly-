require('dotenv').config();

const AWS = require('aws-sdk');
const fs = require('fs');
const polly = new AWS.Polly();


// displaying all the voices and languages polly supports.
polly.describeVoices((err, data) => {
    if (err) {
        console.error('error while describing voices', err);
    } else {
        console.log(data);
    }
});


// convert text into speech
polly.synthesizeSpeech({
    "LexiconNames": [ "Periodic" ],
    "OutputFormat": "mp3",
    "Text": "Hello, Residents of BC",
    "TextType": "text",
    "VoiceId": "Joanna"
}, (err, data) => {
    if (err) {
        console.log('error occured inside the synthesize callback', err);
    } else {
        console.log(data);
        fs.writeFileSync('sample_audio/1.mp3', data.AudioStream, (err) => {
            if (err) {
                console.log('error occured while creating a writestream for audio file', err);
            }
        });
    }
});


// list all the lexicon related to particular region
polly.listLexicons((err, data) => {
    if (err) {
        console.error('cannot list lexicons ', err);
    } else {
        console.log(data);
    }
});


// Upload the Province lexicon to AWS
polly.putLexicon({
    Content: fs.readFileSync('lexicon.xml', 'utf8', (err,data) => {
        if (err) {
            console.error('error in reading filestream', err);
        } else {
            return JSON.stringify(data);
        }
    }),
Name: 'Periodic'
}, (err, data) => {
if (err) {
    console.log('error occured while putting lexicon ', err);
} else {
    console.log(data);
}
});