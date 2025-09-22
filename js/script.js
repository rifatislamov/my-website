// Каталог товаров
const products = [
  { 
    name: "Dream Lite", 
    price: 37000, 
    desc: "Блок независимых пружин 500 шт/сп. место, гарантия 2 года, нагрузка 110 кг, высота 18 см", 
    old: 62000, 
    img: "images/lite.jpg"
  },
  { 
    name: "Dream Relax", 
    price: 95000, 
    desc: "Блок независимых пружин 500 шт/сп. место, гарантия 3 года, нагрузка 130 кг, высота 20 см", 
    old: 158000, 
    img: "images/relax.jpg"
  },
  { 
    name: "Dream Mix", 
    price: 115000, 
    desc: "Блок независимых пружин 500 шт/сп. место, гарантия 3 года, нагрузка 120 кг, высота 21 см", 
    old: 140000, 
    img: "images/mix.jpg"
  },
  { 
    name: "Dream Memory", 
    price: 135000, 
    desc: "Тип: беспружинный.Гарантия: 5 лет.Нагрузка на сп. место: 150 кг.Общая высота: 23 см.", 
    old: 180000, 
    img: "images/memory.jpg"
  }
];


// Загружаем корзину из localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Рендер товаров
function renderProducts() {
  const list = document.getElementById("product-list");
  const sort = document.getElementById("sort")?.value || "";
  const search = document.getElementById("search")?.value.toLowerCase() || "";

  let filtered = products.filter(p => p.name.toLowerCase().includes(search));

  if (sort === "cheap") filtered.sort((a,b)=>a.price-b.price);
  if (sort === "expensive") filtered.sort((a,b)=>b.price-a.price);

  list.innerHTML = filtered.map((p,i)=>`
    <div class="product">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p class="price"><s>${p.old.toLocaleString()} тг</s> ${p.price.toLocaleString()} тг</p>
      <button onclick="addToCart(${i})" class="add-to-cart">Добавить в корзину</button>
    </div>
  `).join("");
}

function addToCart(index) {
  const existing = cart.find(item => item.name === products[index].name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...products[index], quantity: 1 });
  }
  updateCart();
  showNotification("Товар добавлен в корзину ✅");
}

// Рендер корзины
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCountEl = document.querySelectorAll(".cart-count");
  const cartTotal = document.getElementById("cart-total");
  const deliverySelect = document.getElementById("delivery");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty-cart'>🛒 Корзина пуста</p>";
    cartCountEl.forEach(el => el.textContent = 0);
    cartTotal.textContent = "Итого: 0 тг";
    saveCart();
    return;
  }

  cart.forEach((item, i) => {
    total += item.price * item.quantity;
    count += item.quantity;
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <strong>${item.name}</strong><br>
          ${item.price.toLocaleString()} тг
        </div>
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${i}, this.value)">
        <button onclick="removeFromCart(${i})">❌</button>
      </div>
    `;
  });

  const deliveryCost = parseInt(deliverySelect?.value || 0);
  cartCountEl.forEach(el => el.textContent = count);
  cartTotal.textContent = `Итого: ${(total + deliveryCost).toLocaleString()} тг (вкл. доставку)`;

  saveCart();
}

function updateQuantity(i, value) {
  cart[i].quantity = parseInt(value) || 1;
  updateCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCart();
}

function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => notif.classList.add("show"), 50);
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 2000);
}

// Очистка корзины
document.getElementById("clear-cart").addEventListener("click", () => {
  if (confirm("Э,мабой, уверен, что хочешь очистить корзину?")) {
    cart = [];
    updateCart();
  }
});

// Открытие/закрытие корзины
const cartModal = document.getElementById("cart-modal");
const openCartBtn = document.getElementById("open-cart");
const fabCartBtn = document.getElementById("fab-cart");
const closeCartBtn = document.getElementById("close-cart");

openCartBtn.addEventListener("click", () => cartModal.style.display = "flex");
fabCartBtn.addEventListener("click", () => cartModal.style.display = "flex");
closeCartBtn.addEventListener("click", () => cartModal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === cartModal) cartModal.style.display = "none";
});

// Изменение доставки
document.getElementById("delivery").addEventListener("change", updateCart);

// Оформление заказа
document.getElementById("checkout").addEventListener("click", () => {
  document.getElementById("checkout-form").style.display = "block";
});
// Поиск по товарам
document.getElementById("search").addEventListener("input", renderProducts);

// Сортировка тоже должна обновлять товары
document.getElementById("sort").addEventListener("change", renderProducts);

// Отправка заказа
document.querySelector("#checkout-form button").addEventListener("click", (e) => {
  e.preventDefault();
  alert("✅ Ваш заказ оформлен!");
  cart = [];             // очищаем корзину
  updateCart();          // перерисовываем корзину
  document.getElementById("checkout-form").style.display = "none"; // скрыть форму
});
document.getElementById("search").addEventListener("input", renderProducts);
// --- Рендерим при загрузке ---
renderProducts();
updateCart();

// Фильтры
document.getElementById("sort").addEventListener("change", renderProducts);
document.getElementById("search").addEventListener("input", renderProducts);
