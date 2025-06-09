"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { quais } from "quais";
import "./blackjack.css";
import { BlackjackContractAdress, BlackjackABI } from "./BlackjackContractInformation";
import axios from "axios";
import Image from 'next/image'; // Added for optimized image

const contractAddress: string = BlackjackContractAdress;
const contractABI: quais.InterfaceAbi = BlackjackABI;

type Card = { suit: string; value: number; name: string };

declare global {
  interface Window {
    pelagus?: any; // MetaMask or Pelagus // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }
}

export default function Blackjack() {
  const [address, setAddress] = useState<string>("");
  const [playerBalance, setPlayerBalance] = useState<string>("0"); // Backend balance
  const [gameBalance, setGameBalance] = useState<string>("0"); // Backend gameBalance
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [splitHand, setSplitHand] = useState<Card[] | null>(null);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<number>(0); // 0: active, 1: standing, 2: resolved
  const [message, setMessage] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [shortAddress, setShortAddress] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [contract, setContract] = useState<quais.Contract | null>(null);
  const [signer, setSigner] = useState<quais.JsonRpcSigner | null>(null);
  const [depositBtnLoading, setDepositBtnLoading] = useState<boolean>(false);
  const [withdrawBtnLoading, setWithdrawBtnLoading] = useState<boolean>(false);

  const API_URL = "https://api.quaifly.com/api";

  // Check for existing connection on page load
  useEffect(() => {
    const checkExistingConnection = async () => {
      const token = await localStorage.getItem("token");
      if (!token) return;

      try {
        // Validate token by fetching balance
        const res = await axios.get(`${API_URL}/auth/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set user data from response
        const { address, balance, gameBalance } = res.data.user;
        setAddress(address);
        setPlayerBalance(balance);
        setGameBalance(gameBalance);
        setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
        setWalletConnected(true);
        setMessage("✅ Reconnected to wallet!");

        // Initialize signer
        if (window.pelagus) {
          const provider = new quais.BrowserProvider(window.pelagus);
          const signer = await provider.getSigner();
          setSigner(signer);
        }
      } catch (err: unknown) {
        console.error("Failed to validate token:", err);
        localStorage.removeItem("token"); // Clear invalid token
        setMessage("❌ Session expired. Please reconnect wallet.");
      }
    };

    checkExistingConnection();
  }, []);

  // Connect wallet and authenticate with backend
  const connectWallet = async () => {
    if (!window.pelagus) {
      setMessage("❌ No Web3 wallet detected! Please install MetaMask or Pelagus.");
      return;
    }

    try {
      const provider = new quais.BrowserProvider(window.pelagus);
      const signer = await provider.getSigner();
      setSigner(signer);
      const blackjackContract = new quais.Contract(contractAddress, contractABI, signer);
      setContract(blackjackContract);

      const address = await signer.getAddress();
      setAddress(address); // Use the address
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);

      // Get nonce from backend
      const nonceRes = await axios.get(`${API_URL}/auth/nonce/${address}`);
      const nonce = nonceRes.data.nonce;

      // Sign message
      const message = `Login with nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // Login to backend
      const loginRes = await axios.post(`${API_URL}/auth/login`, { address, signature });
      localStorage.setItem("token", loginRes.data.token);
      setWalletConnected(true);
      setMessage("✅ Wallet connected!");

      // Fetch balances
      await fetchBalances();
    } catch (err: unknown) {
      console.error("Wallet connection failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setMessage((err as any)?.response?.data?.error || "❌ Failed to connect wallet");
    }
  };

  // Fetch balances from backend
  const fetchBalances = useCallback(async () => {
    if (!walletConnected) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.get(`${API_URL}/auth/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayerBalance(res.data.user.balance);
      setGameBalance(res.data.user.gameBalance);
    } catch (err: unknown) {
      console.error("Failed to fetch balances:", err);
      setMessage("❌ Failed to fetch balances");
    }
  }, [walletConnected]);

  // Refresh balances
  const refreshWalletBalance = async () => {
    if (!walletConnected) {
      setMessage("❌ Wallet not connected!");
      return;
    }
    await fetchBalances();
    setMessage(`✅ Balances updated: ${Number(playerBalance).toFixed(2)} QUAI (Wallet), ${Number(gameBalance).toFixed(2)} QUAI (Game)`);
  };

  // Handle deposit (mocked, as backend doesn't support this yet)
  const handleDeposit = async () => {
    setDepositBtnLoading(true);
    if (!contract || !signer) {
      setMessage("❌ Wallet not connected!");
      setDepositBtnLoading(false);
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setMessage("❌ Please enter a valid deposit amount!");
      setDepositBtnLoading(false);
      return;
    }

    try {
      const depositValue = ethers.parseEther(depositAmount);
      const estimatedGas = await contract.deposit.estimateGas({ value: depositValue });

      const tx = await contract.deposit({ value: depositValue, gasLimit: estimatedGas });
      await tx.wait();

      setMessage(`✅ Deposited ${depositAmount} QUAI successfully!`);
      setTimeout(() => {
        refreshWalletBalance();
      }, 2000);
      setDepositAmount("");
    } catch (error: unknown) {
      console.error("Deposit failed:", error);
      setMessage("❌ Deposit failed!");
    }
    setDepositBtnLoading(false);
  };

  // Handle withdraw (mocked, as backend doesn't support this yet)
  const handleWithdraw = async () => {
    setWithdrawBtnLoading(true);
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setMessage("❌ Please enter a valid withdraw amount!");
      setWithdrawBtnLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Authentication token not found. Please log in.");
        setWithdrawBtnLoading(false);
        return;
      }

      const withdrawValue = parseFloat(withdrawAmount);
      const balanceValue = parseFloat(playerBalance);
      if (withdrawValue > balanceValue) {
        setMessage("⚠️ Not enough withdraw amount");
        setWithdrawBtnLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_URL}/auth/withdraw`,
        { amount: withdrawValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Withdrawal successful!");
        await refreshWalletBalance();
        setWithdrawAmount("");
      } else {
        setMessage("❌ Withdrawal failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Wallet connection failed:", error);
      setMessage("❌ Withdraw failed!");
    }
    setWithdrawBtnLoading(false);
  };

  // Start a new game
  const startGame = async () => {
    if (!walletConnected) {
      setMessage("❌ Wallet not connected!");
      return;
    }
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setMessage("❌ Please enter a valid bet amount!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.post(
        `${API_URL}/blackjack/start`,
        { betAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { game, message } = res.data;
      setPlayerHand(game.playerHand);
      setDealerHand(game.dealerHand);
      setSplitHand(game.splitHand || null);
      setGameStatus(game.gameStatus);
      setMessage(message);
      await fetchBalances();
    } catch (err: unknown) {
      console.error("Start game failed:", err);
      setMessage((err as any)?.response?.data?.error || "❌ Failed to start game");
    }
  };

  // Hit action
  const hit = async () => {
    if (gameStatus !== 0) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.post(
        `${API_URL}/blackjack/hit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { game, message } = res.data;
      setPlayerHand(game.playerHand);
      setDealerHand(game.dealerHand);
      setSplitHand(game.splitHand || null);
      setGameStatus(game.gameStatus);
      setMessage(message);
      await fetchBalances();
    } catch (err: unknown) {
      console.error("Hit failed:", err);
      setMessage((err as any)?.response?.data?.error || "❌ Hit failed");
    }
  };

  // Stand action
  const stand = async () => {
    if (gameStatus !== 0) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.post(
        `${API_URL}/blackjack/stand`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { game, message } = res.data;
      setPlayerHand(game.playerHand);
      setDealerHand(game.dealerHand);
      setSplitHand(game.splitHand || null);
      setGameStatus(game.gameStatus);
      setMessage(message);
      await fetchBalances();
    } catch (err: unknown) {
      console.error("Stand failed:", err);
      setMessage((err as any)?.response?.data?.error || "❌ Stand failed");
    }
  };

  // Split action
  const split = async () => {
    if (gameStatus !== 0) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.post(
        `${API_URL}/blackjack/split`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { game, message } = res.data;
      setPlayerHand(game.playerHand);
      setDealerHand(game.dealerHand);
      setSplitHand(game.splitHand || null);
      setGameStatus(game.gameStatus);
      setMessage(message);
      await fetchBalances();
    } catch (err: unknown) {
      console.error("Split failed:", err);
      setMessage((err as any)?.response?.data?.error || "❌ Split failed");
    }
  };

  // Double action
  const double = async () => {
    if (gameStatus !== 0) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.post(
        `${API_URL}/blackjack/double`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { game, message } = res.data;
      setPlayerHand(game.playerHand);
      setDealerHand(game.dealerHand);
      setSplitHand(game.splitHand || null);
      setGameStatus(game.gameStatus);
      setMessage(message);
      await fetchBalances();
    } catch (err: unknown) {
      console.error("Double failed:", err);
      setMessage((err as any)?.response?.data?.error || "❌ Double failed");
    }
  };

  // Calculate hand total
  const handTotal = (hand: Card[]): number => {
    let total = 0;
    let aceCount = 0;
    hand.forEach((card) => {
      if (card.value === 11) {
        total += 11;
        aceCount++;
      } else {
        total += card.value;
      }
    });
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    return total;
  };

  // Fetch balances on wallet connection
  useEffect(() => {
    if (walletConnected) {
      fetchBalances();
    }
  }, [walletConnected, fetchBalances]);

  return (
    <div className="blackjack-container">
      <div className="connect-button-container">
        <button onClick={connectWallet}>
          {walletConnected && shortAddress ? `${shortAddress}` : "Connect Wallet"}
        </button>
      </div>

      <div className="balance-container">
        <p>
          <strong>User Balance:</strong> {parseFloat(playerBalance).toFixed(2)} QUAI
        </p>
        <p>
          <strong>Gaming Balance:</strong> {parseFloat(gameBalance).toFixed(2)} QUAI
        </p>
      </div>

      <div>
        <Image
          src="/images/fly-01_ohneHintergrund_front.png"
          alt="FLY"
          className="fly-image"
          width={500}
          height={500}
        />
      </div>

      <div className="refresh-button-container">
        <button onClick={refreshWalletBalance}>Refresh</button>
      </div>

      <div className="blackjack-header">
        <h1>QuaiFly Blackjack</h1>
      </div>

      <div className="transaction-container">
        <div className="input-row">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Deposit Amount"
          />
          <input
            type="number"
            placeholder="Withdraw Amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
        </div>
        <div className="button-row">
          <button onClick={handleDeposit}>{depositBtnLoading ? "Processing..." : "Deposit"}</button>
          <button onClick={handleWithdraw}>{withdrawBtnLoading ? "Processing..." : "Withdraw"}</button>
        </div>
      </div>

      <div className="blackjack-game">
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="Bet Amount"
          className="bet-input"
        />
        <button onClick={startGame}>New Game</button>
      </div>

      <div className="hand-container">
        <div className="dealer-hand-container">
          <h2>Dealer&#39;s Hand</h2>
          <div className="cards">
            {dealerHand.map((card, index) => (
              <div key={index} className="card">{card.name}</div>
            ))}
          </div>
          <div className="hand-value">Value: {handTotal(dealerHand)}</div>
        </div>

        <div className="player-hand-container">
          <h2>Player&#39;s Hand</h2>
          <div className="cards">
            {playerHand.map((card, index) => (
              <div key={index} className="card">{card.name}</div>
            ))}
          </div>
          <div className="hand-value">Value: {handTotal(playerHand)}</div>
        </div>

        {splitHand && (
          <div className="player-hand-container">
            <h2>Split Hand</h2>
            <div className="cards">
              {splitHand.map((card, index) => (
                <div key={index} className="card">{card.name}</div>
              ))}
            </div>
            <div className="hand-value">Value: {handTotal(splitHand)}</div>
          </div>
        )}
      </div>

      <p className="message">{message}</p>

      <div className="blackjack-game">
        <button onClick={hit} disabled={gameStatus !== 0}>Hit</button>
        <button onClick={stand} disabled={gameStatus !== 0}>Stand</button>
        <button onClick={split} disabled={gameStatus !== 0}>Split</button>
        <button onClick={double} disabled={gameStatus !== 0}>Double</button>
      </div>
    </div>
  );
}