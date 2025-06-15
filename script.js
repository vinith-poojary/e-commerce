// ✅ Step 1: Store products globally
productsData = [
    { id: 1, name: "Camera", image: "images/camera.jpg", price: 199.99 },
    { id: 2, name: "Headphone", image: "images/headphone.jpg", price: 59.99 },
    { id: 3, name: "Laptop", image: "images/laptop.jpg", price: 999.00 },
    { id: 4, name: "Smartphone", image: "images/smartphone.jpg", price: 499.99 }
];

// Display all products on page load
// Attach event to the Checkout button after the page loads
window.onload = function () {
    displayProducts(productsData);

    const checkoutButton = document.getElementById("checkoutButton");
    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            alert(`Thank you for your purchase! Total: $${calculateTotal().toFixed(2)}`);
            cart = []; // Clear cart
            updateCartUI(); // Refresh the cart display
        }
    });
};

 // Store fetched products globally

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response; // Don't cache partial responses
            }
            let responseClone = response.clone();
            caches.open('my-cache').then(cache => {
                cache.put(event.request, responseClone);
            });
            return response;
        }).catch(() => caches.match(event.request))
    );
});



// ✅ Step 3: Function to display products
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear previous products

    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

function searchProducts() {
    const query = document.getElementById("searchBox").value.toLowerCase();
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; // Clear previous results

    console.log("Search Query:", query); // Debugging log

    if (!Array.isArray(productsData) || productsData.length === 0) {
        console.error("Product data is empty or not loaded yet.");
        searchResults.innerHTML = "<p>Products not loaded. Please refresh the page.</p>";
        return;
    }

    const filteredProducts = productsData.filter(product => 
        product.name.toLowerCase().includes(query)
    );

    console.log("Filtered Products:", filteredProducts); // Debugging log

    if (filteredProducts.length === 0) {
        searchResults.innerHTML = "<p>No products found.</p>";
        return;
    }

    filteredProducts.forEach(product => {
        const resultDiv = document.createElement("div");
        resultDiv.className = "search-item";
        resultDiv.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.image}" alt="${product.name}">
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        searchResults.appendChild(resultDiv);
    });
}
let cart = [];

function addToCart(productId) 
{
    const product = productsData.find(p => p.id === productId);
    if (product) 
    {
        cart.push(product);
        updateCartUI();
        alert(`${product.name} has been added to your cart!`);
    }
}


function updateCartUI() {
    const cartList = document.getElementById("cart-list");
    const totalPriceElem = document.getElementById("totalPrice");
    cartList.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        cartList.appendChild(li);
        total += item.price;
    });

    totalPriceElem.textContent = `Total: $${total.toFixed(2)}`;
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Thank you for your purchase! Total: $${calculateTotal().toFixed(2)}`);
}
