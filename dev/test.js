const Blockchain = require("./blockchain");

const dukatoni = new Blockchain();

dukatoni.createNewBlock(420, "ASDFGHJKLY", "1q2w3e4r5t");
dukatoni.createNewBlock(520, "QWERTZUIOP", "0o9i8u7z6t");
dukatoni.createNewBlock(620, "YXCVBNMASD", "1234567891");
console.log(dukatoni);

//testing createNewBlock method
console.log(dukatoni);

//testing getLastBlock method
console.log("This is the last element of the blockchain");
console.log(dukatoni.getLastBlock());
