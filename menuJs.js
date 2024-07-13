// DOM Elements
const listCartHTML = document.querySelector('.listCart');
const iconCart = document.querySelector('.icon-cart');
const iconCartSpan = document.querySelector('.icon-cart span');
const body = document.querySelector('body');
const closeCart = document.querySelector('.close');

// Data
let products = [];
let cart = [];

// Event Listeners
iconCart.addEventListener('click', () => body.classList.toggle('showCart'));
closeCart.addEventListener('click', () => body.classList.toggle('showCart'));

// Fetch Products and Initialize App
const initApp = async () => {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        addDataToHTML();

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            addCartToHTML();
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

// Add Data to HTML
const addDataToHTML = () => {
    const breakfastSection = document.getElementById('breakfastSection');
    const lunchSection = document.getElementById('lunchSection');
    const dinnerSection = document.getElementById('dinnerSection');

    breakfastSection.innerHTML = '';
    lunchSection.innerHTML = '';
    dinnerSection.innerHTML = '';

    const createProductElement = (product) => {
        const newProduct = document.createElement('div');
        newProduct.dataset.id = product.id;
        newProduct.classList.add('container');
        newProduct.innerHTML = `
            <img src="${product.image}" alt="" class="foodImage">
            <figcaption>${product.name}</figcaption>
            <div class="price">$${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
        return newProduct;
    };

    const appendProducts = (section, items) => {
        const fragment = document.createDocumentFragment();
        items.forEach(item => fragment.appendChild(createProductElement(item)));
        section.appendChild(fragment);
    };

    appendProducts(breakfastSection, products.filter(p => p.category === 'breakfast').slice(0, 6));
    appendProducts(lunchSection, products.filter(p => p.category === 'lunch').slice(0, 6));
    appendProducts(dinnerSection, products.filter(p => p.category === 'dinner').slice(0, 6));
};

// Add Product to Cart
const addToCart = (product_id) => {
    const existingProductIndex = cart.findIndex(item => item.product_id == product_id);
    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({ product_id, quantity: 1 });
    }
    updateCart();
};

// Update Cart in HTML and Memory
const updateCart = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    const fragment = document.createDocumentFragment();

    cart.forEach(item => {
        totalQuantity += item.quantity;
        const product = products.find(p => p.id == item.product_id);
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.dataset.id = item.product_id;
        newItem.innerHTML = `
            <div class="image"><img src="${product.image}"></div>
            <div class="name">${product.name}</div>
            <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
            <div class="quantity">
                <span class="minus"> + </span>
                <span>${item.quantity}</span>
                <span class="plus"> - </span>
            </div>`;
        fragment.appendChild(newItem);
    });

    listCartHTML.appendChild(fragment);
    iconCartSpan.innerText = totalQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Change Quantity in Cart
const changeQuantityCart = (product_id, type) => {
    const itemIndex = cart.findIndex(item => item.product_id == product_id);
    if (itemIndex >= 0) {
        if (type === 'plus') {
            cart[itemIndex].quantity++;
        } else {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        updateCart();
    }
};

// Event Delegation for Cart Quantity Change
listCartHTML.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('minus') || target.classList.contains('plus')) {
        const product_id = target.closest('.item').dataset.id;
        const type = target.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

// Event Listener for Adding to Cart
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        const product_id = event.target.closest('.container').dataset.id;
        addToCart(product_id);
    }
});
const checkOutButton = document.querySelector('.checkOut');

checkOutButton.addEventListener('click', () => {
    // Redirect to checkout page
    window.location.href = 'checkout.html';
});



// Initialize the Application
initApp();
