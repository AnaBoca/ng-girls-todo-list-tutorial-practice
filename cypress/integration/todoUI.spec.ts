import { searchInputFixture, getUniqueTitleNameFixture} from "../fixtures/inputFixtures";
import {HomePagePo} from "../support/home-page.po"


describe("ToDo UI test suite", () => {
  let homePage: HomePagePo;

  before("declare instance of home page and add data", () => {
    homePage = new HomePagePo();
    homePage.navigateToAndVerifyHomePage();
    homePage.addTodoListFixture();
  })

  beforeEach("placeholder", () => {
  });

  after("data cleanup", () => {
    homePage.removeTodoListFixture();
    homePage.removeItemsToBeDeleted();
  })

  it("searches todo list", () => {
    homePage.countItemsMatchingSearchInputFixture(searchInputFixture).then((expectedLength) => {
      homePage.searchInput.type(searchInputFixture);

      homePage.listShouldHaveLength(expectedLength);
      homePage.todoItems.each(li => {
        cy.wrap(li).should('contain', searchInputFixture);
      })

      // Data cleanup
      homePage.searchInput.clear();
    });

  });

  it("adds todo item via save button", () => {
    homePage.countTotalItems().then(totalItems => {
      const uniqueTitle = getUniqueTitleNameFixture();

      homePage.todoInput.click().type(uniqueTitle);
      homePage.saveButton.click();

      homePage.lastTodoItemTitleShouldBe(uniqueTitle);
      homePage.listShouldHaveLength(totalItems + 1);

      // More dynamic data cleanup
      homePage.itemsToBeDeleted.push(uniqueTitle)

      // Previous individual test data cleanup
      // homePage.removeItemsByTitle(uniqueTitle);
    });
  });

  it("adds todo item via enter key", () => {
    homePage.countTotalItems().then(totalItems => {
      const uniqueTitle = getUniqueTitleNameFixture();

      homePage.todoInput.click().type(uniqueTitle).type("{enter}");

      homePage.lastTodoItemTitleShouldBe(uniqueTitle);
      homePage.listShouldHaveLength(totalItems + 1);

      // More dynamic data cleanup
      homePage.itemsToBeDeleted.push(uniqueTitle);

      // Previous individual test data cleanup
      // homePage.removeItemsByTitle(uniqueTitle);
    });
  });

  it("removes todo item", () => {
    homePage.countTotalItems().then(totalItems => {
      const uniqueTitle = getUniqueTitleNameFixture();

      homePage.todoInput.click().type(uniqueTitle).type("{enter}");
      homePage.removeItemsByTitle(uniqueTitle);

      homePage.listShouldHaveLength(totalItems);
      homePage.expectItemToNotExist(uniqueTitle);
    });
  });

  it("edits todo item", () => {
    homePage.getFirstTodoItem().then(firstTodoItem => {
      const initialTitle = firstTodoItem.find('.todo-title').text();
      const uniqueTitle = getUniqueTitleNameFixture();

      homePage.editTitle(firstTodoItem, uniqueTitle)

      homePage.firstTodoItemTitleShouldBe(uniqueTitle);

      // Data cleanup
      homePage.editTitle(firstTodoItem, initialTitle)
    })
  });

  it("checks todo item", () => {
    homePage.getFirstUncheckedItem().then(uncheckedItem => {
      const checkboxEl = uncheckedItem.find('input[type="checkbox"]')[0];

      cy.wrap(checkboxEl).check();

      const titleEl = uncheckedItem.find('.todo-title')[0];

      cy.wrap(titleEl).should('have.class', 'todo-complete');

      // Data cleanup
      cy.wrap(checkboxEl).click();
    })

  });

  it("moves todo item down", () => {
    homePage.getTodoItemAtIndex(0).then((initialFirstTodoItemJq) => {
      const initialFirstTodoItem = initialFirstTodoItemJq[0];

      homePage.getTodoItemAtIndex(1).then((initialSecondTodoItemJq) => {
        const initialSecondTodoItem = initialSecondTodoItemJq[0];

        homePage.getTodoItemAtIndex(0).find(".btn-down").click();

        homePage.getTodoItemAtIndex(0).then((updatedFirstTodoItemJq) => {
          const updatedFirstTodoItem = updatedFirstTodoItemJq[0];

          homePage.getTodoItemAtIndex(1).then((updatedSecondTodoItemJq) => {
            const updatedSecondTodoItem = updatedSecondTodoItemJq[0];

            expect(updatedFirstTodoItem).to.equal(initialSecondTodoItem);
            expect(updatedSecondTodoItem).to.equal(initialFirstTodoItem);
          })
        })
      })
      // Data cleanup
      homePage.getTodoItemAtIndex(0).find('.btn-down').click();
    })
  });

  it("moves todo item up", () => {
    homePage.getTodoItemAtIndex(0).then((initialFirstTodoItemJq) => {
      const initialFirstTodoItem = initialFirstTodoItemJq[0];

      homePage.getTodoItemAtIndex(1).then((initialSecondTodoItemJq) => {
        const initialSecondTodoItem = initialSecondTodoItemJq[0];

        homePage.getTodoItemAtIndex(1).find(".btn-up").click();

        homePage.getTodoItemAtIndex(0).then((updatedFirstTodoItemJq) => {
          const updatedFirstTodoItem = updatedFirstTodoItemJq[0];

          homePage.getTodoItemAtIndex(1).then((updatedSecondTodoItemJq) => {
            const updatedSecondTodoItem = updatedSecondTodoItemJq[0];

            expect(updatedFirstTodoItem).to.equal(initialSecondTodoItem);
            expect(updatedSecondTodoItem).to.equal(initialFirstTodoItem);
          })
        })
      })
    })
     // Data cleanup
     homePage.getTodoItemAtIndex(1).find('.btn-up').click();
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

  it("invalid when clicking save immediately with no todo item entered", () => {
    homePage.saveButton.click();

    homePage.todoInputShouldHaveClasses("ng-invalid");
  });

  it("invalid when clicking save after clicking into todo item input with no todo item entered", () => {
    homePage.todoInput.click();
    homePage.saveButton.click();

    homePage.todoInputShouldHaveClasses("ng-invalid");
  });

  it("invalid when clicking save and previously typing and then deleting todo item input", () => {
    const uniqueTitle = getUniqueTitleNameFixture();

    homePage.todoInput.click().type(uniqueTitle).clear();

    homePage.todoInputShouldHaveClasses("ng-invalid");
  });

  it("invalid when clicking save and previously typing empty string as todo item input", () => {
    homePage.todoInput
      .click()
      .type("  1") // .type() does not take an empty input, so this is a hack
      .type("{backspace}");
    homePage.saveButton.click();

    homePage.todoInputShouldHaveClasses("ng-invalid");
  });
});
