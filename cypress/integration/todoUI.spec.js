describe("ToDo UI test suite", () => {
  beforeEach("visit baseUrl", () => {
    cy.visit("/");
  });

  const todoInput = "[data-cy='todo-input']";
  const saveButton = "[data-cy='save-button']";
  const todoUl = "[data-cy='todo-ul']";

  function getFirstTodoItem() {
    return cy.get(todoUl).children().first();
  }

  function getFirstTodoItemTitle() {
    return getFirstTodoItem().find(".todo-title");
  }

  function listShouldHaveLength(length) {
    cy.get(todoUl).children().should("have.length", length);
  }

  function firstTodoItemTitleShouldBe(assertText) {
    getFirstTodoItemTitle().should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }

  it("adds todo item via enter key", () => {
    listShouldHaveLength(6);

    cy.get(todoInput).click().type("Entered todo item").type("{enter}");

    cy.get(todoUl + " li span")
      .last()
      .should((text) => {
        expect(text.text().trim()).to.equal("Entered todo item");
      });

    listShouldHaveLength(7);
  });

  it("adds todo item via save button", () => {
    listShouldHaveLength(6);

    cy.get(todoInput).click().type("Saved todo item");

    cy.get(saveButton).click();

    cy.get(todoUl + " li span")
      .last()
      .should((text) => {
        expect(text.text().trim()).to.equal("Saved todo item");
      });

    listShouldHaveLength(7);
  });

  it("removes todo item", () => {
    listShouldHaveLength(6);
    firstTodoItemTitleShouldBe("install NodeJS");

    cy.get(todoUl).children().first().find(".btn-red").click();

    listShouldHaveLength(5);
    firstTodoItemTitleShouldBe("install Angular CLI");
  });

  it("edits todo item", () => {
    firstTodoItemTitleShouldBe("install NodeJS");

    getFirstTodoItem().find(".btn-green").click();
    cy.get('[data-cy="editInput"]').type("test");
    getFirstTodoItem().contains("Done").click();

    firstTodoItemTitleShouldBe("install NodeJStest");
  });

  it("checks todo item", () => {
    getFirstTodoItemTitle().should("not.have.class", "todo-complete");

    getFirstTodoItem().find('[type="checkbox"]').click();

    getFirstTodoItemTitle().should("have.class", "todo-complete");
  });

  it("moves todo down", () => {});
});
