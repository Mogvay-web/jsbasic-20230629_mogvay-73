/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  elem = null;

  constructor(rows) {
    this.elem = this.#render(rows);
  }

  #template(rows) {
    return `
    <table>
    <thead>
      <tr>
        <th>Имя</th>
        <th>Возраст</th>
        <th>Зарплата</th>
        <th>Город</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    ${rows
      .map(
        (row) => `
          <tr>
            <td>${row.name}</td>
            <td>${row.age}</td>
            <td>${row.salary}</td>
            <td>${row.city}</td>
            <td><button>X</button></td>
          </tr>
        `
      )
      .join("")}
    </tbody>
  </table>
    `;
  }

  #createElement(template) {
    const tmp = document.createElement("div");
    tmp.innerHTML = template;
    return tmp.firstElementChild;
  }

  #buttonClick(event) {
    if (event.target.tagName === "BUTTON") {
      event.target.closest("tr").remove();
    }
  }

  #render(rows) {
    let render = this.#createElement(this.#template(rows));
    render.addEventListener("click", (event) => this.#buttonClick(event));
    return render;
  }
}
