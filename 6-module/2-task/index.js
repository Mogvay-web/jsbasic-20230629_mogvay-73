import createElement from "../../assets/lib/create-element.js";
export default class ProductCard {
  elem = null;

  constructor(product) {
    this.elem = this.#render(product);
  }

  #template(product) {
    return `
    <div class="card">
    <div class="card__top">
        <img src="/assets/images/products/${
          product.image
        }" class="card__image" alt="product">
        <span class="card__price">€${product.price.toFixed(2)}</span>
    </div>
    <div class="card__body">
        <div class="card__title">${product.name}</div>
        <button type="button" class="card__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
    </div>
  </div>
  `;
  }

  #buttonClick(event, product) {
    const customEvent = new CustomEvent("product-add", {
      detail: product.id,
      bubbles: true,
    });

    if (event.target.closest(".card__button")) {
      this.elem.dispatchEvent(customEvent);
    }
  }

  #render(product) {
    let render = createElement(this.#template(product));
    render.addEventListener("click", (event) =>
      this.#buttonClick(event, product)
    );
    return render;
  }
}
