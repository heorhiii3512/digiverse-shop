//elemnets
const blockcont = document.getElementById('main_block');
const block = document.querySelector('.block');
const addtocartbutton = document.querySelectorAll('.add-to-cart');
const favorites = document.querySelector('.favorites');

const favbutton = document.querySelector('.favbutton');
const cartbutton = document.querySelector('.cartbutton');

const wishlist = document.querySelector('.wishlist');
const wishlist_title = document.getElementById('wishlist-title');

let products = [];

//main page when logo clicked
const main_page = document.querySelector('.logo');
main_page.addEventListener('click', function () {
    window.location.href = 'index.html';
});

async function getProducts() {
    let response = await fetch("data.json");
    products = await response.json();
    return products;
};

function renderProducts() {
    let textRec = document.getElementById('recomend');
    let textList = document.getElementById('all-products');
    let split = document.getElementById('delim');

    split.style.display = "flex";

    textRec.innerHTML = 'Рекомендації';
    textList.innerHTML = 'Усі товари';

    let productsList = document.getElementById('productcontainer');
    let sugestions = document.getElementById('sugestions');
    if (!productsList || !sugestions) return;
    products.forEach(product => {
        if (product.isRecommended) {
            sugestions.innerHTML += getCardHTML(product);
        }
        productsList.innerHTML += getCardHTML(product);
    });
}

function buttonsReboot() {
    products.forEach(product => {
        const wishBtn = document.getElementById(`wish-${product.id}`);
        if (wishBtn) {
            wishBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                const index = storedWishlist.findIndex(item => item.id === product.id);
                wishBtn.classList.remove('animate');
                void wishBtn.offsetWidth;
                wishBtn.classList.add('animate');
                if (index !== -1) {
                    remove_from_wishlist_function(product);
                    wishBtn.classList.remove('active');
                } else {
                    add_to_wishlist_function(product);
                    wishBtn.classList.add('active');
                }
            });
        }
    });

    //
    let productCard = document.querySelectorAll('.product');
    if (productCard) {
        productCard.forEach(card => {
            card.addEventListener('click', (e) => {
                if (
                    e.target.classList.contains('add-to-cart') ||
                    e.target.classList.contains('add-to-wish')
                ) {
                    return;
                }

                const productId = card.dataset.id;
                openProducts(Number(productId));
            });
        });

    };

    //add to cart
    let buyButtons = document.querySelectorAll('.add-to-cart');
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(e);
            });

            button.classList.add('active');
        });
    };
};

getProducts().then(function (productsData) {
    products = productsData;

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (document.getElementById('productcontainer')) {
        if (searchQuery) {
            document.querySelector('#searchInput').value = searchQuery;
            searchProducts();
        } else {

            renderProducts();
        }
        buttonsReboot();
        loadWishlist();
    }

    renderSingleProduct();
});

function getCardHTML(product) {
    return ` <div class="product" data-id="${product.id}">
                <img class="product-img" src="${product.image}" alt="${product.name}">
                <p class="productname">${product.name}</p>
                <p class="price">${product.price} ₴</p>
                <div class="buttons-wrapper">
                    <p class="add-to-wish" id="wish-${product.id}"></p>
                    <p class="add-to-cart" data-id="${product.id}" id="cart-${product.id}"></p>
                </div>
            </div>
    `
};

//wishlist
if (favbutton) {
    favbutton.addEventListener('click', open_favorites);
}

function open_favorites() {
    if (favorites.style.display === 'none' || favorites.style.display === '') {
        favorites.style.display = 'flex';
        block.style.display = 'none';
        favbutton.style.display = 'none';
    } else {
        favorites.style.display = 'none';
        block.style.display = 'flex';
        favbutton.style.display = 'flex';
    }
};

function add_to_wishlist_function(product) {
    let storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (storedWishlist.some(item => item.id === product.id)) {
        return;
    }
    storedWishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
    const card = document.createElement('div');
    card.classList.add('wishes');
    card.dataset.id = product.id;
    card.innerHTML = `
        <img class="wishes-img" src="${product.image}">
        <p class="wishes-txt">${product.name}</p>
        <div class="blockcont">
            <p class="in-wish-buy" data-id="${product.id}">Додати у кошик</p>
            <p class="in-wish-delete">Видалити товар</p>
        </div>
    `;
    // Дозволяємо перехід на сторінку товару при кліку на картку (крім кнопок видалення/купівлі)
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('in-wish-buy') || e.target.classList.contains('in-wish-delete')) {
            return; // якщо клікнули на кнопки, нічого не робимо
        }
        openProducts(product.id);
    });
    wishlist.appendChild(card);

    wishlist_title.textContent = "Обрані товари";
};

