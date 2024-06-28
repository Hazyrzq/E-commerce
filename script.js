// Fungsi untuk memuat produk dari localStorage
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

let products = loadProductsFromStorage();

// Menggunakan localStorage untuk menyimpan dan memuat keranjang
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : {};
}

let cart = loadCartFromStorage(); // Muat keranjang dari localStorage atau mulai dengan keranjang kosong

// Fungsi untuk menambahkan ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (cart[productId]) {
        cart[productId].qty += 1;
    } else {
        cart[productId] = { ...product, qty: 1 };
    }
    saveCartToStorage(); // Simpan keranjang ke localStorage
    updateCartCount(); // Perbarui jumlah keranjang
    displayCartItems(); // Perbarui tampilan item keranjang
}

// Fungsi untuk mengurangi kuantitas barang dalam keranjang
function removeFromCart(productId) {
    if (cart[productId]) {
        if (cart[productId].qty > 1) {
            cart[productId].qty -= 1;
        } else {
            delete cart[productId];
        }
        saveCartToStorage(); // Simpan perubahan ke localStorage
        updateCartCount(); // Perbarui jumlah keranjang
        displayCartItems(); // Perbarui tampilan item keranjang
    }
}

// Fungsi untuk memperbarui jumlah keranjang
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
    cartCount.innerText = totalItems;
}

// Fungsi untuk menampilkan item keranjang
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItem');
    cartItemsContainer.innerHTML = ''; // Bersihkan terlebih dahulu
    Object.values(cart).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.qty}</p>
                    <p>Total Price: Rp ${(item.qty * item.price).toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    updateTotalPrice();
    toggleCheckoutButton();
}

// Fungsi untuk memperbarui total harga
function updateTotalPrice() {
    const total = Object.values(cart).reduce((acc, item) => acc + item.qty * item.price, 0);
    document.getElementById('total').innerText = `Rp ${total.toFixed(2)}`;
}

// Fungsi untuk mengaktifkan/menonaktifkan tombol checkout
function toggleCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = Object.keys(cart).length === 0;
}

// Fungsi untuk menampilkan form checkout
function showCheckoutForm() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';
}

// Fungsi untuk menutup form checkout
function closeCheckoutForm() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'none';
}

// Fungsi untuk menangani pengiriman pesanan
function submitOrder(event) {
    event.preventDefault(); // Mencegah pengiriman form default

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;

    if (!name || !address || !phone || Object.keys(cart).length === 0) {
        alert("Please fill all fields and add at least one item to your cart.");
        return;
    }

    // Simulasikan pemesanan dengan menampilkan detail di console atau alert
    console.log(`Order placed by ${name} with details - Phone: ${phone}, Address: ${address}`);
    console.log('Order items:', cart);

    alert("Thank you for your order!");

    // Simpan laporan pembelian
    saveOrderReport({
        name,
        address,
        phone,
        cart,
        date: new Date().toISOString()
    });

    // Kosongkan keranjang dan hapus dari localStorage
    cart = {};
    localStorage.removeItem('cart');
    updateCartCount(); // Perbarui jumlah keranjang
    displayCartItems(); // Perbarui tampilan item keranjang yang sekarang kosong

    // Bersihkan form
    document.getElementById('checkoutForm').reset();
    closeCheckoutForm(); // Sembunyikan form setelah submit
}

// Fungsi untuk menyimpan laporan pembelian ke localStorage
function saveOrderReport(order) {
    let orderReports = JSON.parse(localStorage.getItem('orderReports')) || [];
    orderReports.push(order);
    localStorage.setItem('orderReports', JSON.stringify(orderReports));
}

// Fungsi untuk menampilkan produk
function displayProducts() {
    const productContainer = document.getElementById('root');
    productContainer.innerHTML = ''; // Bersihkan terlebih dahulu
    products.forEach(product => {
        productContainer.innerHTML += `<div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>`;
    });
}

// Pemanggilan fungsi untuk menampilkan produk dan memperbarui keranjang saat halaman dimuat
window.onload = function() {
    displayProducts(); // Tampilkan semua produk saat halaman dimuat
    updateCartCount(); // Perbarui jumlah keranjang
    displayCartItems(); // Perbarui tampilan item keranjang
};

// Event listeners untuk checkout modal
document.getElementById('checkoutBtn').addEventListener('click', showCheckoutForm);
document.getElementById('confirmBtn').addEventListener('click', submitOrder);
document.querySelector('.close').addEventListener('click', closeCheckoutForm);
