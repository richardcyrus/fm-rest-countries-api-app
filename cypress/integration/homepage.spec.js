describe('The HomePage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Theme toggle toggles the theme to dark mode', function () {
    cy.contains('Dark Mode').click()
    cy.get('body').should('have.class', 'dark')
  })
})
