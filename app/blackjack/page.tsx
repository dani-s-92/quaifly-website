"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { quais } from "quais";
import "./blackjack.css"; // ✅ Blackjack styles
import { BlackjackContractAdress, BlackjackABI } from "./BlackjackContractInformation";
import { connectWallet, getPlayerBalance } from "../utils/web3";

const contractAddress: string = BlackjackContractAdress;
const contractABI: quais.InterfaceAbi = BlackjackABI;

type Card = { suit: string; value: number; name: string; };

declare global {
  interface Window {
    pelagus?: any;  // ✅ Define Pelagus as a valid property
  }
}

export default function Blackjack() {
  const [contract, setContract] = useState<quais.Contract | null>(null);
  const [signer, setSigner] = useState<quais.JsonRpcSigner | null>(null);
  const [playerBalance, setPlayerBalance] = useState<string>("0");
  const [walletBalance, setWalletBalance] = useState<string>("0"); // ✅ Wallet balance state
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [splitHand, setSplitHand] = useState<Card[] | null>(null);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [shortAddress, setShortAddress] = useState("");
  const [betAmount, setBetAmount] = useState(""); // State for the bet input

  useEffect(() => {
    async function loadWeb3AndFetchBalance() {
        if (!window.pelagus) {
          console.error("Pelagus not found");
          setMessage("❌ No Web3 wallet detected!");
          return;
        }

        try {
            // ✅ Use BrowserProvider for signer (wallet interaction)
            const provider = new quais.BrowserProvider(window.pelagus);
            const signer = await provider.getSigner(); // ✅ No need to cast to `ethers.Signer`
            setSigner(signer);

            // ✅ Use JsonRpcProvider for blockchain interaction
            const rpcProvider = new quais.JsonRpcProvider("https://orchard.rpc.quai.network");
            const blackjackContract = new quais.Contract(contractAddress, contractABI, signer); 
            setContract(blackjackContract);

            if (signer && blackjackContract) {
              const playerAddress = await signer.getAddress();
              setShortAddress(`${playerAddress.slice(0, 6)}...${playerAddress.slice(-6)}`); // ✅ Store shortened address

              // ✅ Try fetching contract balance
              let contractBalance = 0;
              try {
                  contractBalance = await blackjackContract.getBalance(playerAddress);
              } catch (error) {
                  console.error("Failed to fetch contract balance:", error);
              }
              setPlayerBalance(ethers.formatEther(contractBalance));
          
              // ✅ Try fetching wallet balance, fallback to 0 if error occurs
              let walletBalanceRaw: bigint = BigInt(0);  // ✅ Initialize as bigint
              try {
                walletBalanceRaw = await provider.getBalance(playerAddress);
                /*setWalletBalance(walletBalanceRaw.toString()); // ✅ Converts bigint to string*/
                
              } catch (error) {
                  console.error("Failed to fetch wallet balance:", error);
              }
              setWalletBalance(ethers.formatEther(walletBalanceRaw));
            }
        } catch (error) {
            console.error("❌ Error loading balances:", error);
            setMessage("❌ Failed to fetch balances!");
        }
    }

    loadWeb3AndFetchBalance();
  }, [signer, contract]);

  // ✅ NEW useEffect for game logic (placed right after the first one)
  useEffect(() => {
    if (gameStatus !== 1) return; // Only run when dealer is hitting

    const dealerTotal = handTotal(dealerHand);
    console.log("Updated Dealer Total:", dealerTotal); // Debugging

    if (dealerTotal >= 17) {
      resolveGame(); // Ensure resolveGame() runs ONLY after dealer stops hitting
    }
  }, [dealerHand]); // Runs whenever dealerHand updates

  async function connectWallet() {
    if (!window.pelagus) {
        setMessage("❌ No Pelagus wallet detected!");
        return;
    }

    try {
        const provider = new quais.BrowserProvider(window.pelagus);
        const signer = await provider.getSigner();
        setWalletConnected(true);
        setMessage(`✅ Wallet connected! Address: ${await signer.getAddress()}`);
    } catch (error) {
        console.error("❌ Wallet connection failed:", error);
        setMessage("❌ Failed to connect wallet!");
    }
  }

  // ✅ Deposit Function with Balance Updates
  async function handleDeposit() {
    if (!contract || !signer) {
        setMessage("❌ Wallet not connected!");
        return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
        setMessage("❌ Please enter a valid deposit amount!");
        return;
    }

    try {
        const depositValue = ethers.parseEther(depositAmount);
        const estimatedGas = await contract.depositFunds.estimateGas({ value: depositValue });

        const tx = await contract.depositFunds({ value: depositValue, gasLimit: estimatedGas });
        await tx.wait();

        setMessage(`✅ Deposited ${depositAmount} QUAI successfully!`);

        // ✅ Update Wallet & Contract Balances
        const newContractBalance = await contract.getBalance(await signer.getAddress());
        setPlayerBalance(ethers.formatEther(newContractBalance));

        const newWalletBalance = await getWalletBalance(signer, new quais.BrowserProvider(window.pelagus));
        setWalletBalance(newWalletBalance ?? "0"); // ✅ Defaults to "0" if `undefined`

        setDepositAmount("");
    } catch (error) {
        console.error("Deposit failed:", error);
        setMessage("❌ Deposit failed!");
    }
  }

  // ✅ Withdraw Function with Balance Updates
  async function handleWithdraw() {
    if (!contract || !signer) {
        setMessage("❌ Wallet not connected!");
        return;
    }
    if (!withdrawAmount || withdrawAmount === "") {
        setMessage("❌ Please enter a valid amount to withdraw!");
        return;
    }

    try {
        const playerAddress = await signer.getAddress();

        // ✅ Get the player's current contract balance
        const contractBalanceRaw = await contract.getBalance(playerAddress);
        const contractBalance = ethers.formatEther(contractBalanceRaw);

        // ✅ Convert input withdrawal amount from string to Ether format
        const withdrawAmountRaw = ethers.parseEther(withdrawAmount);

        // ✅ Check if withdrawal amount is within the player's balance
        if (withdrawAmountRaw > contractBalanceRaw) {
            setMessage("❌ Withdrawal amount exceeds available balance!");
            return;
        }

        // ✅ Proceed with withdrawal
        const tx = await contract.withdrawFunds(withdrawAmountRaw);
        await tx.wait();

        setMessage(`✅ Successfully withdrew ${withdrawAmount} QUAI!`);

        // ✅ Update Wallet & Contract Balances
        const newContractBalance = await contract.getBalance(playerAddress);
        setPlayerBalance(ethers.formatEther(newContractBalance));

        const newWalletBalance = await getWalletBalance(signer, new quais.BrowserProvider(window.pelagus));
        setWalletBalance(newWalletBalance ?? "0"); // ✅ Defaults to "0" if `undefined`
    } catch (error) {
        console.error("❌ Withdrawal failed:", error);
        setMessage("❌ Withdrawal failed! Please check your balance.");
    }
  }

  // ✅ Manual Wallet Balance Refresh
  async function refreshWalletBalance() {
    if (!signer) {
        setMessage("❌ Wallet not connected!");
        return;
    }

    try {
        const newWalletBalance = await getWalletBalance(signer, new quais.BrowserProvider(window.pelagus));
        setWalletBalance(newWalletBalance ?? "0"); // ✅ Defaults to "0" if `undefined`
        setMessage(`✅ Wallet balance updated: ${newWalletBalance} QUAI`);
    } catch (error) {
        console.error("❌ Failed to refresh wallet balance:", error);
        setMessage("❌ Failed to refresh balance!");
    }
  }

  async function startGame() {
    if (!contract || !signer) return;
    const playerAddress = await signer.getAddress();

    // Retrieve player's gaming balance (likely a bigint)
    const gamingBalanceRaw = await contract.getBalance(playerAddress);

    // ✅ Validate the input bet amount
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setMessage("Please enter a valid bet amount.");
      return;
    }

    // ✅ Convert the input bet amount into the proper format (bigint)
    const parsedBet = ethers.parseEther(betAmount);
    
    // ✅ Compare using native operators because gamingBalanceRaw is a bigint
    if (gamingBalanceRaw < parsedBet) {
      setMessage("Not enough Gaming Balance for that bet!");
      return;
    }

    try {
      // ✅ Pass the bet amount to the smart contract
      await contract.placeBet(parsedBet);
    } catch (error) {
      console.error("Transaction failed:", error);
      setMessage("Transaction failed! Please check your bet conditions.");
      return;
    }

    // ✅ Create a fresh deck for this game
    const newDeck = createDeck();

    // ✅ Deal cards using local variables
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!];  // Dealer gets just one card at the beginning

    // ✅ Update state with the remaining deck and the hands
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);

    // ✅ Check for a natural blackjack (only in a 2-card hand)
    if (playerCards.length === 2 && handTotal(playerCards) === 21) {
      setGameStatus(2); 
      setMessage("Blackjack! You win right away!");
      
      // Optionally, call a payout function:
      await contract.payoutWinner(playerAddress, true);
      return;
    }

    // ✅ If no blackjack, start the game normally
    setGameStatus(0); 
    setMessage("Game started! Hit or Stand?");
}

  

  function createDeck(): Card[] {
    let deck: Card[] = [];
    const suits = ["♣️", "♦️", "♥️", "♠️"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    for (let suit of suits) {
        for (let i = 0; i < values.length; i++) {
            let cardValue = i + 1 > 10 ? 10 : i + 1;
            deck.push({ suit, value: cardValue, name: `${values[i]} ${suit}` });
        }
    }
    return shuffle(deck);
  }

  function shuffle(deck: Card[]): Card[] {
    return deck.sort(() => Math.random() - 0.5);
  }

  function handTotal(hand: Card[]): number {
    let total = 0;
    let aceCount = 0;
  
    // First, iterate over the cards and add their values
    // For Aces, add 11 initially and track their count
    hand.forEach((card) => {
      if (card.name.startsWith("A")) {
        total += 11;
        aceCount++;
      } else {
        total += card.value;
      }
    });
  
    // Adjust for Aces: if total > 21 and there are Aces counted as 11, reduce total by 10 for each Ace
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
  
    return total;
  }

  function hit() {
    if (gameStatus !== 0 || deck.length === 0) return;

    const newCard = deck.pop()!;
    setDeck([...deck]); // ✅ Update deck

    setPlayerHand(prevHand => {
        const updatedHand = [...prevHand, newCard];
        const updatedTotal = handTotal(updatedHand);

        console.log("Aktualisierte Hand:", updatedHand);
        console.log("Aktualisierter Gesamtwert:", updatedTotal);

        setMessage(`Hit oder Stand? (Dein Gesamtwert: ${updatedTotal})`);

        // ✅ If player busts, end game immediately without calling `resolveGame()`
        if (updatedTotal > 21) {
            setMessage(`Busted! Dein Wert: ${updatedTotal}. Dealer gewinnt.`);
            setGameStatus(2); // ✅ Just end the game here, no need to resolve further
        } else if (updatedTotal === 21) {
            setMessage(`Du hast genau 21! Stehst automatisch.`);
            setTimeout(() => stand(), 50);
        }

        return updatedHand;
    });
  }



  
  async function split() {
    if (!contract) {
      setMessage("Smart contract is not loaded. Please reconnect your wallet.");
      return;
    }
    
    if (!signer) {
      setMessage("Wallet is not connected. Please reconnect your wallet.");
      return;
    }

    if (playerHand.length !== 2 || playerHand[0].value !== playerHand[1].value) {
      setMessage("You can only split when you have two identical cards.");
      return;
    }
  
    // ✅ Get gaming balance from the contract instead of wallet balance
    const playerAddress = await signer.getAddress();
    const gamingBalanceRaw = await contract.getBalance(playerAddress);
  
    const parsedBet = ethers.parseEther(betAmount);
    if (gamingBalanceRaw < parsedBet * BigInt(2)) { 
      setMessage("Not enough Gaming Balance to split!");
      return;
    }
  
    // ✅ Call contract to deduct second bet
    await contract.splitHand();
  
    // ✅ Create two separate hands
    const newDeckCopy = [...deck];
    const firstHand = [playerHand[0], newDeckCopy.pop()!];
    const secondHand = [playerHand[1], newDeckCopy.pop()!];
  
    // ✅ Store both hands separately
    setPlayerHand(firstHand); 
    setSplitHand(secondHand);
  
    setMessage("You have split your hand! Play each hand separately.");
  }

  async function double() {
    if (!contract) {
      setMessage("Smart contract is not loaded. Please reconnect your wallet.");
      return;
    }
    
    if (!signer) {
      setMessage("Wallet is not connected. Please reconnect your wallet.");
      return;
    }

    if (playerHand.length !== 2) {
      setMessage("You can only double after receiving your first two cards.");
      return;
    }
  
    // ✅ Get gaming balance from smart contract
    const playerAddress = await signer.getAddress();
    const gamingBalanceRaw = await contract.getBalance(playerAddress);
  
    // ✅ Convert bet amount and compare
    const parsedBet = ethers.parseEther(betAmount);
    if (gamingBalanceRaw < parsedBet * BigInt(2)) {  
      setMessage("Not enough Gaming Balance to double down!");
      return;
    }
  
    contract.doubleBet();
  
    const newCard = deck.pop();
    const updatedHand = [...playerHand, newCard!];
    setPlayerHand(updatedHand);
    setMessage(`You doubled! Final hand value: ${handTotal(updatedHand)}. Dealer's turn.`);
  
    stand(); // ✅ Automatically end player's turn after doubling
  }
  

  // Called when the player clicks "Stand" (or auto-called when 21 is reached)
  function stand() {
    // Prevent multiple stand calls.
    if (gameStatus !== 0) return;
    setGameStatus(1); // 1 indicates player stands; now it's dealer's turn.
    dealerTurn();    // Dealer will now hit until his total is ≥ 17.
  }

  // Dealer draws cards until his hand's total is at least 17.
  function dealerTurn() {
    setDealerHand(prevHand => {
      let dealerHandCopy = [...prevHand];
      let currentDeck = [...deck];
  
      while (handTotal(dealerHandCopy) < 17 && currentDeck.length > 0) {
        const newDealerCard = currentDeck.pop()!;
        dealerHandCopy.push(newDealerCard);
      }
  
      setDeck(currentDeck);
      
      // Ensure resolveGame() runs ONLY after dealerHand updates
      setTimeout(() => {
        console.log("Final Dealer Hand Before Resolution:", dealerHandCopy);
        setDealerHand(dealerHandCopy); // ✅ State update happens asynchronously here
      }, 50);
  
      return dealerHandCopy;
    });
  }
    
    


  async function resolveGame() {
    if (!contract || !signer) {
        setMessage("Smart contract or wallet is not loaded. Please reconnect.");
        return;
    }

    const playerAddress = await signer.getAddress();
    const playerTotal = handTotal(playerHand);
    const dealerTotal = handTotal(dealerHand);
    const splitTotal = splitHand ? handTotal(splitHand) : null;

    console.log("Final Totals:", { playerTotal, splitTotal, dealerTotal });

    // ✅ Check if the player has Blackjack (first two cards add up to 21)
    const isBlackjackMain = playerHand.length === 2 && playerTotal === 21;
    const isBlackjackSplit = splitHand && splitHand.length === 2 && splitTotal === 21;

    // ✅ Evaluate first hand
    evaluateHand(playerTotal, dealerTotal, "First Hand");

    // ✅ Evaluate second hand if split occurred
    if (splitTotal !== null) {
        evaluateHand(splitTotal, dealerTotal, "Second Hand");
    }

    // ✅ Call payout for winning hands & specify Blackjack status
    if (playerTotal <= 21 && (dealerTotal > 21 || playerTotal > dealerTotal)) {
        await contract.payoutWinner(playerAddress, isBlackjackMain);
    }
    if (splitTotal !== null && splitTotal <= 21 && (dealerTotal > 21 || splitTotal > dealerTotal)) {
        await contract.payoutWinner(playerAddress, isBlackjackSplit);
    }

    setGameStatus(2); // ✅ Mark game as finished
  }

  // ✅ Helper function to evaluate a single hand against dealer
  function evaluateHand(playerHandTotal: number, dealerTotal: number, handName: string) {
    if (playerHandTotal > 21) {
        setMessage(`${handName}: You busted at ${playerHandTotal}. Dealer wins.`);
        return;
    } else if (dealerTotal > 21) {
        setMessage(`${handName}: Dealer busted at ${dealerTotal}. You win with ${playerHandTotal}!`);
    } else if (playerHandTotal === 21) {
        setMessage(dealerTotal === 21 ? `${handName}: Both have 21. It's a draw!` : `${handName}: You have 21 and dealer has ${dealerTotal}. You win!`);
    } else {
        setMessage(
            playerHandTotal > dealerTotal
                ? `${handName}: You win! (${playerHandTotal} vs ${dealerTotal})`
                : playerHandTotal < dealerTotal
                ? `${handName}: Dealer wins! (${dealerTotal} vs ${playerHandTotal})`
                : `${handName}: It's a tie!`
        );
    }
  }


  // ✅ Wallet Connection Function
  async function handleConnectWallet() {
    if (!window.pelagus) {
        setMessage("❌ No Web3 wallet detected! Please install Pelagus or MetaMask.");
        return;
    }

    try {
        const provider = new quais.BrowserProvider(window.pelagus);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setSigner(signer);

        const blackjackContract = new quais.Contract(contractAddress, contractABI, signer);
        setContract(blackjackContract);

        const playerAddress = await signer.getAddress();
        const contractBalance = await blackjackContract.getBalance(playerAddress);
        setPlayerBalance(ethers.formatEther(contractBalance));

        // ✅ Fetch Wallet Balance & Update
        const walletBalanceRaw = await getWalletBalance(signer, provider);
        setWalletBalance(walletBalanceRaw ?? "0"); // ✅ Defaults to "0" if `undefined`

        setMessage(`✅ Wallet connected! Wallet Balance: ${walletBalanceRaw} QUAI`);
    } catch (error) {
        console.error("Wallet connection failed:", error);
        setMessage("❌ Wallet connection failed!");
    }
  }

  // ✅ Function to Fetch Wallet Balance
  async function getWalletBalance(signer: quais.Signer, provider: quais.BrowserProvider) {
    try {
        const address = await signer.getAddress();
        console.log("✅ Wallet Address:", address);

        // ✅ Fetch balance & handle user rejection
        const balance = await provider.getBalance(address);
        console.log("✅ Raw Wallet Balance:", balance.toString());

        return ethers.formatEther(balance);
    } catch (error: unknown) {
      const errMessage = (error as Error).message; // ✅ Safe way to access error message
      console.error("Deposit failed:", errMessage);
      setMessage(`❌ Deposit failed: ${errMessage}`);
    }
  }

  return (
    <div className="blackjack-container"> {/* ✅ Added parent wrapper */}
      <div className="connect-button-container">
        <button onClick={connectWallet}>
          {walletConnected && shortAddress ? `${shortAddress}` : "Connect Wallet"}
        </button>
      </div>

      <div className="balance-container">
        <p><strong>Wallet Balance:</strong> {parseFloat(walletBalance).toFixed(2)} QUAI</p>
        <p><strong>Gaming Balance:</strong> {parseFloat(playerBalance).toFixed(2)} QUAI</p>
      </div>

      <div>
      <img src="/images/fly-01_ohneHintergrund_front.png" alt="FLY" className="fly-image" />
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
              type="text" 
              placeholder="Withdraw Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)} 
          />
        </div>

        <div className="button-row">
          <button onClick={handleDeposit}>Deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>
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
        {/* Dealer Hand Section */}
        <div className="dealer-hand-container">
          <h2>Dealer's Hand</h2>
          <div className="cards">
            {dealerHand.map((card, index) => (
              <div key={index} className="card">{card.name}</div>
            ))}
          </div>
          <div className="hand-value">
            Value: {handTotal(dealerHand)}
          </div>
        </div>

        {/* Player Hand Section */}
        <div className="player-hand-container">
          <h2>Player's Hand</h2>
          <div className="cards">
            {playerHand.map((card, index) => (
              <div key={index} className="card">{card.name}</div>
            ))}
          </div>
          <div className="hand-value">
            Value: {handTotal(playerHand)}
          </div>
        </div>
      </div>

      <p className="message">{message}</p>

      <div className="blackjack-game">
        <button onClick={hit} disabled={handTotal(playerHand) >= 21}>Hit</button>
        <button onClick={stand} disabled={handTotal(playerHand) >= 21}>Stand</button>
        <button onClick={split} disabled={handTotal(playerHand) >= 21}>Split</button>
        <button onClick={double} disabled={handTotal(playerHand) >= 21}>Double</button>
      </div> 

    </div>
  );

}
