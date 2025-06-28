import dotenv from "dotenv";
dotenv.config();
import BlackjackABI from "../../ContractInfo/blackjackABI.json" with { type: "json" };

const BlackjackContractAdress = "0x007D6661c37Edbe1837c90cb2797e9e691951671";

export { BlackjackContractAdress, BlackjackABI };