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
    let render = (this.elem = createElement(this.template())),
      config = this.steps - 1,
      thumb = render.querySelector(".slider__thumb"),
      progress = render.querySelector(".slider__progress"),
      percents = (this.value / config) * 100;

    thumb.style.left = `${percents}%`;
    progress.style.width = `${percents}%`;

    thumb.ondragstart = () => false;

    let self = this;

    function settingValue(event) {
      let width = this.getBoundingClientRect().width,
        step = width / config,
        left = event.clientX - this.getBoundingClientRect().left,
        measure,
        measureStep;

      if (event.type == "click") {
        measure = Math.round(left / step);
        measureStep = measure;

        const customEvent = new CustomEvent("slider-change", {
          detail: measureStep,
          bubbles: true,
        });
        self.elem.dispatchEvent(customEvent);
      } else {
        this.classList.add("slider_dragging");
        measure = left / step;
        self.measureStep = measureStep = Math.round(measure);
      }

      let value = this.querySelector(".slider__value"),
        activeOld = this.querySelector(".slider__step-active"),
        activeNew = this.querySelector(
          `.slider__steps span:nth-child(${measureStep + 1})`
        );

      value.textContent = measureStep;
      activeOld.classList.remove("slider__step-active");
      activeNew.classList.add("slider__step-active");

      let progress = this.querySelector(".slider__progress");

      percents = (measure / config) * 100;
      thumb.style.left = `${percents}%`;
      progress.style.width = `${percents}%`;
    }

    render.addEventListener("click", settingValue);

    thumb.addEventListener("pointerdown", function () {
      function onPointerUp() {
        this.classList.remove("slider_dragging");
        this.removeEventListener("pointermove", settingValue);
        this.removeEventListener("pointerup", onPointerUp);

        const customEvent = new CustomEvent("slider-change", {
          detail: self.measureStep,
          bubbles: true,
        });
        self.elem.dispatchEvent(customEvent);
      }

      render.addEventListener("pointermove", settingValue);
      render.addEventListener("pointerup", onPointerUp);
    });
  }
}
