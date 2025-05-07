import { ethers } from "ethers";
import { BlackjackContractAdress, BlackjackABI } from "../blackjack/BlackjackContractInformation";

declare global {
    interface Window {
      ethereum?: any;
    }
  }
  
  export const getContractInstance = async () => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(BlackjackContractAdress, BlackjackABI, signer);
  };

  export const getPlayerBalance = async () => {
    const contract = await getContractInstance();
    if (!contract) return null;
    
    const balance = await contract.getBalance();
    return ethers.formatEther(balance);
  };

  export const placeBet = async (amount: string) => {
  const contract = await getContractInstance();
  if (!contract) return null;

  const transaction = await contract.placeBet({ value: ethers.parseEther(amount) });
  await transaction.wait();

  console.log("✅ Bet placed successfully!");
  };

  // ✅ Connect Wallet Function
export const connectWallet = async () => {
  if (!window.ethereum) {
      alert("MetaMask or a Web3 provider is required!");
      return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
  await provider.send("eth_requestAccounts", []); // Request wallet access
  const signer = await provider.getSigner();
  
  return signer;
};