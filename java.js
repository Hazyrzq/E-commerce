const header = document.querySelector("header");

// Menjadikan header "sticky" saat pengguna menggulir halaman ke bawah
window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", window.scrollY > 0);
});

// Fungsi utilitas untuk memformat angka menjadi Rupiah Indonesia
function formatToRupiah(amount) {
    return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

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
    const cartCount = document.getElementById('cart-count');
    const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
    cartCount.innerText = `${totalItems} items`;
}

// Fungsi untuk menampilkan item keranjang
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = ''; // Bersihkan terlebih dahulu
    Object.values(cart).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <div>
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.qty}</p>
                <p>Total Price: ${formatToRupiah(item.qty * item.price)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    totalPriceElement.innerText = formatToRupiah(getTotalCartPrice());
}

// Fungsi untuk menampilkan/menyembunyikan detail keranjang
function toggleCartDetails() {
    const cartDetails = document.getElementById('cart-details');
    cartDetails.style.display = cartDetails.style.display === 'none' ? 'block' : 'none';
}

// Fungsi untuk menyimpan laporan pembelian ke localStorage
function saveOrderReport(order) {
    let orderReports = JSON.parse(localStorage.getItem('orderReports')) || [];
    orderReports.push(order);
    localStorage.setItem('orderReports', JSON.stringify(orderReports));
}

// Fungsi untuk menampilkan/menyembunyikan form checkout
function toggleCheckoutForm() {
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    checkoutFormContainer.style.display = checkoutFormContainer.style.display === 'none' ? 'block' : 'none';
}

// Fungsi untuk menangani pengiriman pesanan
function submitOrder(event) {
    event.preventDefault(); // Mencegah pengiriman form default

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !phone || !address || Object.keys(cart).length === 0) {
        alert("Please fill all fields and add at least one item to your cart.");
        return;
    }

    // Simulasikan pemesanan dengan menampilkan detail di console atau alert
    console.log(`Order placed by ${name} with details - Phone: ${phone}, Address: ${address}`);
    console.log('Order items:', cart);

    const totalCartPrice = getTotalCartPrice();
    alert(`Terimakasih Telah Memesan! Total Price: ${formatToRupiah(totalCartPrice)}`);

    // Simpan laporan pembelian
    saveOrderReport({
        name,
        phone,
        address,
        cart,
        totalCartPrice: totalCartPrice,
        date: new Date().toISOString()
    });

    // Kosongkan keranjang dan hapus dari localStorage
    cart = {};
    localStorage.removeItem('cart');
    updateCartCount(); // Perbarui jumlah keranjang
    displayCartItems(); // Perbarui tampilan item keranjang yang sekarang kosong

    // Bersihkan form
    document.getElementById('checkout-form').reset();
    toggleCheckoutForm(); // Sembunyikan form setelah submit
}

// Fungsi untuk mendapatkan total harga keranjang
function getTotalCartPrice() {
    return Object.values(cart).reduce((total, item) => total + item.qty * item.price, 0);
}

// Fungsi untuk menampilkan produk
function displayProducts(filteredProducts = products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = ''; // Bersihkan terlebih dahulu
    filteredProducts.forEach(product => {
        productContainer.innerHTML += `<div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: ${formatToRupiah(product.price)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>`;
    });
}

// Fungsi untuk memuat kategori dari localStorage
function loadCategoriesFromStorage() {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : [];
}

// Fungsi untuk menampilkan filter kategori di halaman pengguna
function displayCategoryFilter() {
    const categories = loadCategoriesFromStorage();
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Opsi default

    categories.forEach(category => {
        categoryFilter.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });
}

// Fungsi untuk memfilter produk
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    let filteredProducts;
    if (categoryFilter === 'all') {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchInput)
        );
    } else {
        const categoryId = parseInt(categoryFilter, 10);
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchInput) && product.categoryId === categoryId
        );
    }

    displayProducts(filteredProducts);
}

// Pemanggilan fungsi untuk menampilkan filter kategori di halaman pengguna saat halaman dimuat
window.onload = function() {
    displayProducts(); // Tampilkan semua produk saat halaman dimuat
    updateCartCount();
    displayCartItems();
    displayCategoryFilter(); // Tampilkan filter kategori saat halaman dimuat
}
