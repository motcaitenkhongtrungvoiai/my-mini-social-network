const express= require('express');
const app = express();

app.listen(2000,() =>{
    console.log("connect in 2000");
})


var PSD = require('psd');


// You can also use promises syntax for opening and parsing
PSD.open("../asscet/iyhga.psd").then(function (psd) {
  return psd.image.saveAsPng('../asscet/output.png');
}).then(function () {
  console.log("Finished!");
});