// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Blackjack is Ownable, ReentrancyGuard {
    // Events for all transactions
    event Deposit(address indexed user, uint256 amount);
    event WithdrawalProcessed(address indexed user, uint256 amount);
    event OwnerWithdrawn(address indexed owner, uint256 amount);

    // Constructor to set the contract deployer as the owner
    constructor() Ownable(msg.sender) {}

    // Function for users to deposit Quai
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit Deposit(msg.sender, msg.value);
    }

    // Function for the owner to process a withdrawal to a user
    function withdrawToUser(
        address user,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(
            address(this).balance >= amount,
            "Contract has insufficient funds"
        );

        (bool success, ) = user.call{value: amount}("");
        require(success, "Transfer failed");

        emit WithdrawalProcessed(user, amount);
    }

    // Function for the owner to withdraw the contract's balance (rewards)
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(
            address(this).balance >= amount,
            "Contract has insufficient funds"
        );

        (bool success, ) = owner().call{value: amount}("");
        require(success, "Transfer failed");

        emit OwnerWithdrawn(owner(), amount);
    }

    // Function to get the contract's balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
