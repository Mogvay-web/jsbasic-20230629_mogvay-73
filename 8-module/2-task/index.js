import createElement from "../../assets/lib/create-element.js";
import ProductCard from "../../6-module/2-task/index.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.render(products);
  }

  template(products) {
    let cards = products.map(function (product) {
      let card = new ProductCard(product);
      return card.elem.outerHTML;
    });

    return `<div class="products-grid">
              <div class="products-grid__inner">
                ${cards.join("")}
              </div>
            </div>`;
  }

  render(products) {
    let render = createElement(this.template(products));
    return render;
  }

  updateFilter(filter) {
    let filters = (this.filters = Object.assign(this.filters, filter));

    let result = this.products.filter(function (product) {
      if (filters.noNuts && product.nuts) {
        return false;
      }
      if (filters.vegeterianOnly && !product.vegeterian) {
        return false;
      }
      if (filters.maxSpiciness && product.spiciness > filters.maxSpiciness) {
        return false;
      }
      if (filters.category && product.category != filters.category) {
        return false;
      }

      return true;
    });

    this.elem.innerHTML = "";
    this.elem.appendChild(this.render(result).firstElementChild);
  }
}
