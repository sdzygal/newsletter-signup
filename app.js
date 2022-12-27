const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
res.sendFile(__dirname + '/index.html');
});

app.post("/", function (req, res) {
        const firstName = req.body.fName;
        const lastName = req.body.lName;
        const email = req.body.email;

        const data = { 
            members: [
                {
                        email_address: email, 
                        status: "subscribed",
                        merge_fields: {
                              FNAME: firstName,
                              LNAME: lastName  
                        }
                }
            ]
        };

// Mailchimp API
        const jsonData = JSON.stringify(data);
        const url = "https://us10.api.mailchimp.com/3.0/lists/d44ddd3d4d";
        const options = {
                        method: "POST",
                        auth: "alex1:cd4fb9f379637a3408f9b51a8c68ec09-us10"
                }
        
        const request = https.request(url, options, function(response) {

              if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
              } else {
                res.sendFile(__dirname + "/failure.html");
              }
               response.on("data", function(data) {
                        console.log(JSON.parse(data));
               });
        });

        request.write(jsonData);
        request.end();

});

app.post("/failure", function(req, res) {
       res.redirect("/");
});


app.listen(3000, function () {

console.log(`Example app listening on 3000 port!`)
});
