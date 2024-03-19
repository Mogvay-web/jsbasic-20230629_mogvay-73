import createElement from "../../assets/lib/create-element.js";

export default class RibbonMenu {
  elem = null;

  constructor(categories) {
    this.categories = categories;
    this.elem = this.#render(categories);
  }

  #template(categories) {
    return ` 
    <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <nav class="ribbon__inner">
      ${categories
        .map(
          (category) =>
            `<a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>`
        )
        .join(``)}
      </nav>
      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
  </div>`;
  }

  #scroll(render) {
    const inner = render.querySelector(".ribbon__inner"),
      arrowLeft = render.querySelector(".ribbon__arrow_left"),
      arrowRight = render.querySelector(".ribbon__arrow_right");

    arrowLeft.addEventListener("click", function () {
      inner.scrollBy(-350, 0);
    });

    arrowRight.addEventListener("click", function () {
      inner.scrollBy(350, 0);
    });

    inner.addEventListener("scroll", function () {
      let scrollLeft = this.scrollLeft;
      scrollLeft == 0
        ? arrowLeft.classList.remove("ribbon__arrow_visible")
        : arrowLeft.classList.add("ribbon__arrow_visible");

      let scrollWidth = this.scrollWidth,
        clientWidth = this.clientWidth,
        scrollRight = scrollWidth - scrollLeft - clientWidth;

      scrollRight < 1
        ? arrowRight.classList.remove("ribbon__arrow_visible")
        : arrowRight.classList.add("ribbon__arrow_visible");
    });
  }

  #buttonClick(event, categories) {
    const ribbonItem = event.target.closest(".ribbon__item");
    if (ribbonItem) {
      event.preventDefault();

      const ribbonItemActive = document.querySelector(".ribbon__item_active");

      if (ribbonItemActive) {
        ribbonItemActive.classList.remove("ribbon__item_active");
      }

      ribbonItem.classList.add("ribbon__item_active");

      const category = categories.find(
        (category) => category.id === ribbonItem.dataset.id
      );
      if (category) {
        const customEvent = new CustomEvent("ribbon-select", {
          detail: category.id,
          bubbles: true,
        });
        this.elem.dispatchEvent(customEvent);
      }
    }
  }

  #render(categories) {
    let render = createElement(this.#template(categories));
    this.#scroll(render);
    render.addEventListener("click", (event) =>
      this.#buttonClick(event, categories)
    );
    return render;
  }
}
