import { BasePage } from './base.page'

export class HomePagePo extends BasePage {
  pageUrl = "/"

  todoInput = "[data-cy='todo-input']";
  searchInput = '[data-cy="search-input"]';
  saveButton = "[data-cy='save-button']";
  todoUl = "[data-cy='todo-ul']";

  getFirstOrLastTodoItem(firstOrLast: "first" | "last") {
    const todoUlChildren = cy.get(this.todoUl).children();
    const foundItem = firstOrLast === "first" ? todoUlChildren.first() : todoUlChildren.last();
    if (foundItem) {
      return foundItem
    } else {
      throw new Error(`could not find ${firstOrLast} todo item`)
    }
  }
}
