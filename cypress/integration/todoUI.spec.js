describe("ToDo UI test suite", () => {
  beforeEach("visit baseUrl", () => {
    cy.visit("/");
  });

  const todoInput = "[data-cy='todo-input']";
  const saveButton = "[data-cy='save-button']";
  const todoUl = "[data-cy='todo-ul']";

  it("add todo item via enter key", () => {
    cy.get(todoUl).children().should("have.length", 6);

    cy.get(todoInput).click().type("Entered todo item").type("{enter}");

    cy.get(todoUl + " li span")
      .last()
      .should((text) => {
        expect(text.text().trim()).to.equal("Entered todo item");
      });

    cy.get(todoUl).children().should("have.length", 7);
  });

  it("add todo item via save button", () => {
    cy.get(todoUl).children().should("have.length", 6);

    cy.get(todoInput).click().type("Saved todo item");

    cy.get(saveButton).click();

    cy.get(todoUl + " li span")
      .last()
      .should((text) => {
        expect(text.text().trim()).to.equal("Saved todo item");
      });

    cy.get(todoUl).children().should("have.length", 7);
  });
});
