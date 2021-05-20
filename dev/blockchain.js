//main object of the blockchain

function Blockchain() {
  //storage of all the blocks that we mine
  this.chain = [];

  //storage of all the new transactions that are created before they are placed in block
  this.newTransactions = [];
}

//method for creating new block and adding it to blockchain
Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockHash,
  hash
) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.transactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash,
  };

  //clearing newTransaction array
  this.newTransactions = [];

  //adding block to chain array
  this.chain.push(newBlock);

  return newBlock;
};

module.exports = Blockchain;
