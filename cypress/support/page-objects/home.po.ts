import { BasePage } from './base.po';
import { todoListFixture } from '../../fixtures/input.fixture';

export class HomePagePo extends BasePage {
  pageUrl = '/';

  private _editInput = 'editInput';
  get editInput() {
    return this.getPageElement(this._editInput);
  }

  private _saveButton = 'save-button';
  get saveButton() {
    return this.getPageElement(this._saveButton);
  }

  private _searchInput = 'search-input';
  get searchInput() {
    return this.getPageElement(this._searchInput);
  }

  private _todoInput = 'todo-input';
  get todoInput() {
    return this.getPageElement(this._todoInput);
  }

  private _todoUl = 'todo-ul';
  get todoUl() {
    return this.getPageElement(this._todoUl);
  }

  private _itemsToBeDeleted: string[] = [];
  get itemsToBeDeleted() {
    return this._itemsToBeDeleted;
  }

  get todoItems() {
    return this.todoUl.then((ul) => {
      // Cypress throws an error if there are no children
      // JQuery returns an empty array to work with if there are no children
      const lis = ul.children();
      return lis;
    });
  }

  getFirstTodoItem() {
    return this.getFirstOrLastTodoItem('first');
  }

  getLastTodoItem() {
    return this.getFirstOrLastTodoItem('last');
  }

  getFirstTodoItemTitle() {
    return this.getFirstOrLastTodoItemTitle('first');
  }

  getLastTodoItemTitle() {
    return this.getFirstOrLastTodoItemTitle('last');
  }

  getTodoItemAtIndex(index: number) {
    return this.todoItems.eq(index);
  }

  getItemsByTitle(title: string) {
    return this.todoItems.find(`:contains("${title}")`);
  }

  getFirstUncheckedItem() {
    return this.todoItems.then((lis) => {
      return lis.find(':not([type="checkbox"]:checked)').first();
    });
  }

  countTotalItems() {
    return this.todoItems.then((todoItems) => {
      return todoItems.length;
    });
  }

  countItemsMatchingSearchInputFixture(searchTerm: string) {
    return this.todoItems.then((todoItems) => {
      let numSearchMatches = 0;

      for (let i = 0; i < todoItems.length; i++) {
        const li = todoItems[i];
        const liTitle = li
          .getElementsByTagName('span')[0]
          .innerHTML.toLowerCase();

        if (liTitle.includes(searchTerm)) {
          numSearchMatches += 1;
        }
      }

      return numSearchMatches;
    });
  }

  addTodoListFixture() {
    for (let i = 0; i < todoListFixture.length; i++) {
      const todoItemTitle = todoListFixture[i];

      this.todoInput.click().type(todoItemTitle).type('{enter}');
    }
  }

  editTitle(listItemEl: JQuery<HTMLElement>, newTitle: string) {
    cy.wrap(listItemEl).find('.btn-green').click();
    this.editInput.clear().type(newTitle);
    this.getFirstTodoItem().contains('Done').click();
  }

  removeItemsByTitle(title: string) {
    this.getItemsByTitle(title).find('.btn-red').click();
  }

  removeItemsToBeDeleted() {
    for (let i = 0; i < this.itemsToBeDeleted.length; i++) {
      const item = this.itemsToBeDeleted[i];
      this.itemsToBeDeleted.pop();
      this.removeItemsByTitle(item);
    }
  }

  removeTodoListFixture() {
    for (let i = 0; i < todoListFixture.length; i++) {
      const todoItemTitle = todoListFixture[i];

      this.removeItemsByTitle(todoItemTitle);
    }
  }

  assertNavigateToAndVerifyHomePage() {
    this.navigateTo();
    cy.get('h1').should('contain', 'To-Do');
  }

  assertFirstTodoItemTitleEqualTo(assertText: string) {
    this.assertFirstOrLastTodoItemTitleEqualTo('first', assertText);
  }

  assertLastTodoItemTitleEqualTo(assertText: string) {
    this.assertFirstOrLastTodoItemTitleEqualTo('last', assertText);
  }

  assertItemWithTitleDoesNotExist(title: string) {
    this.getItemsByTitle(title).should('not.exist');
  }

  assertListLengthEqualTo(length: number) {
    this.todoItems.should('have.length', length);
  }

  assertTodoInputHasClasses(...cssClasses: string[]) {
    cssClasses.forEach((cssClass) => {
      this.todoInput.should('have.class', cssClass);
    });
  }

  assertEditInputHasClasses(...cssClasses: string[]) {
    cssClasses.forEach((cssClass) => {
      this.editInput.should('have.class', cssClass);
    });
  }

  private getFirstOrLastTodoItem(firstOrLast: 'first' | 'last') {
    const foundItem =
      firstOrLast === 'first' ? this.todoItems.first() : this.todoItems.last();
    if (foundItem) {
      return foundItem;
    } else {
      throw new Error(`could not find ${firstOrLast} todo item`);
    }
  }

  private getFirstOrLastTodoItemTitle(firstOrLast: 'first' | 'last') {
    return this.getFirstOrLastTodoItem(firstOrLast).find('.todo-title');
  }

  private assertFirstOrLastTodoItemTitleEqualTo(
    firstOrLast: 'first' | 'last',
    assertText: string
  ) {
    this.getFirstOrLastTodoItemTitle(firstOrLast).should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }
}
