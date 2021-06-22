import { searchInputFixture, getUniqueTitleNameFixture } from "../fixtures/input.fixture";
import { HomePagePo } from "../support/page-objects/home.po"


describe("todo ui test suite", () => {
  let homePage: HomePagePo;

  before("declare instance of home page and add data", () => {
    homePage = new HomePagePo();
    homePage.assertNavigateToAndVerifyHomePage();
    /*
    The todo list fixture is never utilized in this test suite.
    However, this is a placeholder as an example of how to import
    a larger data set to work with later on in the tests.
    */
    homePage.addTodoListFixture();
    homePage.removeTodoListFixture();
  })

  // https://docs.cypress.io/guides/references/best-practices#Dangling-state-is-your-friend
  beforeEach("state reset the recommended way", () => {
    homePage.removeItemsToBeDeleted();
  })

  it.only("searches todo list", () => {
    homePage.countItemsMatchingSearchInputFixture(searchInputFixture).then((expectedLength) => {
      homePage.searchInput.type(searchInputFixture);

      homePage.assertListLengthEqualTo(expectedLength);
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

      homePage.assertLastTodoItemTitleEqualTo(uniqueTitle);
      homePage.assertListLengthEqualTo(totalItems + 1);

      // Dynamic data cleanup pushed to reset state in beforeEach() hook
      homePage.itemsToBeDeleted.push(uniqueTitle);
    });
  });

  it("adds todo item via enter key", () => {
    homePage.countTotalItems().then(totalItems => {
      const uniqueTitle = getUniqueTitleNameFixture();

      homePage.todoInput.click().type(uniqueTitle).type("{enter}");

      homePage.assertLastTodoItemTitleEqualTo(uniqueTitle);
      homePage.assertListLengthEqualTo(totalItems + 1);

      // Dynamic data cleanup pushed to reset state in beforeEach() hook
      homePage.itemsToBeDeleted.push(uniqueTitle);
    });
  });

  it("removes todo item", () => {
    homePage.countTotalItems().then(totalItems => {
      const uniqueTitle = getUniqueTitleNameFixture();

      homePage.todoInput.click().type(uniqueTitle).type("{enter}");
      homePage.removeItemsByTitle(uniqueTitle);

      homePage.assertListLengthEqualTo(totalItems);
      homePage.assertItemByTitleDoesNotExist(uniqueTitle);
    });
  });

  it("edits todo item", () => {
    homePage.getFirstTodoItem().then(firstTodoItem => {
      const initialTitle = firstTodoItem.find('.todo-title').text();
      const uniqueTitle = getUniqueTitleNameFixture();

      homePage.editTitle(firstTodoItem, uniqueTitle)

      homePage.assertFirstTodoItemTitleEqualTo(uniqueTitle);

      // Data cleanup
      homePage.editTitle(firstTodoItem, initialTitle);
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

  it("moves todo item down and up", () => {
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
    })

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
  });

  it("first todo item move up button is disabled and last todo item move down button is disabled", () => {
    homePage.getFirstTodoItem()
      .find(".btn-up")
      .should("have.attr", "disabled");

    homePage.getLastTodoItem()
      .find(".btn-down")
      .should("have.attr", "disabled");
  });

  it("done button disabled when edit input is invalid", () => {
    homePage.getFirstTodoItem().then(firstTodoItem => {
      const intialTitle = firstTodoItem.find('.todo-title').text();

      cy.wrap(firstTodoItem).find('.btn-green').click();
      homePage.editInput.clear();

      cy.wrap(firstTodoItem).contains('Done').should("have.attr", "disabled");

      // Data cleanup
      homePage.editInput.type(intialTitle);
      cy.wrap(firstTodoItem).contains('Done').click();
    })
  })

  it("todo input invalid when clicking save immediately with no todo item entered", () => {
    homePage.saveButton.click();

    homePage.assertTodoInputHasClasses("ng-invalid");
  });

  it("todo input invalid when clicking save after clicking into todo item input with no todo item entered", () => {
    homePage.todoInput.click();
    homePage.saveButton.click();

    homePage.assertTodoInputHasClasses("ng-invalid");
  });

  it("todo input invalid when clicking save and previously typing and then deleting todo item input", () => {
    const uniqueTitle = getUniqueTitleNameFixture();

    homePage.todoInput.click().type(uniqueTitle).clear();

    homePage.assertTodoInputHasClasses("ng-invalid");
  });

  it("todo input invalid when clicking save and previously typing empty string as todo item input", () => {
    homePage.todoInput
      .click()
      .type("  1") // .type() does not take an empty input, so this is a hack
      .type("{backspace}");
    homePage.saveButton.click();

    homePage.assertTodoInputHasClasses("ng-invalid");
  });

  it("edit input invalid when clearing todo item input", () => {
    homePage.getFirstTodoItem().then(firstTodoItem => {
      const initialTitle = firstTodoItem.find('.todo-title').text();

      cy.wrap(firstTodoItem).find('.btn-green').click();
      homePage.editInput.clear();

      homePage.assertEditInputHasClasses("ng-invalid");

      // Data cleanup
      homePage.editInput.type(initialTitle);
      cy.wrap(firstTodoItem).contains("Done").click();
    })
  })

  it("edit input invalid when trying to submit empty string", () => {
    homePage.getFirstTodoItem().then(firstTodoItem => {
      const initialTitle = firstTodoItem.find('.todo-title').text();

      cy.wrap(firstTodoItem).find('.btn-green').click();
      homePage.editInput.clear();
      homePage.editInput
        .click()
        .type("  1") // .type() does not take an empty input, so this is a hack
        .type("{backspace}");

      homePage.assertEditInputHasClasses("ng-invalid");

      // Data cleanup
      homePage.editInput.clear().type(initialTitle);
      cy.wrap(firstTodoItem).contains("Done").click();
    })
  })
});
