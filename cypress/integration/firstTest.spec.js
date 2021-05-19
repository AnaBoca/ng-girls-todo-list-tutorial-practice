describe("First test suite", () => {
  beforeEach("visit baseUrl", () => {
    cy.visit("/");
  });

  it("add Item to ToDo List", () => {
    cy.get(".todo-input").click().type("Test item").type("{enter}");
  });
});
