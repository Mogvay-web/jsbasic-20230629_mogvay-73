import createElement from "../../assets/lib/create-element.js";
import ProductCard from "../../6-module/2-task/index.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.render();
  }

  render() {
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `);

    this.renderCards(this.products);
  }

  renderCards(products) {
    const productsGridInner = this.elem.querySelector(".products-grid__inner");
    productsGridInner.innerHTML = "";

    for (let product of products) {
      productsGridInner.append(new ProductCard(product).elem);
    }
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

    this.renderCards(result);
  }
}
