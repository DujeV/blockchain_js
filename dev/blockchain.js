const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];
const { v1: uuid } = require("uuid");

//** ------------------------
//** Main object of the blockchain
//** ------------------------
function Blockchain() {
  //storage of all the blocks that we mine
  this.chain = [];

  //storage of all the new transactions that are created before they are placed in block
  this.pendingTransactions = [];

  //defining currentNodeUrl
  this.currentNodeUrl = currentNodeUrl;

  //all of the other nodes that are inside of our network
  this.networkNodes = [];

  //genesis block - first block that goes into chain array
  this.createNewBlock(100, "0", "0");
}

//** ------------------------
//** Method for creating new block and adding it to blockchain
//** ------------------------
Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockHash,
  hash
) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash,
  };

  //clearing newTransaction array
  this.pendingTransactions = [];

  //adding block to chain array
  this.chain.push(newBlock);

  return newBlock;
};

//** ------------------------
//**Getting the last block method
//** ------------------------
Blockchain.prototype.getLastBlock = function () {
  //indexing the last element of the array
  return this.chain[this.chain.length - 1];
};

//** ------------------------
//**Creating new transactions and broadcasting them
//** ------------------------
Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid().split("-").join(""),
  };

  return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransaction = function (
  transactionObj
) {
  this.pendingTransactions.push(transactionObj);

  //return the index of the block to which the transaction is added
  return this.getLastBlock()["index"] + 1;
};

//** ------------------------
//**Hashing the data of single block
//** ------------------------

Blockchain.prototype.hashBlock = function (
  previousBlockHash,
  currentBlockData,
  nonce
) {
  //previousBlockHash is already string, nonce is number, currentBlockData is object - array of transactions
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

  //creating hash
  const hash = sha256(dataAsString);
  return hash;
};

//** ------------------------
//**Proof of Work method - generating hash until we got hash that starts with '0000'
//** ------------------------

Blockchain.prototype.proofOfWork = function (
  previousBlockHash,
  currentBlockData
) {
  // setting nonce to 0 and generating first hash
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  //if generated hash doesn't start with '0000', increase nonce and generate hashBlock again
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    //console.log(nonce, "- Hash :", hash);
  }
  return nonce;
};

//** ------------------------
//** chainIsValidMethod
//validate the other chains inside of the network
//comparing them to the chain that is hosted on the current node.
//** ------------------------

Blockchain.prototype.chainIsValid = function (blockchain) {
  let validChain = true;
  for (var i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const prevBlock = blockchain[i - 1];

    //hashblock() method accepts parameters: previousBlockhash, currentBlockData and the nonce
    const blockHash = this.hashBlock(
      prevBlock["hash"],
      {
        transactions: currentBlock["transactions"],
        index: currentBlock["index"],
      },
      currentBlock["nonce"]
    );

    if (currentBlock["previousBlockHash"] !== prevBlock["hash"])
      validChain = false;

    if (blockHash.substring(0, 4) !== "0000") validChain = false;

    //console.log("previousBlockHash =>", prevBlock["hash"]);
    //console.log("currentBlockHash =>", currentBlock["hash"]);
  }

  //first block in blockchain
  const genesisBlock = blockchain[0];
  const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
  const correctHash = genesisBlock["hash"] === "0";
  const correctNonce = genesisBlock["nonce"] === 100;

  const correctTransactions = genesisBlock["transactions"].length === 0;

  if (
    !correctPreviousBlockHash ||
    !correctHash ||
    !correctNonce ||
    !correctTransactions
  )
    validChain = false;

  return validChain;
};

//** ------------------------
//** Block explorer methods
//** ------------------------
Blockchain.prototype.getBlock = function (blockHash) {
  let correctBlock = null;
  this.chain.forEach((block) => {
    if (block.hash === blockHash) correctBlock = block;
  });
  return correctBlock;
};

Blockchain.prototype.getTransaction = function (transactionId) {
  let correctTransaction = null;
  let correctBlock = null;

  this.chain.forEach((block) => {
    block.transactions.forEach((transaction) => {
      if (transaction.transactionId === transactionId) {
        correctTransaction = transaction;
        correctBlock = block;
      }
    });
  });

  return {
    transaction: correctTransaction,
    block: correctBlock,
  };
};

module.exports = Blockchain;
