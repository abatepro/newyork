pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract SimpleDEX {
    
    IERC20 public token;
    address public owner;

    mapping(address => uint256) public etherBalance;
    
    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }

    // Allow users to deposit Ether
    function depositEther() external payable {
        etherBalance[msg.sender] += msg.value;
    }

    // Allow users to withdraw Ether
    function withdrawEther(uint256 amount) external {
        require(etherBalance[msg.sender] >= amount, "Insufficient funds");
        etherBalance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Trade Ether for tokens
    function buyTokens(uint256 tokenAmount) external {
        uint256 etherCost = tokenAmount / 100;  // Example: 100 tokens for 1 Ether
        require(etherBalance[msg.sender] >= etherCost, "Insufficient Ether");
        require(token.transferFrom(owner, msg.sender, tokenAmount), "Transfer failed");
        etherBalance[msg.sender] -= etherCost;
        etherBalance[owner] += etherCost;
    }

    // Trade tokens for Ether
    function sellTokens(uint256 tokenAmount) external {
        uint256 etherValue = tokenAmount / 100;  // Example: 100 tokens for 1 Ether
        require(token.balanceOf(msg.sender) >= tokenAmount, "Insufficient tokens");
        require(token.transferFrom(msg.sender, owner, tokenAmount), "Transfer failed");
        etherBalance[msg.sender] += etherValue;
        etherBalance[owner] -= etherValue;
    }
}
