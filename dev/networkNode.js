const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");

const dukatoni = new Blockchain();

// if a request comes in with JSON data or with form data, parse that data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//** ------------------------
//** There will be 3 endpoints in API
//  1. /blockchain -> fetch entire blockchain structure
//  2. /transactions -> creating a new transaction
//  3. /mine -> mining new block by using proofOfWork method
//** ------------------------

app.get("/blockchain", function (req, res) {
  res.send(dukatoni);
});

app.post("/transaction", function (req, res) {
  const blockIndex = dukatoni.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get("/mine", function (req, res) {});

app.listen(3000, function () {
  console.log("Listening on port 3000...");
});
