const express = require("express");
const app = express();
const fs = require('fs');
const cors = require("cors");
const directoryPath = '/matthackin-on-demand/public/assets/pdf' // Put your PDFs in here

app.use(cors());

app.get("/pdfs", async (req, res, next) => {
  const fileNames = [];
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        fileNames.push(file);
    });
    res.json(fileNames);
  });
 });

app.listen(4201, () => {
 console.log("Server running on port 4201");
});