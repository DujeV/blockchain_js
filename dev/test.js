const Blockchain = require("./blockchain");

const dukatoni = new Blockchain();

//console.log(dukatoni);

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1623067883167,
      transactions: [],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0",
    },
    {
      index: 2,
      timestamp: 1623068721242,
      transactions: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0",
    },
    {
      index: 3,
      timestamp: 1623068787625,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "79bae2f0c78911ebb40f13413dfa11bd",
          transactionId: "6d4bfc50c78b11ebb40f13413dfa11bd",
        },
        {
          amount: 11,
          sender: "NNFANSDFHYHTN90A09SNFAS",
          recipient: "IUW0990A90WENNU234UFAW",
          transactionId: "86c178e0c78b11ebb40f13413dfa11bd",
        },
        {
          amount: 22,
          sender: "NNFANSDFHYHTN90A09SNFAS",
          recipient: "IUW0990A90WENNU234UFAW",
          transactionId: "8c56ea60c78b11ebb40f13413dfa11bd",
        },
        {
          amount: 33,
          sender: "NNFANSDFHYHTN90A09SNFAS",
          recipient: "IUW0990A90WENNU234UFAW",
          transactionId: "8dc40ef0c78b11ebb40f13413dfa11bd",
        },
        {
          amount: 33,
          sender: "NNFANSDFHYHTN90A09SNFAS",
          recipient: "IUW0990A90WENNU234UFAW",
          transactionId: "8ddbdcb0c78b11ebb40f13413dfa11bd",
        },
      ],
      nonce: 48536,
      hash: "00004a241523454d720eeae442904533fc08fd9dd7610a2a5c83319037a7759d",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 4,
      timestamp: 1623068857986,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "79bae2f0c78911ebb40f13413dfa11bd",
          transactionId: "94d4fce0c78b11ebb40f13413dfa11bd",
        },
        {
          amount: 111,
          sender: "NNFANSDFHYHTN90A09SNFAS",
          recipient: "IUW0990A90WENNU234UFAW",
          transactionId: "b7af4270c78b11ebb40f13413dfa11bd",
        },
        {
          amount: 222,
          sender: "NNFANSDFHYHTN90A09SNFAS",
          recipient: "IUW0990A90WENNU234UFAW",
          transactionId: "b91ae060c78b11ebb40f13413dfa11bd",
        },
        {
          amount: 333,
          sender: "NNFANSDFHYHTN90A09SNFAS",
          recipient: "IUW0990A90WENNU234UFAW",
          transactionId: "bab02660c78b11ebb40f13413dfa11bd",
        },
      ],
      nonce: 16546,
      hash: "00002db6dc834a528da0f407974807519d5fbdfcebbb99911fe4420f0a70e612",
      previousBlockHash:
        "00004a241523454d720eeae442904533fc08fd9dd7610a2a5c83319037a7759d",
    },
    {
      index: 5,
      timestamp: 1623068891954,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "79bae2f0c78911ebb40f13413dfa11bd",
          transactionId: "bec51260c78b11ebb40f13413dfa11bd",
        },
      ],
      nonce: 26077,
      hash: "00000232a3aac2c906232f5d3d5d0f6717e350df71a4a01924983f9a584b6b77",
      previousBlockHash:
        "00002db6dc834a528da0f407974807519d5fbdfcebbb99911fe4420f0a70e612",
    },
    {
      index: 6,
      timestamp: 1623068894002,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "79bae2f0c78911ebb40f13413dfa11bd",
          transactionId: "d3042d60c78b11ebb40f13413dfa11bd",
        },
      ],
      nonce: 16479,
      hash: "00002b614756ee8b249d0262b9d41edffa2c20acde68842e63f053aebde12328",
      previousBlockHash:
        "00000232a3aac2c906232f5d3d5d0f6717e350df71a4a01924983f9a584b6b77",
    },
  ],
};

console.log("VALID: ", dukatoni.chainIsValid(bc1.chain));
