import Carousel from "../../6-module/3-task/index.js";
import slides from "../../6-module/3-task/slides.js";

import RibbonMenu from "../../7-module/1-task/index.js";
import categories from "../../7-module/1-task/categories.js";

import StepSlider from "../../7-module/4-task/index.js";
import ProductsGrid from "../../8-module/2-task/index.js";

import CartIcon from "../../8-module/1-task/index.js";
import Cart from "../../8-module/4-task/index.js";

export default class Main {
  constructor() {}

  async render() {
    this.carousel = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3,
    });
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);

    this.products = await this.receiveGoods();
    this.productsGrid = new ProductsGrid(this.products);

    this.appendElements();
    this.filteringElements();
    this.addEventListeners();
  }

  appendElements() {
    document.querySelector("[data-carousel-holder]").append(this.carousel.elem);
    document.querySelector("[data-ribbon-holder]").append(this.ribbonMenu.elem);
    document.querySelector("[data-slider-holder]").append(this.stepSlider.elem);
    document
      .querySelector("[data-cart-icon-holder]")
      .append(this.cartIcon.elem);
    document
      .querySelector("[data-products-grid-holder]")
      .append(this.productsGrid.elem);
  }

  async receiveGoods() {
    let response = await fetch("products.json"),
      products = await response.json();

    return products;
  }

  filteringElements() {
    this.productsGrid.updateFilter({
      noNuts: document.getElementById("nuts-checkbox").checked,
      vegeterianOnly: document.getElementById("vegeterian-checkbox").checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value,
    });
  }

  addEventListeners() {
    document.body.addEventListener("product-add", (event) => {
      let productToAdd = this.products.find(
        (product) => product.id === event.detail
      );
      this.cart.addProduct(productToAdd);
    });

    this.stepSlider.elem.addEventListener("slider-change", (event) => {
      this.productsGrid.updateFilter({
        maxSpiciness: event.detail,
      });
    });

    this.ribbonMenu.elem.addEventListener("ribbon-select", (event) => {
      this.productsGrid.updateFilter({
        category: event.detail,
      });
    });

    document
      .querySelector("#nuts-checkbox")
      .addEventListener("change", (event) => {
        this.productsGrid.updateFilter({ noNuts: event.target.checked });
      });

    document
      .querySelector("#vegeterian-checkbox")
      .addEventListener("change", (event) => {
        this.productsGrid.updateFilter({
          vegeterianOnly: event.target.checked,
        });
      });
  }
}
