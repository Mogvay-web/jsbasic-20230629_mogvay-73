import createElement from "../../assets/lib/create-element.js";

export default class Modal {
  constructor() {
    this.render();
  }

  template() {
    return `
    <div class="modal">
      <div class="modal__overlay"></div>
      <div class="modal__inner">
        <div class="modal__header">
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>
          <h3 class="modal__title">
          </h3>
        </div>
        <div class="modal__body">
        </div>
      </div>
    </div>
    `;
  }

  setTitle(title) {
    this.modalTitle.textContent = title;
  }

  setBody(node) {
    this.modalBody.innerHTML = "";
    this.modalBody.append(node);
  }

  close() {
    document.body.classList.remove("is-modal-open");
    this.elem.remove();
    document.removeEventListener("keydown", this.esc);
  }

  X(event) {
    let X = event.target.closest(".modal__close");
    if (X) {
      this.close();
    }
  }

  esc = (event) => {
    if (event.code === "Escape") {
      this.close();
    }
  };

  render() {
    this.elem = createElement(this.template());

    this.modalTitle = this.elem.querySelector(".modal__title");
    this.modalBody = this.elem.querySelector(".modal__body");

    this.elem.addEventListener("click", (event) => this.X(event));
    document.addEventListener("keydown", this.esc);
  }

  open() {
    document.body.append(this.elem);
    document.body.classList.add("is-modal-open");
  }
}
