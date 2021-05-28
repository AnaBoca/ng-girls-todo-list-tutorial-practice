import { BasePage } from './base.page'
import {todoListFixture} from "../fixtures/todoListFixture"

export class HomePagePo extends BasePage {
  pageUrl = "/"

  private _editInput = "editInput";
  private _saveButton = "save-button";
  private _searchInput = "search-input";
  private _todoInput = "todo-input";
  private _todoUl = "todo-ul";

  get editInput() {
    return this.getPageElement(this._editInput)
  }

  get saveButton() {
    return this.getPageElement(this._saveButton);
  }

  get searchInput() {
    return this.getPageElement(this._searchInput);
  }

  get todoInput() {
    return this.getPageElement(this._todoInput);
  }

  get todoUl() {
    return this.getPageElement(this._todoUl);
  }

  get todoItems() {
    return this.todoUl.then(ul => {
      const lis = ul.children();
      return lis;
    });
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

  firstTodoItemTitleShouldNotBe(assertText: string) {
    this.firstOrLastTodoItemTitleShouldNotBe("first", assertText)
  }

  lastTodoItemTitleShouldNotBe(assertText: string) {
    this.firstOrLastTodoItemTitleShouldNotBe("last", assertText)
  }

  todoInputShouldHaveClasses(...cssClasses: string[]) {
    cssClasses.forEach((cssClass) => {
      this.todoInput.should("have.class", cssClass);
    });
  }

  listShouldHaveLength(length: number) {
    this.todoItems.should("have.length", length);
  }

  getTodoItemAtIndex(index: number) {
    return this.todoItems.eq(index);
  }

  navigateToAndVerifyHomePage() {
    this.navigateTo()
    this.isElementVisible("app-root", "h1");
    this.isElemTextContain("app-root", "h1", "To-Do")
  }

  getItemsByTitle(title: string) {
    return this.todoItems.find(`:contains("${title}")`);
  }

  removeItemsByTitle(title: string) {
    this.getItemsByTitle(title).find('.btn-red').click();
  }

  expectItemToNotExist(title: string) {
    this.getItemsByTitle(title).should('not.exist');
  }

  addTodoListFixture() {
    for (let i = 0; i < todoListFixture.length; i++) {
      const todoItemTitle = todoListFixture[i];

      this.todoInput.click().type(todoItemTitle).type("{enter}");
    }
  }

  countItemsMatchingSearchInputFixture(searchTerm: string) {
    return this.todoItems.then(todoItems => {

      let numSearchMatches = 0;

      for (let i = 0; i < todoItems.length; i++) {
        const li = todoItems[i];
        const liTitle = li.getElementsByTagName('span')[0].innerHTML.toLowerCase();

        if (liTitle.includes(searchTerm)) {
          numSearchMatches += 1;
        }
      }

      return numSearchMatches;
    })
  }

  countTotalItems() {
    return this.todoItems.then(todoItems => {
      return todoItems.length;
    })
  }

  getFirstUncheckedItem() {
    return this.todoItems.then(lis => {
      return lis.find(':not([type="checkbox"]:checked)').first();
    })
  }

  editTitle(listItemEl: JQuery<HTMLElement>, newTitle: string) {
    cy.wrap(listItemEl).find(".btn-green").click();
    this.editInput.clear().type(newTitle);
    this.getFirstTodoItem().contains("Done").click();
  }

  private getFirstOrLastTodoItem(firstOrLast: "first" | "last") {
    const foundItem = firstOrLast === "first" ? this.todoItems.first() : this.todoItems.last();
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

  private firstOrLastTodoItemTitleShouldNotBe(firstOrLast: "first" | "last", assertText: string) {
    this.getFirstOrLastTodoItemTitle(firstOrLast).should((text) => {
      expect(text.text().trim()).to.not.equal(assertText);
    });
  }

}
