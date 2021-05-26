describe("ToDo UI test suite", () => {
  beforeEach("visit baseUrl", () => {
    cy.visit("/");
  });

  const todoInput = "[data-cy='todo-input']";
  const searchInput = '[data-cy="search-input"]';
  const saveButton = "[data-cy='save-button']";
  const todoUl = "[data-cy='todo-ul']";

  function getFirstOrLastTodoItem(firstOrLast) {
    if (firstOrLast === "first") {
      return cy.get(todoUl).children().first();
    } else if (firstOrLast === "last") {
      return cy.get(todoUl).children().last();
    }
  }

  function getFirstOrLastTodoItemTitle(firstOrLast) {
    return getFirstOrLastTodoItem(firstOrLast).find(".todo-title");
  }

  function firstOrLastTodoItemTitleShouldBe(firstOrLast, assertText) {
    getFirstOrLastTodoItemTitle(firstOrLast).should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }

  function listShouldHaveLength(length) {
    cy.get(todoUl).children().should("have.length", length);
  }

  function todoInputShouldHaveClasses(class1, class2, class3) {
    cy.get(todoInput)
      .should("have.class", class1)
      .and("have.class", class2)
      .and("have.class", class3);
  }

  function todoInputAttrNgReflectModelShould(conditionStr, valueStr) {
    cy.get(todoInput)
      .invoke("attr", "ng-reflect-model")
      .should(conditionStr, valueStr);
  }

  it("searches todo list", () => {
    listShouldHaveLength(6);

    cy.get(searchInput).type("de");

    firstOrLastTodoItemTitleShouldBe("first", "install NodeJS");
    getFirstOrLastTodoItem("first")
      .next()
      .find(".todo-title")
      .should((text) => {
        expect(text.text().trim()).to.equal("develop app");
      });
    firstOrLastTodoItemTitleShouldBe("last", "deploy app");

    listShouldHaveLength(3);
  });

  it("adds todo item via enter key", () => {
    firstOrLastTodoItemTitleShouldBe("last", "deploy app");
    listShouldHaveLength(6);

    cy.get(todoInput).click().type("Entered todo item").type("{enter}");

    firstOrLastTodoItemTitleShouldBe("last", "Entered todo item");
    listShouldHaveLength(7);
  });

  it("adds todo item via save button", () => {
    firstOrLastTodoItemTitleShouldBe("last", "deploy app");
    listShouldHaveLength(6);

    cy.get(todoInput).click().type("Saved todo item");
    cy.get(saveButton).click();

    firstOrLastTodoItemTitleShouldBe("last", "Saved todo item");
    listShouldHaveLength(7);
  });

  it("removes todo item", () => {
    firstOrLastTodoItemTitleShouldBe("first", "install NodeJS");
    listShouldHaveLength(6);

    getFirstOrLastTodoItem("first").find(".btn-red").click();

    firstOrLastTodoItemTitleShouldBe("first", "install Angular CLI");
    listShouldHaveLength(5);
  });

  it("edits todo item", () => {
    firstOrLastTodoItemTitleShouldBe("first", "install NodeJS");

    getFirstOrLastTodoItem("first").find(".btn-green").click();
    cy.get('[data-cy="editInput"]').type("test");
    getFirstOrLastTodoItem("first").contains("Done").click();

    firstOrLastTodoItemTitleShouldBe("first", "install NodeJStest");
  });

  it("checks todo item", () => {
    getFirstOrLastTodoItemTitle("first").should(
      "not.have.class",
      "todo-complete"
    );

    getFirstOrLastTodoItem("first").find('[type="checkbox"]').click();

    getFirstOrLastTodoItemTitle("first").should("have.class", "todo-complete");
  });

  it("moves todo item down", () => {
    firstOrLastTodoItemTitleShouldBe("first", "install NodeJS");

    getFirstOrLastTodoItem("first").find(".btn-down").click();

    firstOrLastTodoItemTitleShouldBe("first", "install Angular CLI");

    getFirstOrLastTodoItem("first")
      .next()
      .find(".todo-title")
      .should((text) => {
        expect(text.text().trim()).to.equal("install NodeJS");
      });
  });

  it("moves todo item up", () => {
    firstOrLastTodoItemTitleShouldBe("last", "deploy app");

    getFirstOrLastTodoItem("last").find(".btn-up").click();

    firstOrLastTodoItemTitleShouldBe("last", "develop app");

    getFirstOrLastTodoItem("last")
      .prev()
      .find(".todo-title")
      .should((text) => {
        expect(text.text().trim()).to.equal("deploy app");
      });
  });

  it("first todo item move up button is disabled", () => {
    getFirstOrLastTodoItem("first")
      .find(".btn-up")
      .should("have.attr", "disabled");
  });

  it("last todo item move down button is disabled", () => {
    getFirstOrLastTodoItem("last")
      .find(".btn-down")
      .should("have.attr", "disabled");
  });

  it("validation when clicking save immediately with no todo item entered", () => {
    todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    todoInputAttrNgReflectModelShould("be.empty");

    cy.get(saveButton).click();

    todoInputShouldHaveClasses("ng-untouched", "ng-dirty", "ng-invalid");
    todoInputAttrNgReflectModelShould("be.empty");
  });

  it("validation when clicking save after clicking into todo item input with no todo item entered", () => {
    todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    todoInputAttrNgReflectModelShould("be.empty");

    cy.get(todoInput).click();
    cy.get(saveButton).click();

    todoInputShouldHaveClasses("ng-touched", "ng-dirty", "ng-invalid");
    todoInputAttrNgReflectModelShould("be.empty");
  });

  it("validation when clicking save and previously typing and then deleting todo item input", () => {
    todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    todoInputAttrNgReflectModelShould("be.empty");

    cy.get(todoInput).click().type("i'm gonna get deleted");
    todoInputAttrNgReflectModelShould("contain", "i'm gonna get deleted");
    cy.get(todoInput).clear();

    todoInputShouldHaveClasses("ng-untouched", "ng-dirty", "ng-invalid");
    todoInputAttrNgReflectModelShould("be.empty");
  });

  it("validation when clicking save and previously typing empty string as todo item input", () => {
    todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    todoInputAttrNgReflectModelShould("be.empty");

    cy.get(todoInput)
      .click()
      .type("  12")
      .type("{backspace}")
      .type("{backspace}");
    cy.get(saveButton).click();

    todoInputShouldHaveClasses("ng-touched", "ng-dirty", "ng-invalid");
    todoInputAttrNgReflectModelShould("contain", "  ");
  });
});
