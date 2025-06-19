require("dotenv").config(); // Load environment variables

const {
  BlackjackContractAdress,
  BlackjackABI,
} = require("./app/blackjack/BlackjackContractInformation.ts");

console.log("Blackjack Contract Address:", BlackjackContractAdress);
console.log("Blackjack Contract Address:", BlackjackABI);
