const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

require('dotenv').config({ path: 'vars1/.env' });
const MAPI_KEY = process.env.API_KEY;
const MLIST_ID = process.env.LIST_ID;
const MAPI_SERVER = process.env.API_SERVER;
console.log("KEY=" + MAPI_KEY +"AUD LIST="+MLIST_ID+" MAPI SERVER= "+MAPI_SERVER);
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log("First name is " + req.body.firstName + " Last name is " + req.body.lastName + " and the email is " + req.body.email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID;
    const options = {
        method: "POST",
        auth: "noamkey:" + MAPI_KEY
    };

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            const APIresponseData = JSON.parse(data);
            if (response.statusCode === 200 && APIresponseData.errors.length === 0) {
                res.sendFile(__dirname + "/success.html");

            } else {
                res.sendFile(__dirname + "/failure.html");

            }
        })
    })

    request.write(jsonData);

    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000")
});

