import { BasePage } from './base.page'

export class HomePagePo extends BasePage {
  pageUrl = "/"

  private _todoInput = "[data-cy='todo-input']";
  private _searchInput = '[data-cy="search-input"]';
  private _saveButton = "[data-cy='save-button']";
  private _todoUl = "[data-cy='todo-ul']";
  private _editInput = "[data-cy='editInput']";

  get todoInput() {
    return cy.get(this._todoInput);
  }

  get editInput() {
    return cy.get(this._editInput);
  }

  get saveButton() {
    return cy.get(this._saveButton);
  }

  get searchInput() {
    return cy.get(this._searchInput)
  }

  todoItemAtIndexTitleShouldBe(index: number, assertText: string) {
    this.getTodoItemAtIndex(index).find(".todo-title")
    .should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }

  getFirstTodoItem() {
    return this.getFirstOrLastTodoItem("first");
  }

  getLastTodoItem() {
    return this.getFirstOrLastTodoItem("last");
  }

  getFirstTodoItemTitle() {
    return this.getFirstOrLastTodoItemTitle("first")
  }

  getLastTodoItemTitle() {
    return this.getFirstOrLastTodoItemTitle("last")
  }

  firstTodoItemTitleShouldBe(assertText: string) {
    this.firstOrLastTodoItemTitleShouldBe("first", assertText);
  }

  lastTodoItemTitleShouldBe(assertText: string) {
    this.firstOrLastTodoItemTitleShouldBe("last", assertText)
  }

  todoInputShouldHaveClasses(class1: string, class2: string, class3: string) {
    cy.get(this._todoInput)
      .should("have.class", class1)
      .and("have.class", class2)
      .and("have.class", class3);
  }

  listShouldHaveLength(length: number) {
    cy.get(this._todoUl).children().should("have.length", length);
  }

  todoInputAttrNgReflectModelShould(condition: string, value?: string) {
    cy.get(this._todoInput)
      .invoke("attr", "ng-reflect-model")
      .should(condition, value);
  }

  private getTodoItemAtIndex(index: number) {
    return cy.get(this._todoUl).children().eq(index);
  }

  private getFirstOrLastTodoItem(firstOrLast: "first" | "last") {
    const todoUlChildren = cy.get(this._todoUl).children();
    const foundItem = firstOrLast === "first" ? todoUlChildren.first() : todoUlChildren.last();
    if (foundItem) {
      return foundItem
    } else {
      throw new Error(`could not find ${firstOrLast} todo item`)
    }
  }

  private getFirstOrLastTodoItemTitle(firstOrLast: "first" | "last") {
    return this.getFirstOrLastTodoItem(firstOrLast).find(".todo-title");
  }

  private firstOrLastTodoItemTitleShouldBe(firstOrLast: "first" | "last", assertText: string) {
    this.getFirstOrLastTodoItemTitle(firstOrLast).should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }

}
