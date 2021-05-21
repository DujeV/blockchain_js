//main object of the blockchain

function Blockchain() {
  //storage of all the blocks that we mine
  this.chain = [];

  //storage of all the new transactions that are created before they are placed in block
  this.pendingTransactions = [];
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
//**Creating the createNewTransaction method
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
  };

  this.pendingTransactions.push(newTransaction);

  //which block we will be able to find the new transaction
  return this.getLastBlock()["index"] + 1;
};


//** ------------------------
//**Hashing the data
//** ------------------------

Blockchain.prototype.hashBlock = function (blockdata)) {

}
module.exports = Blockchain;
