import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
  }

  template() {
    let steps = "";
    for (let i = 0; i < this.steps; i++) {
      i == this.value
        ? (steps += "<span class='slider__step-active'></span>")
        : (steps += "<span></span>");
    }
    return `
    <div class="slider">
      <div class="slider__thumb">
        <span class="slider__value">${this.value}</span>
      </div>
      <div class="slider__progress"></div>
      <div class="slider__steps">
        ${steps}
      </div>
    </div>
    `;
  }

  render() {
    this.elem = createElement(this.template());
    let config = this.steps - 1;

    this.elem.addEventListener("click", function (event) {
      let width = this.getBoundingClientRect().width,
        step = width / config,
        left = event.clientX - this.getBoundingClientRect().left,
        measure = Math.round(left / step);

      let value = this.querySelector(".slider__value"),
        activeOld = this.querySelector(".slider__step-active"),
        activeNew = this.querySelector(
          `.slider__steps span:nth-child(${measure + 1})`
        );

      value.textContent = measure;
      activeOld.classList.remove("slider__step-active");
      activeNew.classList.add("slider__step-active");

      let thumb = this.querySelector(".slider__thumb"),
        progress = this.querySelector(".slider__progress"),
        percents = (measure / config) * 100;

      thumb.style.left = `${percents}%`;
      progress.style.width = `${percents}%`;

      const customEvent = new CustomEvent("slider-change", {
        detail: measure,
        bubbles: true,
      });

      this.dispatchEvent(customEvent);
    });
  }
}
