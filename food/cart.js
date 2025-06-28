// cart.js
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart if it doesn't exist in localStorage
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  // Update cart count on page load
  updateCartCount();

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item");
      const item = {
        name: menuItem.querySelector("h3").textContent,
        price: parseFloat(
          menuItem.querySelector(".price").textContent.replace("$", "")
        ),
        image: menuItem.querySelector("img").src,
        description: menuItem.querySelector("p").textContent,
        quantity: 1,
      };

      addToCart(item);
      updateCartCount();

      // Show a quick notification
      showNotification(`${item.name} added to cart!`);
    });
  });

  // Cart button functionality
  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showCartModal();
    });
  }
});

function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const existingItem = cart.find((cartItem) => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? "flex" : "none";
  } else {
    // Create cart badge if it doesn't exist
    const cartBtn = document.querySelector(".cart-btn");
    if (cartBtn) {
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.textContent = cartCount;
      badge.style.display = cartCount > 0 ? "flex" : "none";
      cartBtn.appendChild(badge);
    }
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function showCartModal() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const modal = document.createElement("div");
  modal.className = "cart-modal";

  modal.innerHTML = `
        <div class="cart-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Your Cart</h2>
            ${
              cart.length === 0
                ? "<p>Your cart is empty</p>"
                : `<div class="cart-items">
                    ${cart
                      .map(
                        (item) => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                                <div class="cart-item-controls">
                                    <span>$${item.price.toFixed(2)} x ${
                          item.quantity
                        }</span>
                                    <button class="remove-item" data-name="${
                                      item.name
                                    }">Remove</button>
                                </div>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="cart-total">
                    <strong>Total: $${cart
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}</strong>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>`
            }
        </div>
    `;

  document.body.appendChild(modal);

  // Close modal
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });

  // Remove item functionality
  modal.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const itemName = this.getAttribute("data-name");
      removeFromCart(itemName);
      modal.remove();
      showCartModal();
      updateCartCount();
    });
  });

  // Checkout button
  const checkoutBtn = modal.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Proceeding to checkout!");
      // In a real app, you would redirect to checkout page
    });
  }
}

function removeFromCart(itemName) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart = cart.filter((item) => item.name !== itemName);
  localStorage.setItem("cart", JSON.stringify(cart));
}
