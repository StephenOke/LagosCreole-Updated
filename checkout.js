document.addEventListener('DOMContentLoaded', async () => {
    const checkoutCart = document.querySelector('.checkoutCart');
    const totalAmount = document.querySelector('.totalAmount');
    const statetax = document.querySelector('.statetax');
    const citytax = document.querySelector('.citytax');

    // Fetch products data
    let products = [];
    try {
        const response = await fetch('products.json');
        products = await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    // Retrieve cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart'));
    let total = 0;
    let nyctax = 0;
    let nytax =0;

    if (cart && cart.length > 0) {
        cart.forEach(item => {
            const product = products.find(p => p.id == item.product_id); // Assuming products are accessible
            const cartItem = document.createElement('div');
            cartItem.classList.add('item');
            cartItem.innerHTML = `
                <div class="image"><img src="${product.image}" alt="${product.name}"></div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
                <div class="quantity">${item.quantity}</div>`;
            checkoutCart.appendChild(cartItem);
            total += product.price * item.quantity;
            
        });
            nyctax = total * 0.045;
            nytax = total * 0.040;
        totalAmount.innerText = `Total: $${(total+nyctax+nytax).toFixed(2)}`;
        statetax.innerText = `NY Food Tax: $${nyctax.toFixed(2)}`;
        citytax.innerText = `NYC Sales Tax: $${nytax.toFixed(2)}`; 
    } else {
        checkoutCart.innerHTML = '<p>Your cart is empty.</p>';
    }

    

   // Event listener for confirming the purchase
   document.querySelector('.confirmPurchase').addEventListener('click', () => {
    const form = document.querySelector('.checkoutForm');
    if (form.checkValidity()) {
        // Logic to handle the purchase
        // For now, just clear the cart and redirect to a success page
        localStorage.removeItem('cart');
        window.location.href = 'success.html';
    } else {
        alert('Please fill out all required fields.');
    }
    });
});