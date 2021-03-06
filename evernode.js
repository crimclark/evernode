#!/usr/bin/env node

const Evernote = require('evernote');
process.stdin.setEncoding('utf8');

let input = '';

process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data.
  while ((chunk = process.stdin.read()) !== null) {
    input += chunk;
  }
});

process.stdin.on('end', createNote);

function createNote() {
  const token = process.env.EVERNOTE_DEVELOPER_TOKEN; 
  const client = new Evernote.Client({
    token,
    sandbox: false,
  });

  const noteStore = client.getNoteStore();
  input = input.replace(/(?:\r\n|\r|\n)/g, '<br/>');

  let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
    nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
    nBody += `<en-note>${input}</en-note>`;

  const testNote = new Evernote.Types.Note();
 
  testNote.title = 'untitled';

  if (process.argv && process.argv[2]) {
    testNote.title = process.argv[2]; 
  }

  testNote.content = nBody; 

  noteStore.createNote(testNote)
    .then(data => console.log(`Uploaded note ${data.title} to Evernote`))
    .catch(console.error)
}
