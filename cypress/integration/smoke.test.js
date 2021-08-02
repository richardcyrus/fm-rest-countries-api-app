function testA11y() {
  cy.injectAxe()
  ;['iphone-6', 'ipad-2', 'macbook-15'].forEach((size) => {
    if (Cypress._.isArray(size)) {
      cy.viewport(size[0], size[1])
    } else {
      cy.viewport(size)
    }
    cy.get('h1').contains('Where in the world?')
    cy.checkA11y()
  })
}

const visit = (darkAppearance) =>
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'matchMedia')
        .withArgs('(prefers-color-scheme: dark)')
        .returns({
          matches: darkAppearance,
        })
    },
  })

describe('a11y', () => {
  describe('light theme', () => {
    it('should be accessible', () => {
      visit(false)
      testA11y()
    })
  })

  describe('dark theme', () => {
    it('should be accessible', () => {
      visit(true)
      testA11y()
    })
  })

  // it('Theme toggle toggles the theme to dark mode', () => {
  //   cy.contains('Dark Mode').click()
  //   cy.get('body').should('have.class', 'dark')
  // })
})
