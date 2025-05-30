// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoSReceiver is ReentrancyGuard, Ownable {
    event OrderPaid(
        address indexed customer,
        address indexed merchant,
        address indexed token,
        uint256 amount,
        string orderId,
        uint256 timestamp
    );
    
    event ProductPurchased(
        address indexed customer,
        address indexed merchant,
        uint256 indexed productId,
        address token,
        uint256 amount,
        uint256 quantity,
        string orderId,
        uint256 timestamp
    );
    
    event ProductAdded(
        address indexed merchant,
        uint256 indexed productId,
        string name,
        uint256 price,
        address token
    );
    
    event ProductUpdated(
        address indexed merchant,
        uint256 indexed productId,
        string name,
        uint256 price,
        address token,
        bool active
    );
    
    event FeeCollected(
        address indexed token,
        uint256 amount,
        address indexed from,
        string orderId,
        uint256 timestamp
    );

    struct Product {
        uint256 id;
        string name;
        string description;
        string image;
        uint256 price; 
        address acceptedToken; 
        address merchant;
        bool active;
        uint256 totalSales;
        uint256 createdAt;
    }

    struct PaymentInfo {
        address customer;
        address merchant;
        address token;
        uint256 amount;
        string orderId;
        uint256 timestamp;
        bool processed;
        uint256 productId; // 0 if not a product purchase
        uint256 quantity;
    }

    struct ProductPurchase {
        uint256 productId;
        uint256 quantity;
        uint256 unitPrice;
        uint256 totalAmount;
    }

    // Storage mappings
    mapping(bytes32 => PaymentInfo) public payments;
    mapping(address => bool) public authorizedMerchants;
    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public merchantProducts; // merchant => product IDs
    mapping(address => mapping(uint256 => bool)) public merchantOwnsProduct; // merchant => productId => owns
    mapping(address => uint256) public collectedFees; // token => total fees collected
    
    uint256 public _nextProductId = 1;
    uint256 public totalProducts;
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee
    uint256 public constant FEE_DENOMINATOR = 100;

    modifier onlyAuthorizedMerchant() {
        require(authorizedMerchants[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    modifier onlyProductOwner(uint256 productId) {
        require(
            products[productId].merchant == msg.sender || msg.sender == owner(),
            "Not product owner"
        );
        _;
    }

    modifier validProduct(uint256 productId) {
        require(productId > 0 && productId < _nextProductId, "Invalid product ID");
        require(products[productId].active, "Product not active");
        _;
    }

    constructor()Ownable(msg.sender) {

    }

    // ================= MERCHANT MANAGEMENT =================
    
    function addMerchant(address merchant) external onlyOwner {
        authorizedMerchants[merchant] = true;
    }

    function addMerchantNotAdmin(address merchant) external  {
        authorizedMerchants[merchant] = true;
    }

    function removeMerchant(address merchant) external onlyOwner {
        authorizedMerchants[merchant] = false;
    }

    // ================= PRODUCT MANAGEMENT =================

    function addProduct(
        string memory name,
        string memory description,
        string memory image,
        uint256 price,
        address acceptedToken
    ) external onlyAuthorizedMerchant returns (uint256) {
        require(bytes(name).length > 0, "Product name required");
        require(price > 0, "Price must be greater than 0");
        require(acceptedToken != address(0), "Invalid token address");

        uint256 productId = _nextProductId++;
        
        products[productId] = Product({
            id: productId,
            name: name,
            description: description,
            image: image,
            price: price,
            acceptedToken: acceptedToken,
            merchant: msg.sender,
            active: true,
            totalSales: 0,
            createdAt: block.timestamp
        });

        merchantProducts[msg.sender].push(productId);
        merchantOwnsProduct[msg.sender][productId] = true;
        totalProducts++;

        emit ProductAdded(msg.sender, productId, name, price, acceptedToken);
        
        return productId;
    }

    function updateProduct(
        uint256 productId,
        string memory name,
        string memory description,
        uint256 price,
        address acceptedToken,
        bool active
    ) external onlyProductOwner(productId) {
        require(bytes(name).length > 0, "Product name required");
        require(price > 0, "Price must be greater than 0");
        require(acceptedToken != address(0), "Invalid token address");

        Product storage product = products[productId];
        product.name = name;
        product.description = description;
        product.price = price;
        product.acceptedToken = acceptedToken;
        product.active = active;

        emit ProductUpdated(msg.sender, productId, name, price, acceptedToken, active);
    }

    function deactivateProduct(uint256 productId) external onlyProductOwner(productId) {
        products[productId].active = false;
        emit ProductUpdated(
            msg.sender, 
            productId, 
            products[productId].name, 
            products[productId].price, 
            products[productId].acceptedToken, 
            false
        );
    }

    // ================= PAYMENT PROCESSING =================

    // Purchase a specific product
    function purchaseProduct(
        uint256 productId,
        uint256 quantity,
        string memory orderId
    ) external validProduct(productId) nonReentrant returns (bytes32) {
        require(quantity > 0, "Quantity must be greater than 0");
        
        Product storage product = products[productId];
        uint256 totalAmount = product.price * quantity;
        
        // Calculate platform fee (5%)
        uint256 platformFee = (totalAmount * PLATFORM_FEE_PERCENTAGE) / FEE_DENOMINATOR;
        uint256 merchantAmount = totalAmount - platformFee;
        
        // Transfer tokens from customer
        IERC20(product.acceptedToken).transferFrom(msg.sender, address(this), totalAmount);
        
        // Transfer merchant amount to merchant
        IERC20(product.acceptedToken).transfer(product.merchant, merchantAmount);
        
        // Keep platform fee in contract
        collectedFees[product.acceptedToken] += platformFee;

        // Update product sales
        product.totalSales += quantity;

        // Generate payment ID
        bytes32 paymentId = keccak256(abi.encodePacked(
            msg.sender,
            product.merchant,
            product.acceptedToken,
            totalAmount,
            productId,
            orderId,
            block.timestamp
        ));

        // Store payment info
        payments[paymentId] = PaymentInfo({
            customer: msg.sender,
            merchant: product.merchant,
            token: product.acceptedToken,
            amount: totalAmount,
            orderId: orderId,
            timestamp: block.timestamp,
            processed: true,
            productId: productId,
            quantity: quantity
        });

        // Emit events
        emit ProductPurchased(
            msg.sender,
            product.merchant,
            productId,
            product.acceptedToken,
            totalAmount,
            quantity,
            orderId,
            block.timestamp
        );

        emit OrderPaid(
            msg.sender,
            product.merchant,
            product.acceptedToken,
            totalAmount,
            orderId,
            block.timestamp
        );
        
        emit FeeCollected(
            product.acceptedToken,
            platformFee,
            msg.sender,
            orderId,
            block.timestamp
        );

        return paymentId;
    }

    // Purchase multiple products in one transaction
    function purchaseMultipleProducts(
        ProductPurchase[] memory purchases,
        string memory orderId
    ) external nonReentrant returns (bytes32) {
        require(purchases.length > 0, "No products to purchase");
        
        address merchant;
        address token;
        uint256 totalAmount = 0;
        
        // Validate all products belong to same merchant and use same token
        for (uint256 i = 0; i < purchases.length; i++) {
            require(purchases[i].quantity > 0, "Invalid quantity");
            require(
                purchases[i].productId > 0 && 
                purchases[i].productId < _nextProductId, 
                "Invalid product ID"
            );
            
            Product storage product = products[purchases[i].productId];
            require(product.active, "Product not active");
            
            if (i == 0) {
                merchant = product.merchant;
                token = product.acceptedToken;
            } else {
                require(product.merchant == merchant, "All products must be from same merchant");
                require(product.acceptedToken == token, "All products must use same token");
            }
            
            uint256 expectedAmount = product.price * purchases[i].quantity;
            require(purchases[i].totalAmount == expectedAmount, "Incorrect total amount");
            
            totalAmount += expectedAmount;
            
            // Update product sales
            product.totalSales += purchases[i].quantity;
        }

        // Calculate platform fee (5%)
        uint256 platformFee = (totalAmount * PLATFORM_FEE_PERCENTAGE) / FEE_DENOMINATOR;
        uint256 merchantAmount = totalAmount - platformFee;

        // Transfer total amount from customer
        IERC20(token).transferFrom(msg.sender, address(this), totalAmount);
        
        // Transfer merchant amount to merchant
        IERC20(token).transfer(merchant, merchantAmount);
        
        // Keep platform fee in contract
        collectedFees[token] += platformFee;

        // Generate payment ID
        bytes32 paymentId = keccak256(abi.encodePacked(
            msg.sender,
            merchant,
            token,
            totalAmount,
            orderId,
            block.timestamp
        ));

        // Store payment info (using productId 0 for multi-product purchases)
        payments[paymentId] = PaymentInfo({
            customer: msg.sender,
            merchant: merchant,
            token: token,
            amount: totalAmount,
            orderId: orderId,
            timestamp: block.timestamp,
            processed: true,
            productId: 0, // 0 indicates multi-product purchase
            quantity: purchases.length
        });

        // Emit events for each product
        for (uint256 i = 0; i < purchases.length; i++) {
            emit ProductPurchased(
                msg.sender,
                merchant,
                purchases[i].productId,
                token,
                purchases[i].totalAmount,
                purchases[i].quantity,
                orderId,
                block.timestamp
            );
        }

        emit OrderPaid(msg.sender, merchant, token, totalAmount, orderId, block.timestamp);
        
        emit FeeCollected(
            token,
            platformFee,
            msg.sender,
            orderId,
            block.timestamp
        );

        return paymentId;
    }

    // Legacy payment functions (for backward compatibility)
    function processPayment(
        address token,
        address customer,
        address merchant,
        uint256 amount,
        string memory orderId
    ) external onlyAuthorizedMerchant nonReentrant returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        require(customer != address(0), "Invalid customer address");
        require(merchant != address(0), "Invalid merchant address");

        IERC20(token).transferFrom(customer, merchant, amount);

        bytes32 paymentId = keccak256(abi.encodePacked(
            customer, merchant, token, amount, orderId, block.timestamp
        ));

        payments[paymentId] = PaymentInfo({
            customer: customer,
            merchant: merchant,
            token: token,
            amount: amount,
            orderId: orderId,
            timestamp: block.timestamp,
            processed: true,
            productId: 0,
            quantity: 0
        });

        emit OrderPaid(customer, merchant, token, amount, orderId, block.timestamp);
        return paymentId;
    }

    function receivePayment(
        address token,
        address merchant,
        uint256 amount,
        string memory orderId
    ) external nonReentrant returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        require(merchant != address(0), "Invalid merchant address");

        IERC20(token).transferFrom(msg.sender, merchant, amount);

        bytes32 paymentId = keccak256(abi.encodePacked(
            msg.sender, merchant, token, amount, orderId, block.timestamp
        ));

        payments[paymentId] = PaymentInfo({
            customer: msg.sender,
            merchant: merchant,
            token: token,
            amount: amount,
            orderId: orderId,
            timestamp: block.timestamp,
            processed: true,
            productId: 0,
            quantity: 0
        });

        emit OrderPaid(msg.sender, merchant, token, amount, orderId, block.timestamp);
        return paymentId;
    }

    // ================= VIEW FUNCTIONS =================

    function getProduct(uint256 productId) external view returns (Product memory) {
        require(productId > 0 && productId < _nextProductId, "Invalid product ID");
        return products[productId];
    }

    function getProductsByMerchant(address merchant) external view returns (uint256[] memory) {
        return merchantProducts[merchant];
    }

    function getActiveProductsByMerchant(address merchant) external view returns (uint256[] memory) {
        uint256[] memory allProducts = merchantProducts[merchant];
        uint256 activeCount = 0;
        
        // Count active products
        for (uint256 i = 0; i < allProducts.length; i++) {
            if (products[allProducts[i]].active) {
                activeCount++;
            }
        }
        
        // Create array of active products
        uint256[] memory activeProducts = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allProducts.length; i++) {
            if (products[allProducts[i]].active) {
                activeProducts[index] = allProducts[i];
                index++;
            }
        }
        
        return activeProducts;
    }

    function getPaymentInfo(bytes32 paymentId) external view returns (PaymentInfo memory) {
        return payments[paymentId];
    }

    function calculateProductTotal(uint256 productId, uint256 quantity) external view returns (uint256) {
        require(productId > 0 && productId < _nextProductId, "Invalid product ID");
        return products[productId].price * quantity;
    }

    function isProductAvailable(uint256 productId) external view returns (bool) {
        return productId > 0 && productId < _nextProductId && products[productId].active;
    }
}