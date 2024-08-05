import createElement from "../../assets/lib/create-element.js";
import escapeHtml from "../../assets/lib/escape-html.js";

import Modal from "../../7-module/2-task/index.js";

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (product !== null && typeof product != "undefined") {
      let item = this.cartItems.find((item) => {
        return item.product.id === product.id;
      });

      if (item) {
        item.count++;
      } else {
        this.cartItems.push({
          product: product,
          count: 1,
        });
      }
      this.onProductUpdate(item);
    }
  }

  updateProductCount(productId, amount) {
    let item = this.cartItems.find((item) => {
      return item.product.id === productId;
    });

    let count = item.count + amount;

    if (count == 0) {
      let index = this.cartItems.indexOf(item);
      this.cartItems.splice(index, 1);
      item.count = 0;
    } else {
      item.count = count;
    }

    this.onProductUpdate(item);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;

    this.cartItems.forEach((item) => {
      totalCount += item.count;
    });

    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;

    this.cartItems.forEach((item) => {
      totalPrice += item.count * item.product.price;
    });

    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let modal = new Modal();
    modal.setTitle("Your order");

    let renderProduct = createElement(`<div></div>`);

    this.cartItems.forEach((item) => {
      renderProduct.append(this.renderProduct(item.product, item.count));
    });

    renderProduct.append(this.renderOrderForm());

    renderProduct.addEventListener("click", (event) => {
      let cartCounter = event.target.closest(".cart-counter__button");

      if (!cartCounter) {
        return;
      }

      let productId = cartCounter.closest(".cart-product").dataset.productId;

      if (cartCounter.closest(".cart-counter__button_plus")) {
        this.updateProductCount(productId, 1);
      } else {
        this.updateProductCount(productId, -1);
      }
    });

    let form = renderProduct.querySelector(".cart-form");

    form.addEventListener("submit", (event) => {
      this.onSubmit(event);
    });

    modal.setBody(renderProduct);

    modal.open();
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (document.body.classList.contains("is-modal-open")) {
      let productId = cartItem.product.id,
        modalBody = document.querySelector(".modal__body"),
        productCount = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-counter__count`
        ),
        productPrice = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-product__price`
        ),
        infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

      if (cartItem.count != 0) {
        productCount.innerHTML = cartItem.count;

        let price = cartItem.count * cartItem.product.price;
        productPrice.innerHTML = `€${price.toFixed(2)}`;
      } else {
        if (this.cartItems.length == 0) {
          document.querySelector(".modal__close").click();
        }

        modalBody.querySelector(`[data-product-id="${productId}"]`).remove();
      }

      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }

  onSubmit(event) {
    event.preventDefault();

    let modalBody = document.querySelector(".modal__body"),
      form = modalBody.querySelector(".cart-form"),
      submitButton = modalBody.querySelector(
        '.cart-buttons__button[type="submit"]'
      );

    submitButton.classList.add("is-loading");

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: new FormData(form),
    }).then((response) => {
      if (response.ok) {
        let modalTitle = document.querySelector(".modal__title");
        modalTitle.textContent = "Success!";

        this.cartItems.length = 0;

        modalBody.innerHTML = `<div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>`;
        this.cartIcon.update(this);
      }
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
