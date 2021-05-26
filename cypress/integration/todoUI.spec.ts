import {HomePagePo} from "../support/home-page.po"

describe("ToDo UI test suite", () => {
  const homePage = new HomePagePo();

  beforeEach("visit baseUrl", () => {
    homePage.navigateTo();
    homePage.isElementVisible("app-root", "h1");
    homePage.isElemTextContain("app-root", "h1", "To-Do")
  });

  const todoInput = homePage.todoInput;
  const searchInput = homePage.searchInput;
  const saveButton = homePage.saveButton;
  const todoUl = homePage.todoUl;

  function getFirstOrLastTodoItemTitle(firstOrLast: "first" | "last") {
    return homePage.getFirstOrLastTodoItem(firstOrLast).find(".todo-title");
  }

  function firstOrLastTodoItemTitleShouldBe(firstOrLast: "first" | "last", assertText: string) {
    getFirstOrLastTodoItemTitle(firstOrLast).should((text) => {
      expect(text.text().trim()).to.equal(assertText);
    });
  }

  function listShouldHaveLength(length: number) {
    cy.get(todoUl).children().should("have.length", length);
  }

  function todoInputShouldHaveClasses(class1: string, class2: string, class3: string) {
    cy.get(todoInput)
      .should("have.class", class1)
      .and("have.class", class2)
      .and("have.class", class3);
  }

  function todoInputAttrNgReflectModelShould(condition: string, value?: string) {
    cy.get(todoInput)
      .invoke("attr", "ng-reflect-model")
      .should(condition, value);
  }

  it("searches todo list", () => {
    listShouldHaveLength(6);

    cy.get(searchInput).type("de");

    firstOrLastTodoItemTitleShouldBe("first", "install NodeJS");
    homePage.getFirstOrLastTodoItem("first")
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

    homePage.getFirstOrLastTodoItem("first").find(".btn-red").click();

    firstOrLastTodoItemTitleShouldBe("first", "install Angular CLI");
    listShouldHaveLength(5);
  });

  it("edits todo item", () => {
    firstOrLastTodoItemTitleShouldBe("first", "install NodeJS");

    homePage.getFirstOrLastTodoItem("first").find(".btn-green").click();
    cy.get('[data-cy="editInput"]').type("test");
    homePage.getFirstOrLastTodoItem("first").contains("Done").click();

    firstOrLastTodoItemTitleShouldBe("first", "install NodeJStest");
  });

  it("checks todo item", () => {
    getFirstOrLastTodoItemTitle("first").should(
      "not.have.class",
      "todo-complete"
    );

    homePage.getFirstOrLastTodoItem("first").find('[type="checkbox"]').click();

    getFirstOrLastTodoItemTitle("first").should("have.class", "todo-complete");
  });

  it("moves todo item down", () => {
    firstOrLastTodoItemTitleShouldBe("first", "install NodeJS");

    homePage.getFirstOrLastTodoItem("first").find(".btn-down").click();

    firstOrLastTodoItemTitleShouldBe("first", "install Angular CLI");

    homePage.getFirstOrLastTodoItem("first")
      .next()
      .find(".todo-title")
      .should((text) => {
        expect(text.text().trim()).to.equal("install NodeJS");
      });
  });

  it("moves todo item up", () => {
    firstOrLastTodoItemTitleShouldBe("last", "deploy app");

    homePage.getFirstOrLastTodoItem("last").find(".btn-up").click();

    firstOrLastTodoItemTitleShouldBe("last", "develop app");

    homePage.getFirstOrLastTodoItem("last")
      .prev()
      .find(".todo-title")
      .should((text) => {
        expect(text.text().trim()).to.equal("deploy app");
      });
  });

  it("first todo item move up button is disabled", () => {
    homePage.getFirstOrLastTodoItem("first")
      .find(".btn-up")
      .should("have.attr", "disabled");
  });

  it("last todo item move down button is disabled", () => {
    homePage.getFirstOrLastTodoItem("last")
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
