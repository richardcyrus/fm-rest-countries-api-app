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

describe('The HomePage', () => {
  beforeEach(() => {
    visit(false)
  })

  it('Theme toggle toggles the theme to dark mode', () => {
    cy.contains('Dark Mode').click()
    cy.get('body').should('have.class', 'dark')
  })
})
