const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v1: uuid } = require("uuid");
const rp = require("request-promise");

const dukatoni = new Blockchain();

//to prevent dashes - split everything and then rejoin
const nodeAddress = uuid().split("-").join("");

// if a request comes in with JSON data or with form data, parse that data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// different ports value to create decentralized network
const port = process.argv[2];

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
  const newTransaction = req.body;
  const blockIndex =
    dukatoni.addTransactionToPendingTransaction(newTransaction);

  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

//** ------------------------
//*! Create transaction and broadcast it
//** ------------------------

app.post("/transaction/broadcast", function (req, res) {
  const newTransaction = dukatoni.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  dukatoni.addTransactionToPendingTransaction(newTransaction);

  const requestPromises = [];

  dukatoni.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcast successfully" });
  });
});

//** ------------------------
//*! Mine block and broadcast it
//** ------------------------

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

  const requestPromises = [];
  dukatoni.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  //everytime someone mines a new block, he gets reward for creating a new block
  // if sender has address '00' -> mining reward
  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: dukatoni.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress,
        },
        json: true,
      };

      return rp(requestOptions);
    })
    .then((data) => {
      res.json({
        note: "New block mined & broadcast successfully",
        block: newBlock,
      });
    });
});

app.post("/receive-new-block", function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = dukatoni.getLastBlock();

  //check if the hash of the last block in the chain is equal to previousBlockHash in newBlock instance
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;

  //check if the newBlock has correct index -> one index above lastBlock index
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    dukatoni.chain.push(newBlock);
    dukatoni.pendingTransactions = [];

    res.json({
      note: "New block received and accepted",
      newBlock: newBlock,
    });
  } else {
    res.json({
      note: "New block rejected.",
      newBlock: newBlock,
    });
  }
});

//** ------------------------
//*! BUILDING DECENTRALIZED NETWORK
//** ------------------------
//** ------------------------
//** Register a node (on its own server) and broadcast it to whole newtwork
//** ------------------------

app.post("/register-and-broadcast-node", function (req, res) {
  // passing the URL of the node we want to register on the req body
  const newNodeUrl = req.body.newNodeUrl;

  if (dukatoni.networkNodes.indexOf(newNodeUrl) == -1)
    dukatoni.networkNodes.push(newNodeUrl);

  //broadcasting newNodeUrl to the rest of the nodes in network
  const regNodesPromises = [];
  dukatoni.networkNodes.forEach((networkNodeUrl) => {
    //options that are used for each request
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };
    regNodesPromises.push(rp(requestOptions));
  });

  //register all of the network nodes that are already present inside of network with new node.
  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...dukatoni.networkNodes, dukatoni.currentNodeUrl],
        },
        json: true,
      };

      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "New Node registered with network successfully" });
    });
});

//** ------------------------
//** Register a node with a network
// accepting the new node
//** ------------------------

app.post("/register-node", function (req, res) {
  //using the value of newNodeUrl that is sent to req.body
  const newNodeUrl = req.body.newNodeUrl;

  //is the newNodeUrl actually the URL of the current node that we're on
  const notCurrentNode = dukatoni.currentNodeUrl !== newNodeUrl;

  //true or false
  const nodeNotAlreadyPresent = dukatoni.networkNodes.indexOf(newNodeUrl) == -1;

  if (nodeNotAlreadyPresent && notCurrentNode)
    dukatoni.networkNodes.push(newNodeUrl);
  res.json({ note: "New node registered successfully. " });
});

//** ------------------------
//** Register multiple nodes at once
//** ------------------------

app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    //true or false
    const nodeNotAlreadyPresent =
      dukatoni.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = dukatoni.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      dukatoni.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: "Bulk registration successful." });
});

//** ------------------------
//*! Consensus algorithm -> compare one node to all the other nodes inside of the network
//** ------------------------

app.get("/consensus", function (rreq, res) {
  const requestPromises = [];
  dukatoni.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = dukatoni.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    //if there is no newLongestChain meaning
    //and if there is a new longest chain but that new chain is not valid
    // then the current chain is the longest
    if (
      !newLongestChain ||
      (newLongestChain && !dukatoni.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced",
        chain: dukatoni.chain,
      });
    }
    //otherwise replace current chain with the longest one
    else {
      dukatoni.chain = newLongestChain;
      dukatoni.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced",
        chain: dukatoni.chain,
      });
    }
  });
});

//** ------------------------
//*! Block explorer endpoints
//** ------------------------

app.get("/block/:blockHash", function (req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = dukatoni.getBlock(blockHash);
  res.json({
    block: correctBlock,
  });
});

app.get("/transaction/:transactionId", function (req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = dukatoni.getTransaction(transactionId);
  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block,
  });
});

app.get("/address/:address", function (req, res) {
  const address = req.params.address;
  const addressData = dukatoni.getAddressData(address);
  res.json({
    addressData: addressData,
  });
});

app.get("/block-explorer", function (req, res) {
  res.sendFile("./block-explorer/index.html", { root: __dirname });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
