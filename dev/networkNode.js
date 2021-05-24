const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");

const dukatoni = new Blockchain();

//to prevent dashes - split everything and then rejoin
const nodeAddress = uuid().split("-").join("");

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

app.get("/mine", function (req, res) {
  //  to get a blockHash:
  //  1.get the previuous block hash
  //  2.get current block data
  //  3.generate correct nonce from proofOfWork method

  const lastBlock = dukatoni.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: dukatoni.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = dukatoni.proofOfWork(previousBlockHash, currentBlockData);

  //getting block hash
  const blockHash = dukatoni.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  //creating new block
  const newBlock = dukatoni.createNewBlock(nonce, previousBlockHash, blockHash);

  //response
  res.json({
    note: "New block mined successfully !",
    block: newBlock,
  });

  //everytime someone mines a new block, he gets reward for creating a new block
  // if sender has address '00' -> mining reward
  dukatoni.createNewTransaction(12.5, "00", nodeAddress);
});

app.listen(3000, function () {
  console.log("Listening on port 3000...");
});
