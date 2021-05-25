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

  function getLastTodoItem() {
    return cy.get(todoUl).children().last();
  }

  function getFirstTodoItemTitle() {
    return getFirstTodoItem().find(".todo-title");
  }

  function getLastTodoItemTitle() {
    return getLastTodoItem().find(".todo-title");
  }

  function firstTodoItemTitleShouldBe(assertText) {
    getFirstTodoItemTitle().should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }

  function lastTodoItemTitleShouldBe(assertText) {
    getLastTodoItemTitle().should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }

  function listShouldHaveLength(length) {
    cy.get(todoUl).children().should("have.length", length);
  }

  it("adds todo item via enter key", () => {
    listShouldHaveLength(6);

    cy.get(todoInput).click().type("Entered todo item").type("{enter}");

    lastTodoItemTitleShouldBe("Entered todo item");

    listShouldHaveLength(7);
  });

  it("adds todo item via save button", () => {
    listShouldHaveLength(6);

    cy.get(todoInput).click().type("Saved todo item");

    cy.get(saveButton).click();

    lastTodoItemTitleShouldBe("Saved todo item");

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

  it("moves todo item down", () => {
    firstTodoItemTitleShouldBe("install NodeJS");
    getFirstTodoItem().find(".btn-down").click();
    firstTodoItemTitleShouldBe("install Angular CLI");
    getFirstTodoItem()
      .next()
      .find(".todo-title")
      .should((text) => {
        expect(text.text().trim()).to.equal("install NodeJS");
      });
  });

  it("moves todo item up", () => {
    lastTodoItemTitleShouldBe("deploy app");
    getLastTodoItem().find(".btn-up").click();
    lastTodoItemTitleShouldBe("develop app");
    getLastTodoItem()
      .prev()
      .find(".todo-title")
      .should((text) => {
        expect(text.text().trim()).to.equal("deploy app");
      });
  });

  it("move up button is disabled for first todo item", () => {
    getFirstTodoItem().find(".btn-up").should("have.attr", "disabled");
  });

  it("move down button is disabled for last todo item", () => {
    getLastTodoItem().find(".btn-down").should("have.attr", "disabled");
  });

  it("validation when clicking save and no todo item has been entered", () => {
    cy.get(todoInput)
      .should("have.class", "ng-untouched")
      .and("have.class", "ng-pristine")
      .and("have.class", "ng-invalid");
    cy.get(todoInput).click();
    cy.get(saveButton).click();
    cy.get(todoInput)
      .should("have.class", "ng-invalid")
      .and("have.class", "ng-touched")
      .and("have.class", "ng-dirty");
  });

  it.only("validation when clicking save and previoulsy typing and then deleting todo item input", () => {
    cy.get(todoInput)
      .should("have.class", "ng-untouched")
      .and("have.class", "ng-pristine")
      .and("have.class", "ng-invalid");
    cy.get(todoInput).click().type("i'm gonna get deleted").clear();
    cy.get(todoInput)
      .should("have.class", "ng-invalid")
      .and("have.class", "ng-untouched")
      .and("have.class", "ng-dirty");
  });

  it("validation when clicking save and previously typing empty space", () => {});

  it("searches todo list", () => {});
});
