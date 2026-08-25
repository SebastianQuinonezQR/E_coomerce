// ===== STORE DATA =====
const PRODUCTS = [
  { id: 1, name: "Auriculares Pro X", category: "Electrónica", price: 89.99, originalPrice: 129.99, emoji: "🎧", badge: "sale", rating: 4.8, reviews: 312, tag: "electronica" },
  { id: 2, name: "Zapatillas Urban Run", category: "Calzado", price: 65.00, originalPrice: null, emoji: "👟", badge: "new", rating: 4.6, reviews: 189, tag: "moda" },
  { id: 3, name: "Smartwatch Series 5", category: "Electrónica", price: 199.99, originalPrice: 249.99, emoji: "⌚", badge: "hot", rating: 4.9, reviews: 534, tag: "electronica" },
  { id: 4, name: "Mochila Explorer", category: "Accesorios", price: 45.00, originalPrice: null, emoji: "🎒", badge: "new", rating: 4.5, reviews: 97, tag: "accesorios" },
  { id: 5, name: "Cámara Mirrorless", category: "Electrónica", price: 549.99, originalPrice: 699.99, emoji: "📷", badge: "sale", rating: 4.7, reviews: 203, tag: "electronica" },
  { id: 6, name: "Sudadera Cozy Fit", category: "Ropa", price: 38.00, originalPrice: null, emoji: "👕", badge: null, rating: 4.4, reviews: 78, tag: "moda" },
  { id: 7, name: "Teclado Mecánico RGB", category: "Electrónica", price: 119.99, originalPrice: 149.99, emoji: "⌨️", badge: "sale", rating: 4.8, reviews: 421, tag: "electronica" },
  { id: 8, name: "Perfume Élite", category: "Belleza", price: 72.00, originalPrice: null, emoji: "🌸", badge: "new", rating: 4.6, reviews: 156, tag: "belleza" },
  { id: 9, name: "Silla Ergonómica", category: "Hogar", price: 289.99, originalPrice: 359.99, emoji: "🪑", badge: "hot", rating: 4.7, reviews: 88, tag: "hogar" },
  { id: 10, name: "Set de Pinceles", category: "Arte", price: 24.99, originalPrice: null, emoji: "🎨", badge: null, rating: 4.5, reviews: 62, tag: "accesorios" },
  { id: 11, name: "Lámpara LED Moderna", category: "Hogar", price: 49.99, originalPrice: 64.99, emoji: "💡", badge: "sale", rating: 4.3, reviews: 44, tag: "hogar" },
  { id: 12, name: "Libro de Cocina", category: "Libros", price: 18.99, originalPrice: null, emoji: "📚", badge: "new", rating: 4.9, reviews: 276, tag: "accesorios" },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

// ===== CART HELPERS =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
    if (count > 0) {
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 300);
    }
  });
  renderCartSidebar();
  renderCartPage();
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showToast(`${product.emoji} ¡${product.name} agregado al carrito!`, "success");
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
}

function getSubtotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// ===== WISHLIST =====
function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(btn => {
    btn.classList.toggle("active", wishlist.includes(id));
  });
}

// ===== TOAST =====
function showToast(message, type = "success") {
  const container = document.querySelector(".toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== CART SIDEBAR RENDER =====
function renderCartSidebar() {
  const list = document.getElementById("cart-sidebar-items");
  if (!list) return;
  const subtotal = getSubtotal();

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Tu carrito está vacío</p>
        <small style="color:var(--text-light);margin-top:0.5rem;display:block">¡Agrega productos para comenzar!</small>
      </div>`;
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="btn-remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
          </div>
        </div>
      </div>`).join("");
  }

  const footerEl = document.getElementById("cart-sidebar-footer");
  if (footerEl) {
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;
    footerEl.innerHTML = `
      <div class="cart-summary">
        <div class="cart-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="cart-row"><span>Envío</span><span>${shipping === 0 ? '<span style="color:var(--accent);font-weight:700">Gratis</span>' : "$" + shipping.toFixed(2)}</span></div>
        <div class="cart-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      </div>
      <button class="btn-checkout" onclick="window.location.href='cart.html'">Ir al Checkout →</button>`;
  }
}

// ===== CART PAGE RENDER =====
function renderCartPage() {
  const container = document.getElementById("cart-page-items");
  if (!container) return;
  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="padding:3rem;text-align:center;color:var(--text-light)">
        <div style="font-size:5rem;margin-bottom:1rem">🛒</div>
        <p style="font-size:1.2rem;font-weight:700">Tu carrito está vacío</p>
        <a href="products.html" style="display:inline-block;margin-top:1rem;background:var(--primary);color:white;padding:0.7rem 2rem;border-radius:50px;font-weight:700">Ver Productos</a>
      </div>`;
  } else {
    container.innerHTML = `
      <div class="cart-items-list">
        ${cart.map(item => `
          <div class="cart-list-item">
            <div class="cli-emoji">${item.emoji}</div>
            <div class="cli-info">
              <div class="cli-name">${item.name}</div>
              <div class="cli-category">${item.category}</div>
            </div>
            <div class="cli-controls">
              <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
            </div>
            <div class="cli-price">$${(item.price * item.qty).toFixed(2)}</div>
            <button class="btn-remove-item" onclick="removeFromCart(${item.id})" style="font-size:1.3rem">🗑️</button>
          </div>`).join("")}
      </div>`;
  }

  const summaryEl = document.getElementById("cart-page-summary");
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="cart-order-summary">
        <h3>Resumen del Pedido</h3>
        <div class="summary-row"><span>Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} artículos)</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Envío</span><span>${shipping === 0 ? '<span style="color:var(--accent);font-weight:700">¡Gratis!</span>' : "$" + shipping.toFixed(2)}</span></div>
        <div class="summary-row"><span>Impuestos (16%)</span><span>$${(total * 0.16).toFixed(2)}</span></div>
        <hr class="summary-divider">
        <div class="summary-row summary-total"><span>Total</span><span>$${(total * 1.16).toFixed(2)}</span></div>
        <div class="coupon-input">
          <input type="text" id="coupon-input" placeholder="Código de descuento">
          <button onclick="applyCoupon()">Aplicar</button>
        </div>
        <button class="btn-checkout" onclick="checkout()">Proceder al Pago →</button>
        <p style="text-align:center;margin-top:0.75rem;font-size:0.8rem;color:var(--text-light)">🔒 Pago seguro con encriptación SSL</p>
      </div>`;
  }
}

