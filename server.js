const express = require('express');
const {connectDB} = require("./config/db");
const path = require('path');
const { homedir } = require('os');


const app = express();

const PORT = process.env.PORT || 2000;

// Cors 
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
    // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
  }
  
  // Default configuration looks like
  // {
  //     "origin": "*",
  //     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  //     "preflightContinue": false,
  //     "optionsSuccessStatus": 204
  //   }
  
  app.use(cors(corsOptions));

//middlewares
app.use(express.static('Public'));
app.use(express.json());

//templates
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//routes
app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname,'/index.html'));
})
app.use('/api/files', require('./routes/fileRoute'));
app.use('/files', require('./routes/showRoute'));
app.use('/files/download', require('./routes/downloadRoute'));

app.listen(PORT, () =>{
          console.log(`Listening on Port ${PORT}`)
})

connectDB();