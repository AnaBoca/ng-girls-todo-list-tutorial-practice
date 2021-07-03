export abstract class BasePage {
  abstract pageUrl: string;

  navigateTo() {
    cy.visit(`${this.pageUrl}`);
  }

  assertElementIsVisible(baseSelector: string, itemSel?: string) {
    cy.get(`${baseSelector} ${itemSel}`).should('to.be.visible');
  }

  assertElementContainsText(
    baseSelector: string,
    itemSel: string,
    expectedText: string
  ) {
    cy.get(baseSelector)
      .find(itemSel)
      .invoke('text')
      .should('contain', expectedText);
  }

  getPageElement(dataCyValue: string) {
    return cy.get(`[data-cy='${dataCyValue}']`);
  }
}
