// Fungsi untuk menyimpan dan mengambil kategori dari localStorage
function saveCategoriesToStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function loadCategoriesFromStorage() {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : [];
}

// Awal mula, muat kategori dari localStorage
let categories = loadCategoriesFromStorage();

// Fungsi untuk menampilkan kategori
function displayCategories() {
    const categoryList = document.getElementById('category-list');
    const categorySelect = document.getElementById('product-category-select');
    categoryList.innerHTML = ''; // Bersihkan entri yang ada sebelumnya
    categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
    
    categories.forEach(category => {
        categoryList.innerHTML += `
            <div id="category-${category.id}">
                <span>${category.name}</span>
                <button onclick="editCategory(${category.id})">Edit</button>
                <button onclick="deleteCategory(${category.id})">Delete</button>
            </div>
        `;
        categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });
}

// Fungsi untuk menambah kategori baru
function addCategory() {
    const name = document.getElementById('new-category-name').value;
    const newId = categories.reduce((maxId, category) => Math.max(category.id, maxId), 0) + 1;

    categories.push({ id: newId, name });
    saveCategoriesToStorage(); // Simpan kategori baru ke localStorage
    displayCategories(); // Perbarui tampilan kategori di halaman admin
    displayCategoryFilter(); // Perbarui filter kategori di halaman pengguna
    document.getElementById('new-category-name').value = ''; // Reset input
}

// Fungsi untuk mengedit kategori
function editCategory(id) {
    const category = categories.find(c => c.id === id);
    const newName = prompt("Enter new category name", category.name);
    if (newName !== null) {
        category.name = newName;
        saveCategoriesToStorage(); // Simpan perubahan ke localStorage
        displayCategories(); // Perbarui tampilan kategori di halaman admin
        displayCategoryFilter(); // Perbarui filter kategori di halaman pengguna
    }
}

// Fungsi untuk menghapus kategori
function deleteCategory(id) {
    const index = categories.findIndex(c => c.id === id);
    categories.splice(index, 1);
    saveCategoriesToStorage(); // Simpan perubahan ke localStorage
    displayCategories(); // Perbarui tampilan kategori di halaman admin
    displayCategoryFilter(); // Perbarui filter kategori di halaman pengguna
}


// Fungsi untuk menyimpan dan mengambil produk dari localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

// Awal mula, muat produk dari localStorage
let products = loadProductsFromStorage();

// Fungsi untuk menambah produk
function addProduct() {
    const name = document.getElementById('new-product-name').value;
    const price = parseFloat(document.getElementById('new-product-price').value);
    const image = document.getElementById('new-product-image').files[0]; // Dapatkan file gambar yang diupload
    const categoryId = parseInt(document.getElementById('product-category-select').value, 10);
    const newId = products.reduce((maxId, product) => Math.max(product.id, maxId), 0) + 1;

    // Baca file gambar menggunakan FileReader
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result; // Dapatkan URL gambar yang akan disimpan

        // Tambahkan produk ke dalam array produk
        products.push({ id: newId, name, price, image: imageUrl, categoryId });

        // Simpan produk ke dalam localStorage
        saveProductsToStorage();

        // Perbarui tampilan produk
        displayProducts();

        // Reset form input
        document.getElementById('new-product-name').value = '';
        document.getElementById('new-product-price').value = '';
        document.getElementById('new-product-image').value = '';
        document.getElementById('product-category-select').value = '';
    };

    // Jika file gambar telah dipilih, baca sebagai URL
    if (image) {
        reader.readAsDataURL(image);
    }
}

// Fungsi untuk mengedit produk
function editProduct(id) {
    const product = products.find(p => p.id === id);
    const newName = prompt("Enter new product name", product.name);
    const newPrice = prompt("Enter new product price", product.price);
    const newCategoryId = parseInt(prompt("Enter new category ID", product.categoryId), 10);
    
    // Jika ada gambar yang baru diupload, proses seperti pada fungsi addProduct
    const newImage = document.getElementById('edit-product-image').files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const newImageUrl = event.target.result;

        if (newName !== null && newPrice !== null && newCategoryId !== null) {
            product.name = newName;
            product.price = parseFloat(newPrice);
            product.categoryId = newCategoryId;
            product.image = newImageUrl; // Update gambar produk

            saveProductsToStorage(); // Simpan perubahan ke localStorage
            displayProducts(); // Perbarui tampilan produk
        }
    };

    if (newImage) {
        reader.readAsDataURL(newImage); // Jika ada file gambar baru, baca sebagai URL
    } else {
        // Jika tidak ada gambar baru diupload, langsung simpan perubahan yang lain
        if (newName !== null && newPrice !== null && newCategoryId !== null) {
            product.name = newName;
            product.price = parseFloat(newPrice);
            product.categoryId = newCategoryId;

            saveProductsToStorage(); // Simpan perubahan ke localStorage
            displayProducts(); // Perbarui tampilan produk
        }
    }
}

// Fungsi untuk menampilkan produk pada halaman admin
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Bersihkan entri yang ada sebelumnya

    products.forEach(product => {
        const category = categories.find(cat => cat.id === product.categoryId);
        productList.innerHTML += `
            <div id="product-${product.id}">
                <h3>${product.name}</h3>
                <img src="${product.image}" alt="${product.name}" style="max-width: 200px; max-height: 200px;">
                <p>Price: $${product.price}</p>
                <p>Category: ${category ? category.name : 'Uncategorized'}</p>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        `;
    });
}


// Fungsi untuk menghapus produk
function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    products.splice(index, 1);
    saveProductsToStorage(); // Simpan perubahan ke localStorage
    displayProducts(); // Perbarui tampilan produk
}

// Fungsi untuk memuat laporan pesanan dari localStorage
function loadOrderReportsFromStorage() {
    const storedOrderReports = localStorage.getItem('orderReports');
    return storedOrderReports ? JSON.parse(storedOrderReports) : [];
}

// Fungsi untuk menampilkan laporan pesanan
function displayOrderReports(reports) {
    const reportList = document.getElementById('report-list');
    reportList.innerHTML = ''; // Bersihkan entri yang ada sebelumnya
    reports.forEach(report => {
        const orderDate = new Date(report.date).toLocaleString();
        reportList.innerHTML += `
            <div>
                <h4>Order by ${report.name}</h4>
                <p>Phone: ${report.phone}</p>
                <p>Address: ${report.address}</p>
                <p>Date: ${orderDate}</p>
                <h5>Items:</h5>
                ${Object.values(report.cart).map(item => `
                    <p>${item.name} - Quantity: ${item.qty} - Total: $${item.qty * item.price}</p>
                `).join('')}
            </div>
        `;
    });
}

// Fungsi untuk mencari laporan pesanan berdasarkan nama
function searchOrderReports() {
    const searchTerm = document.getElementById('search-term').value.toLowerCase();
    const orderReports = loadOrderReportsFromStorage();
    const filteredReports = orderReports.filter(report => 
        report.name.toLowerCase().includes(searchTerm)
    );
    displayOrderReports(filteredReports);
}

// Muat dan tampilkan kategori, produk, serta laporan pesanan saat halaman dimuat
window.onload = function() {
    displayCategories();
    displayProducts();
    displayOrderReports(loadOrderReportsFromStorage());
    displayCategoryFilter(); // Pastikan fungsi ini diimplementasikan jika diperlukan
}
