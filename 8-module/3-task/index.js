export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}
