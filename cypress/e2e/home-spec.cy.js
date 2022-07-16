/// <reference types="cypress" />

const countries = Cypress.env('countries')
const regions = Cypress.env('regions')
const countByRegion = Cypress.env('countByRegion')

describe('Theme Toggle', () => {
  const visit = (darkAppearance) =>
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'matchMedia')
          .callThrough() // Call the real method for non-matched calls
          .withArgs('(prefers-color-scheme: dark)')
          .returns({
            matches: darkAppearance,
          })
      },
    })

  it('toggles the theme to dark mode', () => {
    const themeDark = false
    visit(themeDark)
    cy.findByText(/dark mode/i).click()
    cy.get('body').should('have.class', 'dark')
  })

  it('toggles the theme to light mode', () => {
    const themeDark = true
    visit(themeDark)
    cy.findByText(/dark mode/i).click()
    cy.get('body').should('not.have.class', 'light')
  })
})

describe('See all countries from the API on the homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it.skip('has no accessibility violations', () => {
    cy.injectAxe()
    cy.checkA11y({ exclude: ['.ReactQueryDevtools'] })
  })

  it('renders a series of cards', () => {
    cy.get('.card-container').should('not.be.empty')
  })

  it('contains the correct number of country cards', () => {
    cy.get('.card').should('have.length', countries.length)
  })
})

describe('Search for a country using a partial name', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it.skip('has no accessibility violations', () => {
    cy.injectAxe()
    cy.checkA11y({ exclude: ['.ReactQueryDevtools'] })
  })

  it('searches for `jam`', () => {
    cy.findByLabelText(/search for a country/i)
      .type('jam')
      .then(() => {
        cy.get('.card-container').should('not.be.empty')
        cy.get('.card').should('have.length', 1)
        cy.get('h2').should('have.text', 'Jamaica')
      })
  })
})

describe('When choosing a region', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  regions.forEach((region) => {
    it(`should filter the cards by the region: ${region}`, () => {
      cy.findByLabelText(/filter by region/i).click()
      cy.get(`[data-label="${region}"]`)
        .click()
        .then(() => {
          cy.get('.card-container').should('not.be.empty')
          cy.get('.card').should('have.length', countByRegion[region])
        })
    })
  })
})

describe('When clicking on a specific country', () => {
  const countryName = 'Belgium'
  const countryCode = 'BEL'
  const borderCountryCode = 'FRA'
  const borderCountryName = 'France'

  it('should show more detailed information', () => {
    cy.visit('/')
    cy.findByRole('link', { name: countryName })
      .should('exist')
      .and('have.attr', 'href', `/details/${countryCode}`)
      .click()
    cy.location('pathname').should('equal', `/details/${countryCode}`)
    cy.get('.country-name').should('have.text', countryName)
  })

  it('should allow navigation to border countries', () => {
    cy.visit(`/details/${countryCode}`)
    cy.findByRole('link', { name: borderCountryName })
      .should('exist')
      .and('have.attr', 'href', `/details/${borderCountryCode}`)
      .click()
    cy.location('pathname').should('equal', `/details/${borderCountryCode}`)
    cy.get('.country-name').should('have.text', borderCountryName)
  })
})
