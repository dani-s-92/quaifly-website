// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Blackjack {
  address public owner;
  mapping(address => uint256) public balances; // ✅ Stores player balances
  mapping(address => uint256) public playerBets; // ✅ Stores each player's active bet

  event BetPlaced(address indexed player, uint256 amount);
  event Payout(address indexed player, uint256 amount);
  event Deposit(address indexed player, uint256 amount);
  event Withdrawal(address indexed player, uint256 amount);

  constructor() {
    owner = msg.sender;
  }

  // ✅ Players deposit ETH into their balance ONCE
  function depositFunds() public payable {
    require(msg.value > 0, 'Deposit must be greater than 0');
    balances[msg.sender] += msg.value;
    emit Deposit(msg.sender, msg.value);
  }

  // ✅ Players can now **set their own bet amount** dynamically
  function placeBet(uint256 amount) public {
    require(amount > 0, 'Bet must be greater than zero');
    require(balances[msg.sender] >= amount, 'Not enough balance');

    balances[msg.sender] -= amount; // ✅ Deduct only the chosen bet amount
    playerBets[msg.sender] = amount; // ✅ Store bet amount per player

    emit BetPlaced(msg.sender, amount);
  }

  // ✅ Allow **doubling the bet amount** mid-game
  function doubleBet() public {
    uint256 currentBet = playerBets[msg.sender];
    require(currentBet > 0, 'No active bet to double');
    require(balances[msg.sender] >= currentBet, 'Not enough funds to double bet');

    balances[msg.sender] -= currentBet; // ✅ Deduct additional amount
    playerBets[msg.sender] *= 2; // ✅ Doubles stored bet
    emit BetPlaced(msg.sender, playerBets[msg.sender]);
  }

  // ✅ Allow **splitting the hand into two separate bets**
  function splitHand() public {
    uint256 currentBet = playerBets[msg.sender];
    require(currentBet > 0, 'No active bet to split');
    require(balances[msg.sender] >= currentBet, 'Not enough funds to split');

    balances[msg.sender] -= currentBet; // ✅ Deduct second-hand bet
    playerBets[msg.sender] *= 2; // ✅ Double the stored bet for two hands
    emit BetPlaced(msg.sender, playerBets[msg.sender]);
  }

  // ✅ Payout function for winners (adjusted based on flexible bet)
  function payoutWinner(address winner, bool isBlackjack) public {
    require(msg.sender == owner, 'Only owner can call this');

    uint256 multiplier = isBlackjack ? 25 : 20; // ✅ Blackjack gets 2.5x, regular win gets 2x
    uint256 payoutAmount = (playerBets[winner] * multiplier) / 10; // ✅ Convert to correct scaling

    require(balances[winner] >= payoutAmount, 'Insufficient funds for payout');

    balances[winner] += payoutAmount; // ✅ Add winnings to the player's balance
    playerBets[winner] = 0; // ✅ Reset bet after payout

    emit Payout(winner, payoutAmount);
  }

  // ✅ Players withdraw unused funds anytime
  function withdrawFunds(uint256 amount) public {
    require(balances[msg.sender] >= amount, 'Not enough funds to withdraw');

    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
    emit Withdrawal(msg.sender, amount);
  }

  // ✅ View player balance
  function getBalance(address player) public view returns (uint256) {
    return balances[player];
  }

  // ✅ View contract balance
  function contractBalance() public view returns (uint256) {
    return address(this).balance;
  }
}
