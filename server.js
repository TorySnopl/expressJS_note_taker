const express = require('express');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const uuid = uuid();

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


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(notes);
  });


  app.post('/api/notes', (req, res) => {
    
    console.info(`${req.method} request received to add a review`);
  
    
    const { title, text } = req.body;
  
    
    if (title && text) {
      
      const newReview = {
        title,
        text,
        review_id: uuid(),
      };
  
     
      const reviewString = JSON.stringify(newReview);
  
      
      fs.appendFile(`./db/db.json`, reviewString, (err) =>
        err
          ? console.error(err)
          : console.log(
              `Review for ${newReview} has been written to JSON file`
            )
      );
  
      const response = {
        status: 'success',
        body: newReview,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });