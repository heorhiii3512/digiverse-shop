const products = [
    {
        "id": 7,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 8,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 9,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 10,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    }, {
        "id": 11,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    }, {
        "id": 12,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 13,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 14,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 15,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 16,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 17,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 18,
        "name": "Ноутбук",
        "price": 29900,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
];

const cartmain=document.querySelector('.cartmain');
const container = document.getElementById('productcontainer');
const blockcont = document.getElementById('main_block');
const block = document.querySelector('.block');
const wishlist_h = document.getElementById('wishes');
const addtocartbutton = document.querySelectorAll('.add-to-cart');
let objects_in_cart=0;
const main_page = document.querySelector('.logo');
main_page.addEventListener('click', function () {
    window.location.href = 'index.html';
});

products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product');
    card.innerHTML = `
        <img class="product-img" src="${product.image}" alt="${product.name}">
        <p class="productname" >${product.name}</p>
        <p class="price" >${product.price} грн</p>
        <p class="add-to-cart" id="${product.id}"></p>
    `;
    container.appendChild(card);
});

const rec = [
    {
        "id": 1,
        "name": "object",
        "price": 10000,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 2,
        "name": "object",
        "price": 10000,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 3,
        "name": "object",
        "price": 10000,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 4,
        "name": "object",
        "price": 10000,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 5,
        "name": "object",
        "price": 10000,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    },
    {
        "id": 6,
        "name": "object",
        "price": 10000,
        "image": "images/457457_1dlyarabotiiuchebi.webp",
    }
];

const s = document.getElementById('sugestions');

rec.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product');
    card.innerHTML = `
        <img class="product-img" src="${product.image}" alt="${product.name}">
        <p class="productname" >${product.name}</p>
        <p class="price" > ${product.price} грн</p>
        <p class="add-to-cart" id="${product.id}"></p>
    `;
    s.appendChild(card);
});

const cardbutton = document.querySelector('.cardbutton');
cardbutton.addEventListener('click', function () {
    window.location.href = 'cart.html';
});

let favorites = document.querySelector('.favorites');

const favbutton = document.querySelector('.favbutton');
favbutton.addEventListener('click', function () {
    if (favorites.style.display === 'none' || favorites.style.display === '') {
        favorites.style.display = 'flex';
        block.style.display = 'none';
    }
});

wishlist_h.innerHTML = 'Ви ще нічого не обрали';

for (let i = 0; i < products.length; i++) {
    let carttest = document.getElementById(products[i].id);
    carttest.addEventListener('click',add_to_cart);
};

for (let i = 0; i < rec.length; i++) {
    let carttest = document.getElementById(rec[i].id);
    carttest.addEventListener('click', add_to_cart);
};

function add_to_cart(){
    objects_in_cart+=1;
    alert(`${objects_in_cart}`);
    cartmain.innerHTML = objects_in_cart;
};