const express = require("express");
const app = express();

app.use(express.static('src'))
app.use(express.static('../token-contract/build/contracts'))


app.get("/" , function(req , res){

    res.sendFile( __dirname + "/index.html");
})


app.listen(3000 , function(){
    console.log("Server is runing on port 3000!");
})