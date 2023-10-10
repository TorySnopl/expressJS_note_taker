const express = require('express');
const notes = require('./db/db.json');
const uuid = require('./db/helpers/uuid');
const fs = require('fs');


//
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, ()=>{
    console.log("listening on port 3001")
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.get('./public/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(notes);
  });


  app.post('/api/notes', (req, res) => {
    
    console.info(`${req.method} request received to add a review`);
  
    
    const { title, text } = req.body;
  
    
    if (title && text) {
      
      const newNote = {
        title,
        text,
        review_id: uuid(),
      };
  
     
      const noteString = JSON.stringify(newNote);
  
      
      fs.appendFile(`./db/db.json`, noteString, (err) =>
        err
          ? console.error(err)
          : console.log(
              `Review for ${newNote} has been written to JSON file`
            )
      );
  
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