function remove_from_wishlist_function(product) {
    const card = wishlist.querySelector(`.wishes[data-id="${product.id}"]`);

    let storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    storedWishlist = storedWishlist.filter(item => item.id != product.id);
    localStorage.setItem('wishlist', JSON.stringify(storedWishlist));

    card.remove();

    if (storedWishlist.length === 0) {
        wishlist_title.textContent = 'Ви ще нічого не обрали';
    }
};

function loadWishlist() {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    storedWishlist.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('wishes');
        card.dataset.id = product.id;

        card.innerHTML = `
            <img class="wishes-img" src="${product.image}" alt="${product.name}">
            <p class="wishes-txt">${product.name}</p>
            <div class="blockcont">
                <p class="in-wish-buy" data-id="${product.id}">Додати у кошик</p>
                <p class="in-wish-delete">Видалити товар</p>
            </div>
        `;
        // Дозволяємо перехід на сторінку товару при кліку на картку (крім кнопок видалення/купівлі)
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('in-wish-buy') || e.target.classList.contains('in-wish-delete')) {
                return; // якщо клікнули на кнопки, нічого не робимо
            }
            openProducts(product.id);
        });
        wishlist.appendChild(card);

        const btn = document.getElementById(`wish-${product.id}`);
        if (btn) btn.classList.add('active');
    });
    if (storedWishlist.length > 0) {
        wishlist_title.textContent = "Обрані товари";
    } else {
        wishlist_title.textContent = "Ви ще нічого не обрали";
    }
};

if (wishlist) {
    wishlist.addEventListener('click', (e) => {
        if (e.target.classList.contains('in-wish-buy')) {
            addToCart(e);
            return;
        }
        if (e.target.classList.contains('in-wish-delete')) {
            const card = e.target.closest('.wishes');
            const productId = card.dataset.id;

            let storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            storedWishlist = storedWishlist.filter(item => item.id != productId);
            localStorage.setItem('wishlist', JSON.stringify(storedWishlist));

            const mainWishBtn = document.getElementById(`wish-${productId}`);
            if (mainWishBtn) {
                mainWishBtn.classList.remove('active');
            }

            card.classList.add('remove');
            setTimeout(() => {
                card.remove();
                if (storedWishlist.length === 0) {
                    wishlist_title.textContent = 'Ви ще нічого не обрали';
                }
            }, 300);
        }
    });
}

//cart
if (cartbutton) {
    cartbutton.addEventListener('click', function () {
        window.location.href = "cart.html";
    });
}

function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return '';
};

function addToCart(event) {
    const id = event.target.dataset.id;
    const product = products.find(p => p.id == id);
    if (!product) return;
    cart.addItem(product);
    renderCart();
    messageCart(product);
};

class ShoppingCart {
    constructor() {
        this.items = {};
        this.total = 0;
    };
    addItem(item) {
        if (this.items[item.id]) {
            this.items[item.id].quantity += 1;
        } else {
            this.items[item.id] = item;
            this.items[item.id].quantity = 1;
        }
        this.saveCartToCookies();
    };
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON};max-age=${60 * 60 * 24 * 7}; path=/`
    }

    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
        }
    }

    removeItem(itemId) {
        if (this.items[itemId]) {
            delete this.items[itemId];
            this.saveCartToCookies();
        }
    }
};

let cart = new ShoppingCart;

cart.loadCartFromCookies();
const orderButton = document.querySelector('.submit-buy');

if (orderButton) {
    orderButton.addEventListener('click', function () {
        let orderDetails = document.querySelector('.ordering-submit');
        orderDetails.style.display = "flex";
    });
};

const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cart_main_container = document.querySelector('.cartmain');

if (cartItemsContainer && cartTotal) {
    renderCart();
}

function renderCart() {
    if (!cartItemsContainer || !cartTotal) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    const items = Object.values(cart.items);

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p>Кошик порожній</p>';
        cartTotal.textContent = '';
        orderButton.style.display = "none";
        return;
    } else {
        orderButton.style.display = "flex";
    }

    items.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.image}" width="60">
            <p>${item.name}</p>
            <p>${item.price} ₴</p>
            <p class="cart-item-quantity">Кількість: ${item.quantity}</p>
            <button class="remove-item" data-id="${item.id}">Видалити</button>
        `;

        // Додаємо клік для переходу на сторінку товару
        div.addEventListener('click', (e) => {
            // Перевіряємо, щоб клік був не по кнопці "Видалити"
            if (e.target.classList.contains('remove-item')) return;
            openProducts(item.id);
        });
        cartItemsContainer.appendChild(div);
    });
    cartTotal.textContent = `Разом: ${total} ₴`;
};

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
        const productId = e.target.dataset.id;
        cart.removeItem(productId);
        renderCart();
    }
});

