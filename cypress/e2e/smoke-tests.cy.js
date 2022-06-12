describe('empty spec', () => {
  it('passes', () => {
    cy.visit('/')
  })
})

describe('See all countries from the API on the homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it.only('renders a series of cards', () => {
    cy.findByRole('link', { name: 'Afghanistan' }).should('exist')
  })

  it('contains the correct number of country cards', () => {
    cy.findAllByRole('link').should('have.length', 250)
  })
})
