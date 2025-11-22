export const DEMO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>E-Shop Checkout</title>
    <style>
        .error { color: red; display: none; }
        .success { color: green; display: none; }
    </style>
</head>
<body>
    <h1>Secure Checkout</h1>
    
    <div id="cart-summary">
        <h2>Cart Summary</h2>
        <div class="item">
            <span>Wireless Headphones</span>
            <input type="number" id="qty-headphones" value="1" min="1">
            <span class="price" data-price="100">$100.00</span>
        </div>
        <div class="item">
            <span>USB-C Cable</span>
            <input type="number" id="qty-cable" value="2" min="1">
            <span class="price" data-price="15">$15.00</span>
        </div>
        
        <div class="discount-section">
            <input type="text" id="discount-code" placeholder="Enter code">
            <button id="apply-discount-btn">Apply</button>
            <span id="discount-msg"></span>
        </div>
        
        <h3>Total: $<span id="total-price">130.00</span></h3>
    </div>

    <form id="checkout-form">
        <h2>Shipping Details</h2>
        <input type="text" id="full-name" required placeholder="Full Name">
        <input type="email" id="email" required placeholder="Email Address">
        <span id="email-error" class="error">Invalid email address</span>
        
        <h3>Shipping Method</h3>
        <label><input type="radio" name="shipping" value="standard" checked> Standard (Free)</label>
        <label><input type="radio" name="shipping" value="express"> Express (+$10)</label>

        <h3>Payment</h3>
        <label><input type="radio" name="payment" value="cc" checked> Credit Card</label>
        <label><input type="radio" name="payment" value="paypal"> PayPal</label>

        <button type="submit" id="pay-now-btn" style="background-color: green; color: white;">Pay Now</button>
    </form>
    <div id="payment-success" class="success">Payment Successful!</div>
</body>
</html>`;

export const DEMO_DOC_SPECS = `# Product Specifications: E-Shop Checkout

## 1. Pricing & Cart
- Base prices: Headphones ($100), USB-C Cable ($15).
- Total price updates dynamically based on quantity.

## 2. Discount Codes
- Code "SAVE15": Applies a 15% discount to the subtotal.
- Code "FREESHIP": Waives shipping fees (if applicable).
- Invalid codes should show "Invalid Code" error message.

## 3. Shipping
- Standard Shipping: Free, 5-7 business days.
- Express Shipping: Flat rate of $10, 1-2 business days.
- Shipping cost is added to the Total.

## 4. Form Validation
- Email must contain "@" and ".".
- Name cannot be empty.
- If validation fails, show inline error messages in red.

## 5. Payment Flow
- Clicking "Pay Now" triggers validation.
- If valid, hide form and show "Payment Successful!" message.
`;

export const DEMO_DOC_UI = `UI/UX Guidelines
1. Error messages must be strictly red (#FF0000).
2. Success messages must be green.
3. The "Pay Now" button must always be visible.
4. Layout must be single column on mobile.
`;