//searchbar
function searchProducts(event) {
    if (event) event.preventDefault();

    let query = document.querySelector('#searchInput').value.toLowerCase().trim();
    let productsList = document.getElementById('productcontainer');

    // ПЕРЕВІРКА: Якщо ми НЕ на головній сторінці (де немає списку товарів)
    if (!productsList) {
        // Перенаправляємо на головну з параметром пошуку в URL
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
        return;
    }

    // ЛОГІКА ДЛЯ ГОЛОВНОЇ СТОРІНКИ
    let sugestions = document.getElementById('sugestions');
    let recomend = document.getElementById('recomend');
    let spliter = document.querySelector('.spliter');
    let textList = document.getElementById('all-products');

    if (!query) {
        // Якщо пошук порожній — повертаємо все як було
        if (recomend) recomend.style.display = 'block';
        if (sugestions) sugestions.style.display = 'flex';
        if (spliter) spliter.style.display = 'block';
        if (textList) textList.innerHTML = 'Усі товари';

        productsList.innerHTML = '';
    } else {
        // Ховаємо зайве
        if (recomend) recomend.style.display = 'none';
        if (sugestions) sugestions.style.display = 'none';
        if (spliter) spliter.style.display = 'none';
        if (textList) textList.innerHTML = `Результати пошуку: "${query}"`;

        let filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );

        productsList.innerHTML = '';
        if (filteredProducts.length === 0) {
            productsList.innerHTML = '<p>Нічого не знайдено</p>';
        } else {
            filteredProducts.forEach(product => {
                productsList.innerHTML += getCardHTML(product);
            });
        }
    }
    buttonsReboot();
}

let searchForm = document.querySelector('#searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', searchProducts);
}

//tool buttons
let onOther = false;

//новинки 
function newProducts() {
    onOther = true;
    let split = document.getElementById('delim');
    let textRec = document.getElementById('recomend');
    let textList = document.getElementById('all-products');
    split.style.display = "none";
    textList.innerHTML = '';
    textRec.innerHTML = '';

    let productsList = document.getElementById('productcontainer');
    let sugestions = document.getElementById('sugestions');

    productsList.innerHTML = '';
    sugestions.innerHTML = '';
    productsList.innerHTML += '<p class="rectext">Новинки</p>';
    products.forEach(product => {
        if (product.isNewProduct) {
            productsList.innerHTML += getCardHTML(product);
        };
    });

    buttonsReboot();

    loadWishlist();
};

//усі товари
function allProducts() {
    if (onOther) {
        let productsList = document.getElementById('productcontainer');
        productsList.innerHTML = '';
        renderProducts();
        buttonsReboot();
        loadWishlist();
        onOther = false;
    }
    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
};

//акції

function actionAndSales() {
    onOther = true;
    let split = document.getElementById('delim');
    let textRec = document.getElementById('recomend');
    let textList = document.getElementById('all-products');
    split.style.display = "none";
    textList.innerHTML = '';
    textRec.innerHTML = '';
    let productsList = document.getElementById('productcontainer');
    let sugestions = document.getElementById('sugestions');

    productsList.innerHTML = '';
    sugestions.innerHTML = '';

    productsList.innerHTML += '<p class="rectext">Акції та знижки</p>';
    products.forEach(product => {
        if (product.onSale) {
            productsList.innerHTML += getCardHTML(product);
        };
    });

    buttonsReboot();

    loadWishlist();
};
const actionBtn = document.getElementById('actionAndSales');
const allProdBtn = document.getElementById('allProducts');
const newProdBtn = document.getElementById('newProducts');

if (actionBtn && allProdBtn && newProdBtn) {
    actionBtn.addEventListener('click', actionAndSales);
    allProdBtn.addEventListener('click', allProducts);
    newProdBtn.addEventListener('click', newProducts);
}

