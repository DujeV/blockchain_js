var express = require("express");
var app = express();

//** ------------------------
//** There will be 3 endpoints in API
//  1. /blockchain -> fetch entire blockchain structure
//  2. /transactions -> creating a new transaction
//  3. /mine -> mining new block by using proofOfWork method
//** ------------------------

app.get("/blockchain", function (req, res) {});

app.post("/transaction", function (req, res) {});

app.get("/mine", function (req, res) {});

app.listen(3000, function () {
  console.log("Listening on port 3000...");
});
