import {HomePagePo} from "../support/home-page.po"

describe("ToDo UI test suite", () => {
  let homePage: HomePagePo;

  beforeEach("visit baseUrl", () => {
    homePage = new HomePagePo()
    homePage.navigateTo();
    homePage.isElementVisible("app-root", "h1");
    homePage.isElemTextContain("app-root", "h1", "To-Do")
  });

  it("searches todo list", () => {
    homePage.listShouldHaveLength(6);

    homePage.searchInput.type("de");

    homePage.firstTodoItemTitleShouldBe("install NodeJS");
    homePage.todoItemAtIndexTitleShouldBe(1, "develop app")
    homePage.lastTodoItemTitleShouldBe("deploy app");

    homePage.listShouldHaveLength(3);
  });

  it("adds todo item via enter key", () => {
    homePage.lastTodoItemTitleShouldBe("deploy app");
    homePage.listShouldHaveLength(6);

    homePage.todoInput.click().type("Entered todo item").type("{enter}");

    homePage.lastTodoItemTitleShouldBe("Entered todo item");
    homePage.listShouldHaveLength(7);
  });

  it("adds todo item via save button", () => {
    homePage.lastTodoItemTitleShouldBe("deploy app");
    homePage.listShouldHaveLength(6);

    homePage.todoInput.click().type("Saved todo item");
    homePage.saveButton.click();

    homePage.lastTodoItemTitleShouldBe("Saved todo item");
    homePage.listShouldHaveLength(7);
  });

  it("removes todo item", () => {
    homePage.firstTodoItemTitleShouldBe("install NodeJS");
    homePage.listShouldHaveLength(6);

    homePage.getFirstTodoItem().find(".btn-red").click();

    homePage.firstTodoItemTitleShouldBe("install Angular CLI");
    homePage.listShouldHaveLength(5);
  });

  it("edits todo item", () => {
    homePage.firstTodoItemTitleShouldBe("install NodeJS");

    homePage.getFirstTodoItem().find(".btn-green").click();
    homePage.editInput.type("test");
    homePage.getFirstTodoItem().contains("Done").click();

    homePage.firstTodoItemTitleShouldBe("install NodeJStest");
  });

  it("checks todo item", () => {
    homePage.getFirstTodoItemTitle().should(
      "not.have.class",
      "todo-complete"
    );

    homePage.getFirstTodoItem().find('[type="checkbox"]').click();

    homePage.getFirstTodoItemTitle().should("have.class", "todo-complete");
  });

  it("moves todo item down", () => {
    homePage.firstTodoItemTitleShouldBe("install NodeJS");

    homePage.getFirstTodoItem().find(".btn-down").click();

    homePage.firstTodoItemTitleShouldBe("install Angular CLI");

    homePage.todoItemAtIndexTitleShouldBe(1, "install NodeJS")
  });

  it("moves todo item up", () => {
    homePage.lastTodoItemTitleShouldBe("deploy app");

    homePage.getLastTodoItem().find(".btn-up").click();

    homePage.lastTodoItemTitleShouldBe("develop app");

    homePage.todoItemAtIndexTitleShouldBe(4, "deploy app")
  });

  it("first todo item move up button is disabled", () => {
    homePage.getFirstTodoItem()
      .find(".btn-up")
      .should("have.attr", "disabled");
  });

  it("last todo item move down button is disabled", () => {
    homePage.getLastTodoItem()
      .find(".btn-down")
      .should("have.attr", "disabled");
  });

  it("validation when clicking save immediately with no todo item entered", () => {
    homePage.todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("be.empty");

    homePage.saveButton.click();

    homePage.todoInputShouldHaveClasses("ng-untouched", "ng-dirty", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("be.empty");
  });

  it("validation when clicking save after clicking into todo item input with no todo item entered", () => {
    homePage.todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("be.empty");

    homePage.todoInput.click();
    homePage.saveButton.click();

    homePage.todoInputShouldHaveClasses("ng-touched", "ng-dirty", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("be.empty");
  });

  it("validation when clicking save and previously typing and then deleting todo item input", () => {
    homePage.todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("be.empty");

    homePage.todoInput.click().type("i'm gonna get deleted");
    homePage.todoInputAttrNgReflectModelShould("contain", "i'm gonna get deleted");
    homePage.todoInput.clear();

    homePage.todoInputShouldHaveClasses("ng-untouched", "ng-dirty", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("be.empty");
  });

  it("validation when clicking save and previously typing empty string as todo item input", () => {
    homePage.todoInputShouldHaveClasses("ng-untouched", "ng-pristine", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("be.empty");

    homePage.todoInput
      .click()
      .type("  1") // .type() does not take an empty input, so this is a hack
      .type("{backspace}");
    homePage.saveButton.click();

    homePage.todoInputShouldHaveClasses("ng-touched", "ng-dirty", "ng-invalid");
    homePage.todoInputAttrNgReflectModelShould("contain", "  ");
  });
});
