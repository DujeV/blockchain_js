const Blockchain = require("./blockchain");

const dukatoni = new Blockchain();

const previousBlockHash = "87765DA6CCF0668238C1D27C35692E11";
const currentBlockData = [
  {
    amount: 10,
    sender: "B4CEE9C0E5CD571",
    recipient: "3A3F6E462D48E9",
  },
  {
    amount: 20,
    sender: "BHFZS620DHZE613",
    recipient: "MNDGHSJFZ673GDT5",
  },
  {
    amount: 30,
    sender: "H7D9FH3TDH6AK08",
    recipient: "ZBCG25SKDB763MQ",
  },
];

let nonce = 7664;
//console.log(dukatoni.proofOfWork(previousBlockHash, currentBlockData));

console.log(dukatoni.hashBlock(previousBlockHash, currentBlockData, nonce));
