describe('empty spec', () => {
  it('passes', () => {
    cy.visit('/')
  })
})

describe('See all countries from the API on the homepage', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
  })

  it("has no accessibility violations", () => {
    cy.checkA11y();
  });

  it('renders a series of cards', () => {
    cy.findByRole('link', { name: 'Afghanistan' }).should('exist')
  })

  it('contains the correct number of country cards', () => {
    cy.get('.card').should('have.length', 250)
  })
})
