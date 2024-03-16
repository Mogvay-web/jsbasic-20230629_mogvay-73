import createElement from "../../assets/lib/create-element.js";

export default class Carousel {
  elem = null;

  constructor(slides) {
    this.elem = this.#render(slides);
  }

  #template(slides) {
    return `
    <div class="carousel">
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__inner">
      ${slides
        .map(
          (slide) => `
      <div class="carousel__slide" data-id="${slide.id}">
        <img src="/assets/images/carousel/${
          slide.image
        }" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${slide.price.toFixed(2)}</span>
          <div class="carousel__title">${slide.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
      </div>
    </div>`
        )
        .join("")}
  </div>`;
  }

  #buttonClick(event, slides) {
    const targetSlide = event.target.closest(".carousel__slide");
    if (targetSlide) {
      const slide = slides.find((s) => s.id === targetSlide.dataset.id);
      if (slide) {
        const customEvent = new CustomEvent("product-add", {
          detail: slide.id,
          bubbles: true,
        });
        if (event.target.closest(".carousel__button")) {
          this.elem.dispatchEvent(customEvent);
        }
      }
    }
  }

  #initCarousel(render, slides) {
    const inner = render.querySelector(".carousel__inner"),
      arrowLeft = render.querySelector(".carousel__arrow_left"),
      arrowRight = render.querySelector(".carousel__arrow_right");

    let shift = 0,
      i = 0;

    arrowLeft.style.display = "none";

    arrowLeft.addEventListener("click", function () {
      shift += inner.offsetWidth;
      arrowRight.style.display = "";
      i--;

      if (i == 0) {
        this.style.display = "none";
      }

      inner.style.transform = `translateX(${shift}px)`;
    });

    arrowRight.addEventListener("click", function () {
      shift -= inner.offsetWidth;
      arrowLeft.style.display = "";
      i++;

      if (i == slides.length - 1) {
        this.style.display = "none";
      }

      inner.style.transform = `translateX(${shift}px)`;
    });
  }

  #render(slides) {
    let render = createElement(this.#template(slides));
    this.#initCarousel(render, slides);
    render.addEventListener("click", (event) =>
      this.#buttonClick(event, slides)
    );
    return render;
  }
}