//dynamic upper
let lastScrollTop = 0;
const upper = document.querySelector('.upper');

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        upper.classList.add('hidden');
    } else {
        upper.classList.remove('hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

function messageCart(product) {
    let message = document.querySelector('.message');
    let info = document.getElementById('info-block');
    info.innerHTML = `
    <div class="blockcont">
        <img class="info-image" src="${product.image}">
        <p>${product.name}</p>
        <p class="price" >${product.price} ₴</p>
    </div>
    `;
    message.style.display = "flex";
    document.getElementById('overlay').classList.add('show');

    setTimeout(() => {
        messageHiddenCart();
    }, 3000);
};

function messageHiddenCart() {
    let message = document.querySelector('.message');
    let overlay = document.getElementById('overlay');

    message.style.display = "none";
    overlay.classList.remove('show');

    let info = document.getElementById('info-block');
    if (info) info.innerHTML = '';
};

//show 
function openProducts(productId) {
    window.location.href = `object.html?id=${productId}`;
};

async function renderSingleProduct() {
    const productView = document.getElementById('product-view');
    if (!productView) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const product = products.find(p => p.id === productId);

    if (product) {
        productView.innerHTML = `
        <div class="main-container" id="container-product-view">
            <div class="blockcont">
                <img class="inner-photo" src="${product.image}">
                <p class="description"><strong>Характеристики</strong></p>
                
                ${product.memory ? `<p class="description">Пам'ять: <span class="value">${product.memory} GB</span></p>` : ''}
                ${product.ram ? `<p class="description">ОЗП: <span class="value">${product.ram} GB </span></p>` : ''}
                ${product.display ? `<p class="description">Дисплей: <span class="value">${product.display}</span></p>` : ''}
                ${product.cpu ? `<p class="description">Процесор: <span class="value">${product.cpu}</span></p>` : ''}
                ${product.year ? `<p class="description">Рік: <span class="value">${product.year}</span></p>` : ''}
                ${product.bluetooth ? `<p class="description">Bluetooth: <span class="value">${product.bluetooth}</span></p>` : ''}
            
            </div>
            
            <div class="blockcont" id="inner-second">    
                <h1 class="inner-header">${product.name}</h1>
                <p class="inner-price">${product.price} ₴</p> 
                <p class="inner-buy" data-id="${product.id}">Купити</p>
            </div>
        </div>
        `;

        // Знаходимо щойно створену кнопку і вішаємо на неї подію
        const buyBtn = productView.querySelector('.inner-buy');
        if (buyBtn) {
            buyBtn.addEventListener('click', (e) => {
                addToCart(e); // Ця функція вже містить логіку додавання в кошик і показ messageCart
            });
        }
    }
}

document.addEventListener('click', function (e) {
    // Якщо натиснули на кнопку "Ок"
    if (e.target && e.target.classList.contains('ok-button')) {
        messageHiddenCart();
    }

    // Також закриваємо, якщо клікнули на сірий фон (overlay)
    if (e.target && e.target.id === 'overlay') {
        messageHiddenCart();
    }
});


// Знаходимо кнопку підтвердження замовлення
let buySubmitButton = document.querySelector('.buy-submit-button');

if (buySubmitButton) {
    buySubmitButton.addEventListener('click', function (e) {
        e.preventDefault(); // Запобігаємо перезавантаженню сторінки

        // Отримуємо всі текстові поля та селекти з форми оформлення
        const orderForm = document.querySelector('.ordering-submit');
        const inputs = orderForm.querySelectorAll('input[required], input[type="text"], input[type="tel"]');

        let isFormValid = true;

        // Проста валідація: перевіряємо, чи всі поля заповнені
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                isFormValid = false;
                input.style.borderColor = "red"; // Підсвічуємо порожнє поле
            } else {
                input.style.borderColor = "#ccc"; // Повертаємо нормальний колір
            }
        });

        if (isFormValid) {
            showSuccessOrderMessage();

            // 2. Очищаємо кошик
            cart.items = {};
            cart.saveCartToCookies();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        } else {
            alert("Будь ласка, заповніть усі необхідні поля для оформлення замовлення!");
        }
    });
}

// Допоміжна функція для виведення повідомлення про успішне замовлення
function showSuccessOrderMessage() {
    let message = document.querySelector('.message');
    let info = document.getElementById('info-block');
    let overlay = document.getElementById('overlay');
    if (info) {
        info.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: green;">Замовлення прийнято!</h2>
                <p>Дякуємо за покупку</p>
            </div>
        `;
    }

    if (message) message.style.display = "flex";
    if (overlay) overlay.classList.add('show');
}