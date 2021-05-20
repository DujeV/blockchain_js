const Blockchain = require("./blockchain");

const dukatoni = new Blockchain();

dukatoni.createNewBlock(420, "ASDFGHJKLY", "1q2w3e4r5t");
dukatoni.createNewTransaction(100, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9");

//testing createNewBlock method
console.log(dukatoni);
