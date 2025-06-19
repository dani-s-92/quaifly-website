import dotenv from "dotenv";
dotenv.config();
import BlackjackABI from "../../ContractInfo/blackjackABI.json" with { type: "json" };

const BlackjackContractAdress = process.env.CONTRACT_ADDRESS || "";

export { BlackjackContractAdress, BlackjackABI };