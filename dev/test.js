const Blockchain = require("./blockchain");

const dukatoni = new Blockchain();

dukatoni.createNewBlock(789457, "OIUOEDJETH8754DHKD", "78SHNEG45DER56");
dukatoni.createNewTransaction(100, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9");
dukatoni.createNewBlock(548764, "AKMC875E6S1RS9", "WPLS214R7T6SJ3G2");

dukatoni.createNewTransaction(50, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9");
dukatoni.createNewTransaction(200, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9");
dukatoni.createNewTransaction(300, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9");

dukatoni.createNewBlock(548764, "AKMC875E6S1RS9", "WPLS214R7T6SJ3G2");
//testing createNewBlock method
console.log(dukatoni);
console.log("Array : ");
console.log(dukatoni.chain[2]);
