function testA11y() {
  cy.injectAxe()
  ;['iphone-6', 'ipad-2', 'macbook-15'].forEach((size) => {
    if (Cypress._.isArray(size)) {
      cy.viewport(size[0], size[1])
    } else {
      cy.viewport(size)
    }
    cy.get('[data-test=page-title]').contains('Where in the world?')
    cy.checkA11y({ exclude: ['.ReactQueryDevtools'] })
  })
}

const visit = (darkAppearance) =>
  cy.visit('/', {
    onBeforeLoad(window) {
      cy.stub(window, 'matchMedia')
        .callThrough() // Call the real method for non-matched calls.
        .withArgs('(prefers-color-scheme: dark)')
        .returns({
          matches: darkAppearance,
        })
    },
  })

describe('See all countries from the API on the homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders a series of cards', () => {
    cy.get('[data-test=card-list]').should('exist')
  })

  it('contains the correct number of country cards', () => {
    cy.get('[data-test=card]').should('have.length', 250)
  })
})

describe('Search for a country using an `input` field', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('searches for `afgan`', () => {
    const countryCode = 'AFG'
    cy.get('[data-test=search-input]').type('afgan')
    cy.get('[data-test=card]').should('have.length', 1)
    cy.get(`[data-test=country-${countryCode}-name]`).should(
      'have.text',
      'Afghanistan'
    )
    cy.get(`[data-test=country-${countryCode}-region]`).should(
      'have.text',
      'Asia'
    )
  })
})

describe('When choosing the region `Africa`', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should filter the cards by that region', () => {
    cy.get('[data-test=listbox-button]').click()
    cy.get('[data-test=listbox-option]').contains('Africa').click()
    cy.get('[data-test=card]').should('have.length', 60)
  })
})

describe('When clicking on the country `Belgium`', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should show more detailed information on a separate page', () => {
    const countryCode = 'BEL'
    cy.get(`[data-test=country-${countryCode}-card]`).click()
    cy.location('pathname').should('equal', `/details/${countryCode}`)
    cy.get(`[data-test=country-${countryCode}-name]`).should(
      'have.text',
      'Belgium'
    )
  })
  it('should allow click through to the border countries on the detail page', () => {
    const countryCode = 'BEL'
    const borderCountryCode = 'FRA'
    cy.get(`[data-test=country-${countryCode}-card]`).click()
    cy.location('pathname').should('equal', `/details/${countryCode}`)
    cy.get(`[data-test=border-country-${borderCountryCode}-link]`)
      .should('have.text', 'France')
      .click()
    cy.location('pathname').should('equal', `/details/${borderCountryCode}`)
    cy.get(`[data-test=country-${borderCountryCode}-name]`).should(
      'have.text',
      'France'
    )
  })
})

describe('Toggle the color scheme between light and dark mode', () => {
  it('toggle the theme to dark mode', () => {
    visit(false)
    cy.get('[data-test=theme-toggle]').click()
    cy.get('body').should('have.class', 'dark')
  })
  it('toggle the theme to light mode', () => {
    visit(true)
    cy.get('[data-test=theme-toggle]').click()
    cy.get('body').should('not.have.class', 'dark')
  })
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
})
