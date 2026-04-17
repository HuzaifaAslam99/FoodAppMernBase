// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Standard interface for ERC20 tokens like USDC
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Order {
    // The USDC contract address (Example: Base Sepolia)
    // You can also pass this into the constructor to make it flexible
    address public constant USDC_ADDRESS = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; 
    // 0x036CbD53842c5426634e7929541eC2318f3dCF7e

    struct OrderRecord {
        string orderId;
        uint256 amountPaid;
        address buyer;
        uint256 timestamp;
    }

    mapping(string => OrderRecord) public orders;
    string[] public allOrderIds;

    event OrderPlaced(string orderId, address buyer, uint256 amount);

    // REMOVED 'payable' - we are using USDC, not ETH
    function payForOrder(string memory _orderId, uint256 _amount) public {
        require(_amount > 0, "Payment must be greater than 0");
        require(orders[_orderId].buyer == address(0), "Order ID already paid");

        // "Pull" the USDC from the user's wallet to this contract
        // Requirement: User must have called 'approve' on the USDC contract first
        bool success = IERC20(USDC_ADDRESS).transferFrom(msg.sender, address(this), _amount);
        require(success, "USDC transfer failed");

        orders[_orderId] = OrderRecord(
            _orderId,
            _amount,
            msg.sender,
            block.timestamp
        );

        allOrderIds.push(_orderId);

        emit OrderPlaced(_orderId, msg.sender, _amount);
    }

    // Updated to check USDC balance instead of ETH balance
    function getContractBalance() public view returns (uint256) {
        return IERC20(USDC_ADDRESS).balanceOf(address(this));
    }
}