function applyCoupon() {
  const code = document.getElementById("coupon-input")?.value.trim().toUpperCase();
  if (code === "DESCUENTO10") {
    showToast("🎉 ¡Cupón aplicado! 10% de descuento", "success");
  } else if (code === "ENVIOGRATIS") {
    showToast("🚀 ¡Envío gratis aplicado!", "success");
  } else {
    showToast("Código de cupón no válido", "error");
  }
}

function checkout() {
  if (cart.length === 0) {
    showToast("Tu carrito está vacío", "error");
    return;
  }
  showToast("🎉 ¡Pedido realizado con éxito! Gracias por tu compra.", "success");
  setTimeout(() => {
    cart = [];
    saveCart();
  }, 1500);
}

// ===== PRODUCTS RENDER =====
function renderProducts(filter = "todos") {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  const filtered = filter === "todos" ? PRODUCTS : PRODUCTS.filter(p => p.tag === filter);
  grid.innerHTML = filtered.map(p => productCard(p)).join("");
  updateWishlistButtons();
}

function productCard(p) {
  const badgeHtml = p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === "new" ? "Nuevo" : p.badge === "sale" ? "Oferta" : "Trending"}</span>` : "";
  const origHtml = p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : "";
  const stars = "★".repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? "½" : "");
  return `
    <div class="product-card" id="product-${p.id}">
      <div class="product-image-wrap">
        ${badgeHtml}
        <div class="product-emoji">${p.emoji}</div>
        <button class="product-wishlist wishlist-btn ${wishlist.includes(p.id) ? "active" : ""}" data-id="${p.id}" onclick="toggleWishlist(${p.id})" aria-label="Favorito">
          ${wishlist.includes(p.id) ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">$${p.price.toFixed(2)}</span>
            ${origHtml}
          </div>
          <button class="btn-add-cart" onclick="addToCart(${p.id})">+ Agregar</button>
        </div>
      </div>
    </div>`;
}

function updateWishlistButtons() {
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    const id = parseInt(btn.dataset.id);
    const active = wishlist.includes(id);
    btn.classList.toggle("active", active);
    btn.textContent = active ? "❤️" : "🤍";
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function searchProducts(query) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  const q = query.toLowerCase();
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
  grid.innerHTML = results.length
    ? results.map(p => productCard(p)).join("")
    : `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light)">
        <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
        <p>No se encontraron productos para "<strong>${escapeHtml(query)}</strong>"</p>
      </div>`;
  updateWishlistButtons();
}

// ===== FEATURED HOME PRODUCTS =====
function renderFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  const featured = PRODUCTS.slice(0, 8);
  grid.innerHTML = featured.map(p => productCard(p)).join("");
  updateWishlistButtons();
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Hamburger
  const ham = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (ham && navLinks) {
    ham.addEventListener("click", () => {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "100%";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "var(--dark)";
      navLinks.style.padding = "1rem 2rem";
    });
  }

  // Active link
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
}

// ===== CART SIDEBAR TOGGLE =====
function initCartSidebar() {
  const sidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("cart-overlay");
  const openBtn = document.getElementById("open-cart-btn");
  const closeBtn = document.getElementById("close-cart-btn");

  function openCart() {
    sidebar?.classList.add("open");
    overlay?.classList.add("open");
  }
  function closeCart() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("open");
  }

  openBtn?.addEventListener("click", openCart);
  closeBtn?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
  const end = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000);
  function update() {
    const diff = end - Date.now();
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, "0");
    };
    set("cd-days", d); set("cd-hours", h); set("cd-mins", m); set("cd-secs", s);
  }
  update();
  setInterval(update, 1000);
}

// ===== FILTER PILLS =====
function initFilterPills() {
  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.dataset.filter;
      renderProducts(filter);
    });
  });
}

// ===== SEARCH BAR =====
function initSearchBar() {
  const input = document.getElementById("search-input");
  const btn = document.getElementById("search-btn");
  if (!input) return;
  btn?.addEventListener("click", () => searchProducts(input.value));
  input.addEventListener("keydown", e => { if (e.key === "Enter") searchProducts(input.value); });
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initCartSidebar();
  initCountdown();
  updateCartUI();
  renderFeatured();
  renderProducts();
  initFilterPills();
  initSearchBar();
  renderCartPage();
});
