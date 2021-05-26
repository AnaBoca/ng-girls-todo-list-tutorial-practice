export abstract class BasePage {
  abstract pageUrl: string;

  navigateTo() {
    cy.visit(`${this.pageUrl}`);
  }

  isElementVisible(baseSelector: string, itemSel?: string) {
    cy.get(`${baseSelector} ${itemSel}`).should('to.be.visible');
  }

  isElemTextContain(baseSelector: string, itemSel: string, expectedText: string) {
    cy.get(baseSelector).find(itemSel).invoke('text').should('contain', expectedText);
  }
}
