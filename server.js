const express = require('express');
const notes = require('./db/db.json');
const uuid = require('./db/helpers/uuid');
const { readFromFile, writeToFile, readAndAppend } = require('./db/helpers/utils');
const fs = require('fs');


//code to set up express
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//listening to port
app.listen(PORT, ()=>{
    console.log("listening on port 3001")
});

//get route for the notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// get route that returns JSON stored in db.json
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data)=> res.json(JSON.parse(data)));
  });

// post method that appends new note to db.json
  app.post('/api/notes', (req, res) => {
    
    console.info(`${req.method} request received to add a review`);
  
    
    const { title, text } = req.body;
  
    
    if (title && text) {
      
      const newNote = {
        title,
        text,
        review_id: uuid(),
      };

    readAndAppend(newNote, './db/db.json');
        
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });

  //get route to return index.html if notes or api/notes is not specified
  app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);