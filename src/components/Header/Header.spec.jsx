import { mount } from '@cypress/react'
import Header from './Header'

it('renders the title', () => {
  mount(<Header />)
  cy.get('h1').contains('Where in the world?')
})
