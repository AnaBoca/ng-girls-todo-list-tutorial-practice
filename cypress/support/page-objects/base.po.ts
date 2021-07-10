export abstract class BasePage {
  abstract pageUrl: string;

  navigateTo() {
    cy.visit(`${this.pageUrl}`);
  }

  getPageElement(dataCyValue: string) {
    return cy.get(`[data-cy='${dataCyValue}']`);
  }
}
